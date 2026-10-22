#!/usr/bin/env tsx

/**
 * Removes content types from the space:
 *
 *  - Strips the IDs from every other type's link validations
 *    (single links, arrays and rich text node rules)
 *  - Unpublishes and deletes each type, but only if it has no entries
 *
 * Safe to re-run: types that are already gone are skipped.
 *
 * Usage: npm run remove-content-types <contentTypeId> [contentTypeId...]
 */

import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const SPACE_ID = process.env.NEXT_PUBLIC_CF_SPACE!;
const ENVIRONMENT_ID = process.env.NEXT_PUBLIC_CF_ENVIRONMENT!;
const CMA_TOKEN = process.env.NEXT_CF_MANAGEMENT_TOKEN!;

if (!SPACE_ID || !ENVIRONMENT_ID || !CMA_TOKEN) {
  console.error(
    "❌ Missing env. Required: NEXT_PUBLIC_CF_SPACE, NEXT_PUBLIC_CF_ENVIRONMENT, NEXT_CF_MANAGEMENT_TOKEN",
  );
  process.exit(1);
}

const targetIds = process.argv.slice(2);
if (!targetIds.length) {
  console.error("❌ Please provide at least one content type ID.");
  console.error(
    "💡 Usage: npm run remove-content-types <contentTypeId> [contentTypeId...]",
  );
  process.exit(1);
}

const BASE = `https://api.contentful.com/spaces/${SPACE_ID}/environments/${ENVIRONMENT_ID}`;

/* eslint-disable @typescript-eslint/no-explicit-any */
type Json = any;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const cma = async (
  method: "GET" | "PUT" | "DELETE",
  path: string,
  { body, version }: { body?: Json; version?: number } = {},
) => {
  for (let attempt = 0; attempt < 6; attempt++) {
    const response = await fetch(`${BASE}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${CMA_TOKEN}`,
        "Content-Type": "application/vnd.contentful.management.v1+json",
        ...(version !== undefined
          ? { "X-Contentful-Version": version.toString() }
          : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (response.status === 429) {
      await sleep(1500 * (attempt + 1));
      continue;
    }

    const text = await response.text();
    return {
      ok: response.ok,
      status: response.status,
      json: text ? JSON.parse(text) : null,
    };
  }
  throw new Error(`Rate limited: ${method} ${path}`);
};

const fail = (step: string, res: { status: number; json: Json }) => {
  console.error(`❌ ${step} failed (${res.status}):`);
  console.error(JSON.stringify(res.json, null, 2));
  process.exit(1);
};

/** Removes target IDs from every linkContentType list in a validations array. */
const stripValidations = (
  validations: Json[] | undefined,
  location: string,
): boolean => {
  let changed = false;

  validations?.forEach((validation) => {
    if (validation.linkContentType) {
      const kept = validation.linkContentType.filter(
        (id: string) => !targetIds.includes(id),
      );
      if (kept.length === validation.linkContentType.length) return;
      if (!kept.length) {
        // An empty list would allow linking to ANY content type
        console.error(
          `❌ Removing ${validation.linkContentType.join(", ")} would leave ${location} with no allowed types. Update it manually first.`,
        );
        process.exit(1);
      }
      validation.linkContentType = kept;
      changed = true;
    }

    // Rich text: { nodes: { "embedded-entry-block": [{ linkContentType }] } }
    if (validation.nodes) {
      Object.entries(validation.nodes).forEach(([nodeType, rules]) => {
        if (stripValidations(rules as Json[], `${location} (${nodeType})`)) {
          changed = true;
        }
      });
    }
  });

  return changed;
};

const removeReferences = async () => {
  const response = await cma("GET", "/content_types?limit=1000");
  if (!response.ok) fail("Fetching content types", response);

  for (const contentType of response.json.items) {
    const id = contentType.sys.id;
    if (targetIds.includes(id)) continue;

    let changed = false;
    for (const field of contentType.fields) {
      const location = `${id}.${field.id}`;
      if (stripValidations(field.validations, location)) changed = true;
      if (stripValidations(field.items?.validations, location)) changed = true;
    }
    if (!changed) continue;

    const { name, description, displayField, fields } = contentType;
    const saved = await cma("PUT", `/content_types/${id}`, {
      body: { name, description, displayField, fields },
      version: contentType.sys.version,
    });
    if (!saved.ok) fail(`Saving "${id}"`, saved);

    const published = await cma("PUT", `/content_types/${id}/published`, {
      version: saved.json.sys.version,
    });
    if (!published.ok) fail(`Publishing "${id}"`, published);

    console.log(`✂️  Removed references from "${id}".`);
  }
};

const deleteContentType = async (id: string) => {
  const existing = await cma("GET", `/content_types/${id}`);
  if (existing.status === 404) {
    return console.log(`ℹ️  "${id}" already removed.`);
  }
  if (!existing.ok) fail(`Fetching "${id}"`, existing);

  const entries = await cma(
    "GET",
    `/entries?content_type=${id}&limit=1000&select=sys.id`,
  );
  if (!entries.ok) fail(`Checking "${id}" entries`, entries);
  if (entries.json.total > 0) {
    const ids = entries.json.items.map((item: Json) => item.sys.id);
    console.warn(
      `⚠️  "${id}" still has ${entries.json.total} entries, so it was NOT deleted: ${ids.join(", ")}`,
    );
    return;
  }

  if (existing.json.sys.publishedVersion) {
    const unpublished = await cma("DELETE", `/content_types/${id}/published`);
    if (!unpublished.ok) fail(`Unpublishing "${id}"`, unpublished);
  }

  const deleted = await cma("DELETE", `/content_types/${id}`);
  if (!deleted.ok) fail(`Deleting "${id}"`, deleted);
  console.log(`🗑️  Deleted "${id}".`);
};

const run = async () => {
  await removeReferences();
  for (const id of targetIds) {
    await deleteContentType(id);
  }
  console.log(
    "\n🎉 Done. Run `npm run export-models-only` to refresh commands/json/models-export.json.",
  );
};

run();
