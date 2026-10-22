import { gql } from "@apollo/client";

import { defaultLocale } from "@aces/i18n";
import { cfClient, cfPreviewClient, ImageFragment } from "@aces/contentful";

export const FeatureHighlightQuery = gql`
  ${ImageFragment}
  query ($id: String!, $preview: Boolean!, $locale: String) {
    featureHighlight(id: $id, preview: $preview, locale: $locale) {
      internalTitle
      headline
      bodyCopy {
        json
      }
      media {
        ...Image
      }
      sys {
        id
      }
    }
  }
`;

export const fetchFeatureHighlightData = async (
  id: string,
  preview = false,
  locale: string = defaultLocale,
) => {
  const client = preview ? cfPreviewClient : cfClient;
  try {
    const response = await client.query({
      query: FeatureHighlightQuery,
      variables: { id, preview, locale },
    });

    return response.data.featureHighlight;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
