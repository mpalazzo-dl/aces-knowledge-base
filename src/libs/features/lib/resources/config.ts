export enum ResourceOrderTypes {
  Newest = "newest",
  Oldest = "oldest",
  Title = "title",
  Type = "type",
}

export enum ResourceQuery {
  search = "q",
  type = "type",
  categories = "categories",
  order = "order",
}

export const ResourceListingConfig = {
  ResourcesLimit: 12,
  DefaultOrder: ResourceOrderTypes.Newest,
  // Contentful GraphQL max page size used when loading the full library
  FetchPageSize: 100,
};

// Microsoft Office Online viewer limits (bytes)
export const OfficePreviewLimits = {
  WordAndPowerPoint: 10 * 1024 * 1024,
  Excel: 5 * 1024 * 1024,
};
