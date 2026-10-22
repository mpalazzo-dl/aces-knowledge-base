"use client";

import MuiButton from "@mui/material/Button";
import NextLink from "next/link";

import { defaultLocale, Locale } from "@aces/i18n";
import { CfResource } from "@aces/types";
import { palette } from "@aces/theme";
import { Box, FlexBox, H4, Modal, Text } from "@aces/ui";

import { DownloadButton } from "./download-button";
import { useResourceLabels } from "./labels";
import { KindBadge } from "./resource-card/kind-badge";
import { ResourcePreview } from "./resource-preview";
import { getResourceHref } from "./utils";

interface ResourceQuickViewProps {
  resource: CfResource;
  open: boolean;
  setOpen: (open: boolean) => void;
  lang?: Locale;
}

export const ResourceQuickView = ({
  resource,
  open,
  setOpen,
  lang = defaultLocale,
}: ResourceQuickViewProps) => {
  const labels = useResourceLabels(lang);

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      onClose={() => setOpen(false)}
      maxWidth="large"
    >
      <Box paddingX={{ xs: 4, md: 8 }} paddingBottom={8}>
        <FlexBox flexDirection="column" gap={2} marginBottom={5}>
          <KindBadge file={resource.file} lang={lang} />
          <H4 component="h2">{resource.title}</H4>
          {resource.description && (
            <Text.Small color={palette.grey[600]}>
              {resource.description}
            </Text.Small>
          )}
        </FlexBox>
        {/* Only mount the preview while open so closed modals don't load files */}
        {open && (
          <ResourcePreview resource={resource} height="60vh" lang={lang} />
        )}
        <FlexBox
          gap={3}
          marginTop={6}
          flexDirection={{ xs: "column", sm: "row" }}
        >
          <DownloadButton
            slug={resource.slug}
            fileName={resource.file?.fileName}
            lang={lang}
          />
          <MuiButton
            component={NextLink}
            href={getResourceHref(resource.slug)}
            variant="outlined"
            color="primary"
          >
            {labels.viewDetails}
          </MuiButton>
        </FlexBox>
      </Box>
    </Modal>
  );
};
