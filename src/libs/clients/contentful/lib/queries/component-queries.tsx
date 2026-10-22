import { gql } from "@apollo/client";

export const EntryQuery = gql`
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
        __typename
      }
    }
  }
`;

export const PageLinkFragment = gql`
  fragment PageLink on Page {
    slug
    specialtyPage
    parentPage {
      slug
      specialtyPage
    }
  }
`;

export const ArticleLinkFragment = gql`
  fragment ArticleLink on Article {
    slug
  }
`;

export const ResourceLinkFragment = gql`
  fragment ResourceLink on Resource {
    slug
  }
`;

export const LinkFragment = gql`
  ${PageLinkFragment}
  ${ArticleLinkFragment}
  ${ResourceLinkFragment}

  fragment Link on Link {
    internalTitle
    linkType
    pageLink {
      ...PageLink
      ...ArticleLink
      ...ResourceLink
    }
    customLink
    target
  }
`;

export const ModalIdFragment = gql`
  fragment Modal on Modal {
    internalTitle
    sys {
      id
    }
  }
`;

export const ButtonFragment = gql`
  ${LinkFragment}
  ${ModalIdFragment}

  fragment Button on Button {
    internalTitle
    title
    link {
      ...Link
      ...Modal
    }
    buttonStyle
    rightIcon
    sys {
      id
    }
    __typename
  }
`;

export const ImageFragment = gql`
  fragment Image on Image {
    internalTitle
    image {
      url
      width
      height
    }
    mobileImage {
      url
      width
      height
    }
    altText
    nativeImageSize
    sys {
      id
    }
    __typename
  }
`;
