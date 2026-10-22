import { gql } from "@apollo/client";

import { defaultLocale, Locale } from "@aces/i18n";
import { cfClient, cfPreviewClient, ImageFragment } from "@aces/contentful";

export const FeaturedArticlesQuery = gql`
  ${ImageFragment}

  query ($preview: Boolean!, $locale: String!) {
    articleCollection(
      where: { featured: true }
      limit: 5
      preview: $preview
      locale: $locale
    ) {
      items {
        title
        slug
        publishDate
        excerpt
        bodyCopy {
          json
        }
        featuredImage {
          ...Image
        }
        sys {
          id
        }
      }
    }
  }
`;

export const fetchFeaturedArticlesData = async (
  preview = false,
  locale: Locale = defaultLocale,
) => {
  const client = preview ? cfPreviewClient : cfClient;
  try {
    const pageResponse = await client.query({
      query: FeaturedArticlesQuery,
      variables: { preview, locale },
    });
    return pageResponse.data.articleCollection.items;
  } catch (error) {
    console.log("Error fetching page data:", error);
    throw error;
  }
};

export async function fetchFeaturedSlugs(
  preview = false,
  locale: Locale = defaultLocale,
) {
  const client = preview ? cfPreviewClient : cfClient;

  try {
    const response = await client.query({
      query: gql`
        query ($preview: Boolean!, $locale: String!) {
          articleCollection(
            where: { featured: true }
            limit: 5
            preview: $preview
            locale: $locale
          ) {
            items {
              slug
            }
          }
        }
      `,
      variables: {
        preview,
        locale,
      },
    });

    const data = response.data.articleCollection.items;

    if (data) {
      const slugs = data.map((item: any) => item.slug);
      return slugs;
    }

    return [];
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw error;
  }
}
