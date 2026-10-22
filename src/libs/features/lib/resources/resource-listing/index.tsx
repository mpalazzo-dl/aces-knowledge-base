"use client";

import { useEffect, useMemo, useState } from "react";

import { defaultLocale, Locale } from "@aces/i18n";
import { useMediaQuery, useQueryParam } from "@aces/hooks";
import { useResourcesState } from "@aces/store";
import { CfResource, CfResourceCategory, ResourceFileKind } from "@aces/types";
import { palette } from "@aces/theme";
import { Box, Col, FlexBox, Row, Text, TextButton } from "@aces/ui";

import { ResourceCard, ResourceListCard } from "../resource-card";
import {
  ResourceListingConfig,
  ResourceOrderTypes,
  ResourceQuery,
} from "../config";
import { FileKindOrder, getFileKind } from "../file-kind";
import { useResourceLabels } from "../labels";
import { getResourceDate } from "../utils";
import { LoadMore } from "../../pagination";
import {
  AllValue,
  CategoryFilter,
  DisplayToggle,
  ResourceSearch,
  SortSelect,
  TypeFilter,
} from "./filters";

interface IndexedResource {
  resource: CfResource;
  kind: ResourceFileKind;
  haystack: string;
}

const indexResource = (resource: CfResource): IndexedResource => ({
  resource,
  kind: getFileKind(resource.file),
  haystack: [
    resource.title,
    resource.description,
    resource.file?.fileName,
    ...(resource.searchKeywords || []),
    ...(resource.categoriesCollection?.items || []).map((item) => item.title),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase(),
});

const matchesSearch = (item: IndexedResource, search: string) =>
  search
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => item.haystack.includes(term));

const matchesCategory = (item: IndexedResource, category: string) =>
  category === AllValue ||
  !!item.resource.categoriesCollection?.items.some(
    (entry) => entry.slug === category,
  );

const matchesType = (item: IndexedResource, type: string) =>
  type === AllValue || item.kind === type;

const sortResources = (items: IndexedResource[], order: ResourceOrderTypes) =>
  [...items].sort((a, b) => {
    // Featured resources always lead the listing
    const featured =
      Number(!!b.resource.featured) - Number(!!a.resource.featured);
    if (featured !== 0) return featured;

    switch (order) {
      case ResourceOrderTypes.Title:
        return a.resource.title.localeCompare(b.resource.title);
      case ResourceOrderTypes.Type:
        return (
          FileKindOrder.indexOf(a.kind) - FileKindOrder.indexOf(b.kind) ||
          a.resource.title.localeCompare(b.resource.title)
        );
      case ResourceOrderTypes.Oldest:
        return getResourceDate(a.resource).localeCompare(
          getResourceDate(b.resource),
        );
      default:
        return getResourceDate(b.resource).localeCompare(
          getResourceDate(a.resource),
        );
    }
  });

export interface ResourceListingProps {
  resources: CfResource[];
  lang?: Locale;
}

export const ResourceListing = ({
  resources,
  lang = defaultLocale,
}: ResourceListingProps) => {
  const labels = useResourceLabels(lang);
  const { isLargerThanMd } = useMediaQuery();
  const { getQueryParam, setQueryParam } = useQueryParam();
  const { resourceListingDisplay } = useResourcesState();

  const orderValues = Object.values(ResourceOrderTypes) as string[];
  const initialOrder = getQueryParam(ResourceQuery.order) || "";

  const [search, setSearch] = useState(
    getQueryParam(ResourceQuery.search) || "",
  );
  const [type, setType] = useState(
    getQueryParam(ResourceQuery.type) || AllValue,
  );
  const [category, setCategory] = useState(
    getQueryParam(ResourceQuery.categories) || AllValue,
  );
  const [order, setOrder] = useState<ResourceOrderTypes>(
    orderValues.includes(initialOrder)
      ? (initialOrder as ResourceOrderTypes)
      : ResourceListingConfig.DefaultOrder,
  );
  const [visibleCount, setVisibleCount] = useState(
    ResourceListingConfig.ResourcesLimit,
  );

  // Keep filters shareable: mirror them into the URL
  useEffect(() => {
    const timeout = setTimeout(
      () => setQueryParam(ResourceQuery.search, search.trim() || null),
      300,
    );
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    setQueryParam(ResourceQuery.type, type === AllValue ? null : type);
    setQueryParam(
      ResourceQuery.categories,
      category === AllValue ? null : category,
    );
    setQueryParam(
      ResourceQuery.order,
      order === ResourceListingConfig.DefaultOrder ? null : order,
    );
  }, [type, category, order]);

  useEffect(() => {
    setVisibleCount(ResourceListingConfig.ResourcesLimit);
  }, [search, type, category, order]);

  const indexed = useMemo(() => resources.map(indexResource), [resources]);

  const searched = useMemo(
    () => indexed.filter((item) => matchesSearch(item, search)),
    [indexed, search],
  );

  // Each facet counts against the other active filters, not itself
  const typeCounts = useMemo(() => {
    const counts: Partial<Record<ResourceFileKind, number>> = {};
    searched
      .filter((item) => matchesCategory(item, category))
      .forEach((item) => (counts[item.kind] = (counts[item.kind] || 0) + 1));
    return counts;
  }, [searched, category]);

  const categories = useMemo(() => {
    const bySlug = new Map<string, CfResourceCategory & { count: number }>();
    indexed.forEach((item) =>
      item.resource.categoriesCollection?.items.forEach((entry) => {
        if (!bySlug.has(entry.slug))
          bySlug.set(entry.slug, { ...entry, count: 0 });
      }),
    );
    searched
      .filter((item) => matchesType(item, type))
      .forEach((item) =>
        item.resource.categoriesCollection?.items.forEach((entry) => {
          bySlug.get(entry.slug)!.count += 1;
        }),
      );
    return Array.from(bySlug.values()).sort((a, b) =>
      a.title.localeCompare(b.title),
    );
  }, [indexed, searched, type]);

  // Only offer file types that exist in the library
  const availableKinds = useMemo(
    () =>
      FileKindOrder.filter((kind) =>
        indexed.some((item) => item.kind === kind),
      ),
    [indexed],
  );

  const results = useMemo(
    () =>
      sortResources(
        searched.filter(
          (item) => matchesType(item, type) && matchesCategory(item, category),
        ),
        order,
      ),
    [searched, type, category, order],
  );

  const typeTotal = Object.values(typeCounts).reduce(
    (sum, count) => sum + (count || 0),
    0,
  );
  const hasFilters = !!search || type !== AllValue || category !== AllValue;
  const visible = results.slice(0, visibleCount);

  const clearFilters = () => {
    setSearch("");
    setType(AllValue);
    setCategory(AllValue);
  };

  return (
    <Box marginY={8}>
      <FlexBox flexDirection="column" gap={4}>
        <FlexBox
          gap={3}
          alignItems={{ xs: "stretch", md: "center" }}
          flexDirection={{ xs: "column", md: "row" }}
        >
          <Box flexGrow={1}>
            <ResourceSearch
              value={search}
              onChange={setSearch}
              labels={labels}
            />
          </Box>
          <FlexBox gap={3} alignItems="center" justifyContent="flex-end">
            <SortSelect value={order} onChange={setOrder} labels={labels} />
            {isLargerThanMd && <DisplayToggle />}
          </FlexBox>
        </FlexBox>
        {availableKinds.length > 1 && (
          <TypeFilter
            value={type}
            counts={typeCounts}
            total={typeTotal}
            kinds={availableKinds}
            onChange={setType}
            labels={labels}
          />
        )}
        {categories.length > 0 && (
          <CategoryFilter
            value={category}
            categories={categories}
            onChange={setCategory}
            labels={labels}
          />
        )}
        <FlexBox alignItems="center" gap={3}>
          <Text.Small color={palette.grey[600]}>
            {`${labels.showing} ${visible.length} ${labels.of} ${results.length} ${labels.resources}`}
          </Text.Small>
          {hasFilters && (
            <TextButton
              onClick={clearFilters}
              style={{
                color: "primary.main",
                fontSize: "0.8125rem",
                textDecoration: "underline",
              }}
            >
              {labels.clearFilters}
            </TextButton>
          )}
        </FlexBox>
      </FlexBox>

      <Row columnSpacing={5} rowSpacing={7} marginTop={6}>
        {visible.length ? (
          visible.map(({ resource }) => (
            <Col
              key={resource.sys.id}
              size={
                resourceListingDisplay === "grid" || !isLargerThanMd
                  ? { xs: 12, sm: 6, md: 4, lg: 3 }
                  : { xs: 12 }
              }
              style={{ display: "flex" }}
            >
              {resourceListingDisplay === "grid" || !isLargerThanMd ? (
                <ResourceCard resource={resource} lang={lang} />
              ) : (
                <ResourceListCard resource={resource} lang={lang} />
              )}
            </Col>
          ))
        ) : (
          <Col size={{ xs: 12 }}>
            <Text.Subtitle marginTop={8} marginBottom={4}>
              {labels.noResults}
            </Text.Subtitle>
          </Col>
        )}
      </Row>

      {results.length > ResourceListingConfig.ResourcesLimit && (
        <LoadMore
          handleLoadMore={() =>
            setVisibleCount(
              (count) => count + ResourceListingConfig.ResourcesLimit,
            )
          }
          currentNumber={visible.length}
          total={results.length}
          showProgression
          lang={lang}
        />
      )}
    </Box>
  );
};
