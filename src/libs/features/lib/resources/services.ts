import { gql } from "@apollo/client";

import { cfClient, cfPreviewClient } from "@aces/contentful";
import { defaultLocale, Locale } from "@aces/i18n";
import { CfResource, CfResourceDetail } from "@aces/types";

import { ResourceListingConfig } from "./config";

export const ResourceAssetFragment = gql`
  fragment ResourceAsset on Asset {
    url
    fileName
    contentType
    size
    width
    height
    title
    description
  }
`;

export const ResourceCardFragment = gql`
  ${ResourceAssetFragment}

  fragment ResourceCard on Resource {
    __typename
    sys {
      id
      publishedAt
    }
    internalTitle
    title
    slug
    description
    searchKeywords
    publishDate
    featured
    file {
      ...ResourceAsset
    }
    categoriesCollection(limit: 10) {
      items {
        ... on Categories {
          title
          slug
        }
      }
    }
  }
`;

const AllResourcesQuery = gql`
  ${ResourceCardFragment}

  query ($limit: Int!, $skip: Int!, $preview: Boolean!, $locale: String!) {
    resourceCollection(
      limit: $limit
      skip: $skip
      order: [publishDate_DESC, sys_publishedAt_DESC]
      preview: $preview
      locale: $locale
    ) {
      items {
        ...ResourceCard
      }
      total
    }
  }
`;

const ResourceBySlugQuery = gql`
  ${ResourceCardFragment}

  query ($slug: String!, $preview: Boolean!, $locale: String!) {
    resourceCollection(
      where: { slug: $slug }
      limit: 1
      preview: $preview
      locale: $locale
    ) {
      items {
        ...ResourceCard
        relatedResourcesCollection(limit: 6) {
          items {
            ...ResourceCard
          }
        }
      }
    }
  }
`;

const ResourceByIdQuery = gql`
  ${ResourceCardFragment}

  query ($id: String!, $preview: Boolean!, $locale: String!) {
    resource(id: $id, preview: $preview, locale: $locale) {
      ...ResourceCard
    }
  }
`;

// Resources whose asset is missing (e.g. unpublished) can't be shown or downloaded
const withFile = <T extends CfResource>(items: (T | null)[]) =>
  items.filter((item): item is T => !!item?.file);

/**
 * Loads the full resource library. File type is derived from each asset, so
 * filtering, search and facet counts happen in memory on the listing.
 */
export async function fetchAllResources(
  preview = false,
  locale: Locale = defaultLocale,
): Promise<CfResource[]> {
  const client = preview ? cfPreviewClient : cfClient;
  const limit = ResourceListingConfig.FetchPageSize;
  const resources: CfResource[] = [];

  try {
    let total = Infinity;
    for (let skip = 0; skip < total; skip += limit) {
      const response = await client.query({
        query: AllResourcesQuery,
        variables: { limit, skip, preview, locale },
      });
      const collection = response.data.resourceCollection;
      total = collection.total;
      resources.push(...collection.items);
    }
  } catch (error) {
    console.error("Error fetching resources:", error);
  }

  return withFile(resources);
}

export async function fetchResourceBySlug(
  slug: string,
  preview = false,
  locale: Locale = defaultLocale,
): Promise<CfResourceDetail | null> {
  const client = preview ? cfPreviewClient : cfClient;

  try {
    const response = await client.query({
      query: ResourceBySlugQuery,
      variables: { slug, preview, locale },
    });
    const [resource] = withFile<CfResourceDetail>(
      response.data.resourceCollection.items,
    );
    if (!resource) return null;

    return {
      ...resource,
      relatedResourcesCollection: {
        items: withFile(resource.relatedResourcesCollection?.items || []),
      },
    };
  } catch (error) {
    console.error("Error fetching resource:", error);
    return null;
  }
}

export async function fetchResourceById(
  id: string,
  preview = false,
  locale: Locale = defaultLocale,
): Promise<CfResource | null> {
  const client = preview ? cfPreviewClient : cfClient;

  try {
    const response = await client.query({
      query: ResourceByIdQuery,
      variables: { id, preview, locale },
    });
    return withFile([response.data.resource])[0] || null;
  } catch (error) {
    console.error("Error fetching resource:", error);
    return null;
  }
}
