import { ContentfulLivePreview } from "@contentful/live-preview";

import { CfBaseComponent, CfImageProps, CfRichText } from "@aces/types";
import { generateId } from "@aces/utils";
import { componentSpacing } from "@aces/theme";
import { Box, Col, Container, FlexBox, H2, H3, Row } from "@aces/ui";
import { CfImage, CfRichTextRender } from "@aces/cf";

export interface CfFeatureHighlightProps extends CfBaseComponent {
  headline: string;
  bodyCopy: CfRichText;
  media: CfImageProps;
}

export const CfFeatureHighlight = ({
  internalTitle,
  headline,
  bodyCopy,
  media,
  __typename,
  id,
  lang,
  preview,
}: CfFeatureHighlightProps) => {
  return (
    <Box
      id={generateId(internalTitle)}
      data-component={__typename}
      marginY={{ xs: componentSpacing.lg, md: componentSpacing.md }}
    >
      <Container>
        <Row
          flexDirection={{ xs: "column", md: "row" }}
          columnSpacing={10}
          rowSpacing={5}
        >
          <Col size={{ xs: 12, md: 6, lg: 3 }}>
            <FlexBox>
              {media && (
                <CfImage
                  __typename={media.__typename}
                  id={media.id}
                  image={media.image}
                  altText={media.altText}
                  internalTitle={media.internalTitle}
                  lang={lang}
                  preview={preview}
                  nested
                  style={{ borderRadius: "6.25px" }}
                />
              )}
            </FlexBox>
          </Col>
          <Col size={{ xs: 12, md: 6, lg: 9 }}>
            <Row rowSpacing={5}>
              <Col size={{ xs: 12, lg: 5 }}>
                <FlexBox>
                  <H3
                    style={{ paddingRight: 4 }}
                    {...ContentfulLivePreview.getProps({
                      entryId: id,
                      fieldId: "headline",
                      locale: lang,
                    })}
                  >
                    {headline}
                  </H3>
                </FlexBox>
              </Col>
              <Col size={{ xs: 12, lg: 7 }}>
                <FlexBox>
                  {bodyCopy?.json && (
                    <CfRichTextRender
                      lang={lang}
                      preview={preview}
                      richTextDocument={bodyCopy.json}
                      {...ContentfulLivePreview.getProps({
                        entryId: id,
                        fieldId: "bodyCopy",
                        locale: lang,
                      })}
                    />
                  )}
                </FlexBox>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </Box>
  );
};
