import { CfResource, Nested } from "@aces/types";
import { componentSpacing } from "@aces/theme";
import { Box, Container } from "@aces/ui";
import { ResourceEmbedCard } from "@aces/features";

export interface CfResourceEmbedProps extends Nested {
  resource: CfResource;
  lang: string;
}

export const CfResourceEmbed = ({
  resource,
  lang,
  nested,
}: CfResourceEmbedProps) => {
  return (
    <Box
      marginY={{
        xs: !nested ? componentSpacing.xs : 4,
        md: !nested ? componentSpacing.md : 4,
      }}
    >
      <Container nested={nested}>
        <ResourceEmbedCard resource={resource} lang={lang} />
      </Container>
    </Box>
  );
};
