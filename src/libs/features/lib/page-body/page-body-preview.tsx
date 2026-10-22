import {
  CfAccordionsClient,
  CfBannerClient,
  CfCalloutClient,
  CfCodeEmbedClient,
  CfFeatureHighlightClient,
  CfGridClient,
  CfHeaderClient,
  CfImageClient,
  CfLockupClient,
  CfRichTextSectionClient,
  CfVideoEmbedClient,
  CfResourceEmbedClient,
} from "@aces/cf";
import { generateId } from "@aces/utils";

import { PageBodyProps } from "./page-body-types";

export const PreviewPageBody = ({ items, preview, lang }: PageBodyProps) => {
  if (!items) {
    return null;
  }

  return (
    <>
      {items.map((item, index) => {
        const typename = item.__typename;

        if (!typename) {
          return null;
        }

        switch (typename) {
          case "Accordions":
            return (
              <CfAccordionsClient
                id={item?.sys?.id || ""}
                preview={preview}
                lang={lang}
                key={generateId(`${item?.sys?.id ?? "no-id"}-${index}`)}
              />
            );
          case "Banner":
            return (
              <CfBannerClient
                id={item?.sys?.id || ""}
                preview={preview}
                lang={lang}
                key={generateId(`${item?.sys?.id ?? "no-id"}-${index}`)}
              />
            );
          case "CodeEmbed":
            return (
              <CfCodeEmbedClient
                id={item?.sys?.id || ""}
                preview={preview}
                lang={lang}
                key={generateId(`${item?.sys?.id ?? "no-id"}-${index}`)}
              />
            );
          case "Header":
            return (
              <CfHeaderClient
                id={item?.sys?.id || ""}
                preview={preview}
                lang={lang}
                key={generateId(`${item?.sys?.id ?? "no-id"}-${index}`)}
              />
            );
          case "Image":
            return (
              <CfImageClient
                id={item?.sys?.id || ""}
                preview={preview}
                lang={lang}
                key={generateId(`${item?.sys?.id ?? "no-id"}-${index}`)}
              />
            );
          case "GridUpdated":
            return (
              <CfGridClient
                id={item?.sys?.id || ""}
                preview={preview}
                lang={lang}
                key={generateId(`${item?.sys?.id ?? "no-id"}-${index}`)}
              />
            );
          case "Lockup":
            return (
              <CfLockupClient
                id={item?.sys?.id || ""}
                preview={preview}
                lang={lang}
                key={generateId(`${item?.sys?.id ?? "no-id"}-${index}`)}
              />
            );
          case "RichTextSection":
            return (
              <CfRichTextSectionClient
                id={item?.sys?.id || ""}
                preview={preview}
                lang={lang}
                key={generateId(`${item?.sys?.id ?? "no-id"}-${index}`)}
              />
            );
          case "Resource":
            return (
              <CfResourceEmbedClient
                id={item?.sys?.id || ""}
                preview={preview}
                lang={lang}
                key={generateId(`${item?.sys?.id ?? "no-id"}-${index}`)}
              />
            );
          case "VideoEmbed":
            return (
              <CfVideoEmbedClient
                id={item?.sys?.id || ""}
                preview={preview}
                lang={lang}
                key={generateId(`${item?.sys?.id ?? "no-id"}-${index}`)}
              />
            );
          case "Callout":
            return (
              <CfCalloutClient
                id={item?.sys?.id || ""}
                preview={preview}
                lang={lang}
                key={generateId(`${item?.sys?.id ?? "no-id"}-${index}`)}
              />
            );
          case "FeatureHighlight":
            return (
              <CfFeatureHighlightClient
                id={item?.sys?.id || ""}
                preview={preview}
                lang={lang}
                key={generateId(`${item?.sys?.id ?? "no-id"}-${index}`)}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
};
