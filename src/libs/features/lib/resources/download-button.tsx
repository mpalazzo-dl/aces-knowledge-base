"use client";

import MuiButton from "@mui/material/Button";
import MuiIconButton from "@mui/material/IconButton";

import { defaultLocale, Locale } from "@aces/i18n";
import { Icon, Tooltip } from "@aces/ui";

import { useResourceLabels } from "./labels";
import { getResourceDownloadHref } from "./utils";

interface DownloadButtonProps {
  slug: string;
  fileName?: string;
  compact?: boolean;
  fullWidth?: boolean;
  lang?: Locale;
}

export const DownloadButton = ({
  slug,
  fileName,
  compact = false,
  fullWidth = false,
  lang = defaultLocale,
}: DownloadButtonProps) => {
  const labels = useResourceLabels(lang);
  const href = getResourceDownloadHref(slug);
  const ariaLabel = fileName
    ? `${labels.download} ${fileName}`
    : labels.download;

  if (compact) {
    return (
      <Tooltip title={labels.download}>
        <MuiIconButton
          component="a"
          href={href}
          color="primary"
          size="small"
          aria-label={ariaLabel}
          onClick={(event) => event.stopPropagation()}
        >
          <Icon icon="Download" size={22} />
        </MuiIconButton>
      </Tooltip>
    );
  }

  return (
    <MuiButton
      component="a"
      href={href}
      variant="contained"
      color="primary"
      fullWidth={fullWidth}
      aria-label={ariaLabel}
      startIcon={<Icon icon="Download" size={20} />}
    >
      {labels.download}
    </MuiButton>
  );
};
