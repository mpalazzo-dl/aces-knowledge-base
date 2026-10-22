import { CfResource, RouteDirectory } from "@aces/types";

export const getResourceHref = (slug: string) =>
  `${RouteDirectory.Resources}/${slug}`;

export const getResourceDownloadHref = (slug: string) =>
  `${RouteDirectory.ResourceDownload}/${slug}/download`;

/**
 * publishDate is a date-only field, but GraphQL returns it as UTC midnight,
 * which renders a day early west of UTC. Anchor the calendar day to midday.
 */
export const getResourceDate = (resource: CfResource) =>
  resource.publishDate
    ? `${resource.publishDate.slice(0, 10)}T12:00:00`
    : resource.sys.publishedAt || "";
