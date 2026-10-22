import { ContentfulLivePreview } from "@contentful/live-preview";

import {
  CfAlignment,
  CfBaseComponent,
  CfBorderSelector,
  CfComponentSpacing,
  CfContainerWidth,
  CfRichText,
  Nested,
  SmallPadding,
} from "@aces/types";
import { generateId } from "@aces/utils";
import { componentSpacing, palette } from "@aces/theme";
import { Box, Container, FlexBox } from "@aces/ui";
import { CfRichTextRender } from "@aces/cf";

export interface CfRichTextSectionProps
  extends CfBaseComponent,
    Nested,
    SmallPadding {
  alignment: CfAlignment;
  containerWidth: CfContainerWidth;
  cfComponentSpacing?: CfComponentSpacing;
  backgroundColor: "None" | "Gray" | "Primary Gradient" | null;
  bodyCopy: CfRichText;
  border: CfBorderSelector;
}

export const CfRichTextSection = ({
  internalTitle,
  alignment,
  containerWidth,
  cfComponentSpacing = "md",
  backgroundColor,
  bodyCopy,
  border,
  __typename,
  nested,
  smallPadding,
  id,
  lang,
  preview,
}: CfRichTextSectionProps) => {
  const isNarrow = containerWidth === "Narrow";

  const hasTopBorder = border === "Top" || border === "Top & Bottom";
  const hasBottomBorder = border === "Bottom" || border === "Top & Bottom";
  const borderStyles = `1px solid ${palette.grey[300]}`;

  const hasBackgroundColor =
    backgroundColor !== "None" && backgroundColor !== null;
  const backgroundColors = {
    Gray: palette.tertiary.grayblue,
    "Primary Gradient": palette.gradient.primaryMainLight270,
  };
  const forgroundColors = {
    Gray: palette.text.primary,
    "Primary Gradient": palette.common.white,
  };

  return (
    <Box
      id={generateId(internalTitle)}
      data-component={__typename}
      paddingY={nested ? 0 : componentSpacing[cfComponentSpacing]}
      style={{
        background: hasBackgroundColor
          ? backgroundColors[backgroundColor]
          : undefined,
        borderTop: hasTopBorder ? borderStyles : "none",
        borderBottom: hasBottomBorder ? borderStyles : "none",
        width: "100%",
      }}
    >
      <Container
        maxWidth={isNarrow ? "md" : "xl"}
        nested={nested}
        smallPadding={smallPadding}
      >
        <FlexBox
          maxWidth={isNarrow ? "700px" : "none"}
          flexDirection="column"
          marginX={"auto"}
        >
          <CfRichTextRender
            richTextDocument={bodyCopy.json}
            alignment={alignment}
            lang={lang}
            preview={preview}
            enableMaxTextWidth
            color={
              hasBackgroundColor ? forgroundColors[backgroundColor] : "inherit"
            }
            {...ContentfulLivePreview.getProps({
              entryId: id,
              fieldId: "bodyCopy",
              locale: lang,
            })}
          />
        </FlexBox>
      </Container>
    </Box>
  );
};
