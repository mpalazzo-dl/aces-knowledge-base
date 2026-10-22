#!/usr/bin/env tsx

/**
 * Creates the 📁 Resource content type and wires it into the rest of the model.
 *
 *  - Creates + publishes the `resource` content type (and its editor interface)
 *  - Removes the legacy `thumbnail` field if present
 *  - Allows `resource` in Link.pageLink (replacing `pdfDocument`)
 *  - Allows `resource` in Page.pageBody
 *  - Allows `resource` as an embedded block + entry hyperlink in Article.bodyCopy
 *  - Deletes the legacy `pdfDocument` content type if it has no entries
 *
 * Safe to re-run: every step checks the current state before changing it.
 *
 * Usage: npm run create-resource-model
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

const BASE = `https://api.contentful.com/spaces/${SPACE_ID}/environments/${ENVIRONMENT_ID}`;
const RESOURCE_ID = "resource";
const LEGACY_PDF_ID = "pdfDocument";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Json = any;

const cma = async (
  method: "GET" | "PUT" | "DELETE",
  path: string,
  { body, version }: { body?: Json; version?: number } = {},
) => {
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

  const text = await response.text();
  const json = text ? JSON.parse(text) : null;
  return { ok: response.ok, status: response.status, json };
};

const fail = (step: string, res: { status: number; json: Json }) => {
  console.error(`❌ ${step} failed (${res.status}):`);
  console.error(JSON.stringify(res.json, null, 2));
  process.exit(1);
};

const getContentType = async (id: string) => {
  const res = await cma("GET", `/content_types/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) fail(`Fetching content type "${id}"`, res);
  return res.json;
};

const saveAndPublish = async (contentType: Json) => {
  const id = contentType.sys.id;
  const { name, description, displayField, fields } = contentType;

  const saved = await cma("PUT", `/content_types/${id}`, {
    body: { name, description, displayField, fields },
    version: contentType.sys.version,
  });
  if (!saved.ok) fail(`Saving content type "${id}"`, saved);

  const published = await cma("PUT", `/content_types/${id}/published`, {
    version: saved.json.sys.version,
  });
  if (!published.ok) fail(`Publishing content type "${id}"`, published);

  return published.json;
};

// Resource content type ---------------------------------------------------

const resourceFields = [
  {
    id: "internalTitle",
    name: "Internal Title",
    type: "Symbol",
    localized: false,
    required: true,
    validations: [{ unique: true }],
  },
  {
    id: "title",
    name: "Title",
    type: "Symbol",
    localized: true,
    required: true,
    validations: [],
  },
  {
    id: "slug",
    name: "Slug",
    type: "Symbol",
    localized: false,
    required: true,
    validations: [
      { unique: true },
      {
        regexp: { pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$", flags: null },
        message: "Lowercase letters, numbers and dashes only",
      },
    ],
  },
  {
    id: "description",
    name: "Description",
    type: "Text",
    localized: true,
    required: false,
    validations: [{ size: { max: 1000 } }],
  },
  {
    id: "file",
    name: "File",
    type: "Link",
    linkType: "Asset",
    localized: false,
    required: true,
    validations: [],
  },
  {
    id: "categories",
    name: "Categories",
    type: "Array",
    localized: false,
    required: false,
    validations: [],
    items: {
      type: "Link",
      linkType: "Entry",
      validations: [{ linkContentType: ["categories"] }],
    },
  },
  {
    id: "searchKeywords",
    name: "Search Keywords",
    type: "Array",
    localized: false,
    required: false,
    validations: [],
    items: {
      type: "Symbol",
      validations: [
        {
          regexp: { pattern: "^[^A-Z]+$", flags: null },
          message: "Must be lowercase",
        },
      ],
    },
  },
  {
    id: "publishDate",
    name: "Publish Date",
    type: "Date",
    localized: false,
    required: false,
    validations: [],
  },
  {
    id: "featured",
    name: "Featured",
    type: "Boolean",
    localized: false,
    required: false,
    validations: [],
    defaultValue: { "en-US": false },
  },
  {
    id: "relatedResources",
    name: "Related Resources",
    type: "Array",
    localized: false,
    required: false,
    validations: [{ size: { max: 6 } }],
    items: {
      type: "Link",
      linkType: "Entry",
      validations: [{ linkContentType: [RESOURCE_ID] }],
    },
  },
];

const resourceEditorControls = [
  {
    fieldId: "internalTitle",
    widgetId: "singleLine",
    widgetNamespace: "builtin",
  },
  { fieldId: "title", widgetId: "singleLine", widgetNamespace: "builtin" },
  {
    fieldId: "slug",
    widgetId: "slugEditor",
    widgetNamespace: "builtin",
    settings: {
      trackingFieldId: "title",
      helpText: "The resource lives at /resources/{slug}. Keep it stable.",
    },
  },
  {
    fieldId: "description",
    widgetId: "multipleLine",
    widgetNamespace: "builtin",
  },
  {
    fieldId: "file",
    widgetId: "assetLinkEditor",
    widgetNamespace: "builtin",
    settings: {
      helpText:
        "Any file type. The site detects the type (PDF, slides, video…) from the file itself.",
    },
  },
  {
    fieldId: "categories",
    widgetId: "entryLinksEditor",
    widgetNamespace: "builtin",
  },
  {
    fieldId: "searchKeywords",
    widgetId: "tagEditor",
    widgetNamespace: "builtin",
  },
  {
    fieldId: "publishDate",
    widgetId: "datePicker",
    widgetNamespace: "builtin",
    settings: { format: "dateonly" },
  },
  {
    fieldId: "featured",
    widgetId: "boolean",
    widgetNamespace: "builtin",
    settings: { trueLabel: "Yes", falseLabel: "No" },
  },
  {
    fieldId: "relatedResources",
    widgetId: "entryLinksEditor",
    widgetNamespace: "builtin",
  },
];

const createResourceType = async () => {
  const existing = await getContentType(RESOURCE_ID);
  if (existing) {
    console.log(`ℹ️  "${RESOURCE_ID}" content type already exists.`);
    return;
  }

  console.log(`🚀 Creating "${RESOURCE_ID}" content type...`);
  const created = await cma("PUT", `/content_types/${RESOURCE_ID}`, {
    body: {
      name: "📁 Resource",
      description:
        "A downloadable file (PDF, slide deck, video, document…) with metadata. Rendered at /resources/{slug}.",
      displayField: "internalTitle",
      fields: resourceFields,
    },
  });
  if (!created.ok) fail(`Creating "${RESOURCE_ID}"`, created);

  const published = await cma(
    "PUT",
    `/content_types/${RESOURCE_ID}/published`,
    { version: created.json.sys.version },
  );
  if (!published.ok) fail(`Publishing "${RESOURCE_ID}"`, published);
  console.log(`✅ "${RESOURCE_ID}" content type published.`);

  const editor = await cma(
    "GET",
    `/content_types/${RESOURCE_ID}/editor_interface`,
  );
  if (!editor.ok) fail("Fetching resource editor interface", editor);

  const updatedEditor = await cma(
    "PUT",
    `/content_types/${RESOURCE_ID}/editor_interface`,
    {
      body: { controls: resourceEditorControls },
      version: editor.json.sys.version,
    },
  );
  if (!updatedEditor.ok)
    fail("Updating resource editor interface", updatedEditor);
  console.log("✅ Resource editor interface configured.");
};

/** Removes the legacy optional `thumbnail` field (no longer part of the model). */
const removeThumbnailField = async () => {
  let contentType = await getContentType(RESOURCE_ID);
  const thumbnail = contentType?.fields.find((f: Json) => f.id === "thumbnail");
  if (!thumbnail) {
    return console.log("ℹ️  Resource.thumbnail already removed.");
  }

  const entries = await cma(
    "GET",
    `/entries?content_type=${RESOURCE_ID}&fields.thumbnail.sys.id[exists]=true&limit=1`,
  );
  if (!entries.ok) fail("Checking resource thumbnails", entries);
  if (entries.json.total > 0) {
    console.warn(
      `⚠️  ${entries.json.total} resources still set a thumbnail; clear them and re-run to remove the field.`,
    );
    return;
  }

  if (!thumbnail.omitted) {
    thumbnail.omitted = true;
    contentType = await saveAndPublish(contentType);
  }
  contentType.fields.find((f: Json) => f.id === "thumbnail").deleted = true;
  await saveAndPublish(contentType);
  console.log("🗑️  Removed Resource.thumbnail.");
};

// Wiring into other types --------------------------------------------------

/** Ensures `resource` is in a linkContentType list; optionally drops `remove`. */
const ensureLinkContentType = (
  validations: Json[] | undefined,
  remove?: string,
) => {
  const validation = validations?.find((v) => v.linkContentType);
  if (!validation) return false;

  const before = validation.linkContentType.join(",");
  validation.linkContentType = Array.from(
    new Set(
      [...validation.linkContentType, RESOURCE_ID].filter(
        (id) => id !== remove,
      ),
    ),
  );
  return before !== validation.linkContentType.join(",");
};

const updateLinkType = async () => {
  const contentType = await getContentType("link");
  if (!contentType) return console.warn('⚠️  "link" content type not found.');

  const pageLink = contentType.fields.find((f: Json) => f.id === "pageLink");
  if (!ensureLinkContentType(pageLink?.validations, LEGACY_PDF_ID)) {
    return console.log("ℹ️  Link.pageLink already accepts resources.");
  }

  await saveAndPublish(contentType);
  console.log("✅ Link.pageLink now accepts resources.");
};

const updatePageBody = async () => {
  const contentType = await getContentType("page");
  if (!contentType) return console.warn('⚠️  "page" content type not found.');

  const pageBody = contentType.fields.find((f: Json) => f.id === "pageBody");
  if (!ensureLinkContentType(pageBody?.items?.validations)) {
    return console.log("ℹ️  Page.pageBody already accepts resources.");
  }

  await saveAndPublish(contentType);
  console.log("✅ Page.pageBody now accepts resources.");
};

const updateArticleBodyCopy = async () => {
  const contentType = await getContentType("article");
  if (!contentType)
    return console.warn('⚠️  "article" content type not found.');

  const bodyCopy = contentType.fields.find((f: Json) => f.id === "bodyCopy");
  const nodes = bodyCopy?.validations?.find((v: Json) => v.nodes)?.nodes;
  if (!nodes) return console.warn("⚠️  Article.bodyCopy has no node rules.");

  let changed = false;
  for (const nodeType of ["embedded-entry-block", "entry-hyperlink"]) {
    if (!nodes[nodeType]?.length) {
      nodes[nodeType] = [{ linkContentType: [RESOURCE_ID], message: null }];
      changed = true;
    } else if (ensureLinkContentType(nodes[nodeType])) {
      changed = true;
    }
  }

  if (!changed) {
    return console.log("ℹ️  Article.bodyCopy already accepts resources.");
  }

  await saveAndPublish(contentType);
  console.log("✅ Article.bodyCopy now accepts resources.");
};

// Legacy cleanup -----------------------------------------------------------

const deleteLegacyPdfType = async () => {
  const contentType = await getContentType(LEGACY_PDF_ID);
  if (!contentType) {
    return console.log(`ℹ️  "${LEGACY_PDF_ID}" already removed.`);
  }

  const entries = await cma(
    "GET",
    `/entries?content_type=${LEGACY_PDF_ID}&limit=1000&select=sys.id`,
  );
  if (!entries.ok) fail(`Checking "${LEGACY_PDF_ID}" entries`, entries);

  if (entries.json.total > 0) {
    const ids = entries.json.items.map((item: Json) => item.sys.id);
    console.warn(
      `⚠️  "${LEGACY_PDF_ID}" still has ${entries.json.total} entries, so it was NOT deleted.`,
    );
    console.warn(
      `   Recreate them as Resources, delete them, then re-run: ${ids.join(", ")}`,
    );
    return;
  }

  if (contentType.sys.publishedVersion) {
    const unpublished = await cma(
      "DELETE",
      `/content_types/${LEGACY_PDF_ID}/published`,
    );
    if (!unpublished.ok) fail(`Unpublishing "${LEGACY_PDF_ID}"`, unpublished);
  }

  const deleted = await cma("DELETE", `/content_types/${LEGACY_PDF_ID}`);
  if (!deleted.ok) fail(`Deleting "${LEGACY_PDF_ID}"`, deleted);
  console.log(`🗑️  Deleted legacy "${LEGACY_PDF_ID}" content type.`);
};

const run = async () => {
  await createResourceType();
  await removeThumbnailField();
  await updateLinkType();
  await updatePageBody();
  await updateArticleBodyCopy();
  await deleteLegacyPdfType();
  console.log(
    "\n🎉 Done. Run `npm run export-models-only` to refresh commands/json/models-export.json.",
  );
};

run();
