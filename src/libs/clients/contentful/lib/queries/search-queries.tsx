import { gql } from "@apollo/client";
import { MetadataFragment } from "./page-queries";

export const PageSearchResultFragment = gql`
  ${MetadataFragment}

  fragment PageSearchResult on Page {
    title: title
    seo: seo {
      ...Metadata
    }
    keywords: searchKeywords
    slug: slug
    parentPage {
      slug
      specialtyPage
    }
    specialtyPage
    sys {
      id
    }
  }
`;

export const ArticleSearchResultFragment = gql`
  fragment ArticleSearchResult on Article {
    title: title
    excerpt: excerpt
    keywords: searchKeywords
    slug: slug
    sys {
      id
    }
  }
`;

export const ResourceSearchResultFragment = gql`
  fragment ResourceSearchResult on Resource {
    title: title
    excerpt: description
    keywords: searchKeywords
    slug: slug
    file {
      fileName
    }
    sys {
      id
    }
  }
`;

export const TopSearchResultsQuery = gql`
  ${PageSearchResultFragment}
  ${ArticleSearchResultFragment}
  ${ResourceSearchResultFragment}

  query ($query: String!, $limit: Int!, $preview: Boolean!, $locale: String!) {
    pageCollection(
      where: {
        OR: [
          { title_contains: $query }
          { searchKeywords_contains_some: [$query] }
        ]
      }
      limit: $limit
      preview: $preview
      locale: $locale
    ) {
      items {
        ...PageSearchResult
      }
    }
    articleCollection(
      where: {
        OR: [
          { title_contains: $query }
          { excerpt_contains: $query }
          { searchKeywords_contains_some: [$query] }
        ]
      }
      limit: $limit
      preview: $preview
      locale: $locale
    ) {
      items {
        ...ArticleSearchResult
      }
    }
    resourceCollection(
      where: {
        OR: [
          { title_contains: $query }
          { description_contains: $query }
          { searchKeywords_contains_some: [$query] }
        ]
      }
      limit: $limit
      preview: $preview
      locale: $locale
    ) {
      items {
        ...ResourceSearchResult
      }
    }
  }
`;

export const SearchPagesQuery = gql`
  ${PageSearchResultFragment}

  query (
    $query: String!
    $limit: Int!
    $offset: Int!
    $preview: Boolean!
    $locale: String!
  ) {
    pageCollection(
      where: {
        OR: [
          { title_contains: $query }
          { searchKeywords_contains_some: [$query] }
        ]
      }
      limit: $limit
      skip: $offset
      preview: $preview
      locale: $locale
    ) {
      items {
        ...PageSearchResult
      }
      total
    }
  }
`;

export const SearchArticlesQuery = gql`
  ${ArticleSearchResultFragment}

  query (
    $query: String!
    $limit: Int!
    $offset: Int!
    $preview: Boolean!
    $locale: String!
  ) {
    articleCollection(
      where: {
        OR: [
          { title_contains: $query }
          { excerpt_contains: $query }
          { searchKeywords_contains_some: [$query] }
        ]
      }
      limit: $limit
      skip: $offset
      preview: $preview
      locale: $locale
    ) {
      items {
        ...ArticleSearchResult
      }
      total
    }
  }
`;

export const SearchResourcesQuery = gql`
  ${ResourceSearchResultFragment}

  query (
    $query: String!
    $limit: Int!
    $offset: Int!
    $preview: Boolean!
    $locale: String!
  ) {
    resourceCollection(
      where: {
        OR: [
          { title_contains: $query }
          { description_contains: $query }
          { searchKeywords_contains_some: [$query] }
        ]
      }
      limit: $limit
      skip: $offset
      preview: $preview
      locale: $locale
    ) {
      items {
        ...ResourceSearchResult
      }
      total
    }
  }
`;
