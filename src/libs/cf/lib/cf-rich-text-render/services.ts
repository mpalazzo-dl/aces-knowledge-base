import { gql } from "@apollo/client";

import {
  ArticleLinkFragment,
  cfClient,
  cfPreviewClient,
  PageLinkFragment,
  ResourceLinkFragment,
} from "@aces/contentful";
import { PageLinkProps } from "@aces/types";
import { defaultLocale } from "@aces/i18n";

export const RichTextRenderQuery = gql`
  query ($id: String!, $preview: Boolean!, $locale: String!) {
    entryCollection(
      where: { sys: { id: $id } }
      limit: 1
      preview: $preview
      locale: $locale
    ) {
      items {
        sys {
          id
        }
      }
    }
  }
`;

export const fetchRichTextEmbedEntry = async (
  id: string,
  preview = false,
  locale: string = defaultLocale,
) => {
  const client = preview ? cfPreviewClient : cfClient;
  try {
    const response = await client.query({
      query: RichTextRenderQuery,
      variables: { id, preview, locale },
    });

    if (response?.data?.entryCollection?.items?.length) {
      return response.data.entryCollection.items[0];
    }

    return null;
  } catch (error) {
    console.error(`Error fetching entry with ID ${id}:`, error);
    return null;
  }
};

export const RichTextHyperlinkQuery = gql`
  ${PageLinkFragment}
  ${ArticleLinkFragment}
  ${ResourceLinkFragment}

  query ($id: String!, $preview: Boolean!, $locale: String!) {
    entryCollection(
      where: { sys: { id: $id } }
      limit: 1
      preview: $preview
      locale: $locale
    ) {
      items {
        __typename
        ...PageLink
        ...ArticleLink
        ...ResourceLink
      }
    }
  }
`;

/** Looks up the slug data needed to resolve an entry hyperlink to a URL. */
export const fetchRichTextHyperlinkEntry = async (
  id: string,
  preview = false,
  locale: string = defaultLocale,
): Promise<PageLinkProps | null> => {
  const client = preview ? cfPreviewClient : cfClient;
  try {
    const response = await client.query({
      query: RichTextHyperlinkQuery,
      variables: { id, preview, locale },
    });

    return response?.data?.entryCollection?.items?.[0] || null;
  } catch (error) {
    console.error(`Error fetching linked entry with ID ${id}:`, error);
    return null;
  }
};
