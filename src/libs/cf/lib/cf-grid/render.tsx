import { ContentfulLivePreview } from "@contentful/live-preview";

import {
  CfBaseComponent,
  CfGridItemsStyleTypes,
  CfImageProps,
  CfVerticalAlignment,
  Nested,
} from "@aces/types";
import { generateId } from "@aces/utils";
import { componentSpacing, maxTextWidth, palette, shape } from "@aces/theme";
import { Box, Col, Container, Row } from "@aces/ui";

import { CfRichTextSectionProps } from "../cf-rich-text-section/render";
import { CfRichTextSectionServer } from "../cf-rich-text-section";
import { CfImageServer } from "../cf-image";

export interface CfGridProps extends CfBaseComponent, Nested {
  showDividers: boolean;
  gridColumnCount: number;
  gridItemsStyle: CfGridItemsStyleTypes;
  verticalAlignment: CfVerticalAlignment;
  listItems: (CfImageProps | CfRichTextSectionProps)[];
}

export const CfGrid = ({
  internalTitle,
  showDividers,
  gridColumnCount,
  gridItemsStyle,
  verticalAlignment,
  listItems,
  __typename,
  nested = false,
  id,
  lang,
  preview,
}: CfGridProps) => {
  const isBorderStyle = gridItemsStyle === "Borders";
  const isCardStyle = gridItemsStyle === "Cards";

  const alignItemsStyle =
    verticalAlignment === "Center"
      ? "center"
      : verticalAlignment === "Bottom"
        ? "flex-end"
        : "flex-start";

  const bordersStyle = {
    borderRight: { xs: "none", md: `1px solid ${palette.grey[300]}` },
    borderBottom: { xs: `1px solid ${palette.grey[300]}`, sm: "none" },
    paddingLeft: { xs: 0, sm: 2, md: 6 },
    paddingRight: { xs: 0, sm: 8, md: 24 },
    paddingBottom: { xs: 12, sm: 0, md: 0 },
    marginBottom: { xs: 8, sm: 8, md: 0 },
    maxWidth: maxTextWidth,
    display: "flex",
    alignItems: alignItemsStyle,
    "&:first-child": { paddingLeft: 0 },
    "&:nth-child(even)": {
      borderRight: { sm: "none", md: `1px solid ${palette.grey[300]}` },
    },
    "&:nth-child(odd):not(:first-child)": {
      paddingLeft: { sm: 0, md: 6 },
    },
    "&:last-child": {
      borderRight: "none",
      borderBottom: "none",
      paddingBottom: 0,
      marginBottom: 0,
    },
  };

  const cardStyle = {
    background: palette.common.white,
    color: palette.text.primary,
    border: `1px solid ${palette.grey[300]}`,
    borderRadius: shape.borderRadius,
    display: "flex",
    alignItems: alignItemsStyle,
    padding: 8,
  };

  const colSize = {
    xs: 12,
    sm: gridColumnCount >= 3 ? 6 : 12,
    md: 12 / gridColumnCount,
  };

  return (
    <Box
      id={generateId(internalTitle)}
      data-component={__typename}
      marginY={{ xs: componentSpacing.xs, md: componentSpacing.md }}
      {...ContentfulLivePreview.getProps({
        entryId: id,
        fieldId: "listItems",
        locale: lang,
      })}
    >
      <Container nested={nested}>
        <Row
          columnSpacing={!showDividers ? 12 : 6}
          rowSpacing={10}
          flexDirection={{ xs: "column", sm: "row" }}
        >
          {listItems.map((item, index) => {
            const typename = item.__typename;

            const isCfRichText = (
              item: any,
            ): item is CfRichTextSectionProps => {
              return "backgroundColor" in item;
            };

            switch (typename) {
              case "RichTextSection":
                if (isCfRichText(item)) {
                  return (
                    <Col
                      key={`${id}-${index}`}
                      size={colSize}
                      style={
                        isBorderStyle
                          ? bordersStyle
                          : isCardStyle
                            ? {
                                ...cardStyle,
                                background:
                                  item.backgroundColor === "Gray"
                                    ? palette.tertiary.grayblue
                                    : item.backgroundColor ===
                                        "Primary Gradient"
                                      ? palette.gradient.primaryMainLight270
                                      : palette.common.white,
                              }
                            : {}
                      }
                    >
                      <CfRichTextSectionServer
                        id={item?.sys?.id || ""}
                        preview={preview}
                        lang={lang}
                        nested={true}
                      />
                    </Col>
                  );
                }
              case "Image":
                return (
                  <Col
                    key={`${id}-${index}`}
                    size={colSize}
                    style={
                      isBorderStyle
                        ? bordersStyle
                        : isCardStyle
                          ? cardStyle
                          : {}
                    }
                  >
                    <CfImageServer
                      id={item?.sys?.id || ""}
                      preview={preview}
                      lang={lang}
                      nested={true}
                    />
                  </Col>
                );
              default:
                return null;
            }
          })}
        </Row>
      </Container>
    </Box>
  );
};
