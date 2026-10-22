import { defaultLocale, Locale } from "@aces/i18n";
import { cfClient, cfPreviewClient } from "@aces/contentful";

import {
  SearchArticlesQuery,
  SearchPagesQuery,
  SearchResourcesQuery,
  TopSearchResultsQuery,
} from "../queries/search-queries";

// Resources without a description fall back to their file name as the excerpt
const toResourceResult = (item: any) => ({
  ...item,
  excerpt: item.excerpt || item.file?.fileName || "",
});

export const fetchCfTopSearchResults = async (
  query: string,
  limit: 1 | 2,
  preview = false,
  locale: string = defaultLocale,
) => {
  const client = preview ? cfPreviewClient : cfClient;

  query = query.toLowerCase();

  try {
    const response = await client.query({
      query: TopSearchResultsQuery,
      variables: { query, limit, preview, locale },
    });

    return {
      pages: response.data.pageCollection.items.map((item: any) => ({
        ...item,
        excerpt: item.seo.metaDescription || "",
      })),
      articles: response.data.articleCollection.items,
      resources: response.data.resourceCollection.items.map(toResourceResult),
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const fetchCfPageSearchResults = async (
  query: string,
  limit: number,
  offset: number,
  preview = false,
  locale: string = defaultLocale,
) => {
  const client = preview ? cfPreviewClient : cfClient;

  query = query.toLowerCase();

  try {
    const response = await client.query({
      query: SearchPagesQuery,
      variables: { query, limit, offset, preview, locale },
    });

    return {
      ...response.data.pageCollection,
      items: response.data.pageCollection.items.map((item: any) => ({
        ...item,
        excerpt: item.seo?.metaDescription || "",
      })),
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const fetchCfArticleSearchResults = async (
  query: string,
  limit: number,
  offset: number,
  preview = false,
  locale: Locale = defaultLocale,
) => {
  const client = preview ? cfPreviewClient : cfClient;

  query = query.toLowerCase();

  try {
    const response = await client.query({
      query: SearchArticlesQuery,
      variables: { query, limit, offset, preview, locale },
    });

    return response.data.articleCollection;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const fetchCfResourceSearchResults = async (
  query: string,
  limit: number,
  offset: number,
  preview = false,
  locale: Locale = defaultLocale,
) => {
  const client = preview ? cfPreviewClient : cfClient;

  query = query.toLowerCase();

  try {
    const response = await client.query({
      query: SearchResourcesQuery,
      variables: { query, limit, offset, preview, locale },
    });

    return {
      ...response.data.resourceCollection,
      items: response.data.resourceCollection.items.map(toResourceResult),
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
