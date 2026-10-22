// Resource (downloadable file + metadata) Types

export type ResourceFileKind =
  | "pdf"
  | "presentation"
  | "document"
  | "spreadsheet"
  | "image"
  | "video"
  | "audio"
  | "archive"
  | "other";

export interface CfAsset {
  url: string;
  fileName: string;
  contentType: string;
  size?: number;
  width?: number;
  height?: number;
  title?: string;
  description?: string;
}

export interface CfResourceCategory {
  title: string;
  slug: string;
}

export interface CfResource {
  __typename: "Resource";
  sys: {
    id: string;
    publishedAt?: string;
  };
  internalTitle: string;
  title: string;
  slug: string;
  description?: string;
  file: CfAsset | null;
  categoriesCollection?: {
    items: CfResourceCategory[];
  };
  searchKeywords?: string[];
  publishDate?: string;
  featured?: boolean;
}

export interface CfResourceDetail extends CfResource {
  relatedResourcesCollection?: {
    items: CfResource[];
  };
}
