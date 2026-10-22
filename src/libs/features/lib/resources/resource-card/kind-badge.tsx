"use client";

import { defaultLocale, Locale } from "@aces/i18n";
import { CfAsset } from "@aces/types";
import { palette } from "@aces/theme";
import { FlexBox, Icon, Text } from "@aces/ui";

import { FileKindMeta, formatFileSize, getFileKind } from "../file-kind";
import { useResourceLabels } from "../labels";

interface KindBadgeProps {
  file: CfAsset | null;
  showSize?: boolean;
  lang?: Locale;
}

/** File type (derived from the asset) plus file size, e.g. "PDF · 2.4 MB". */
export const KindBadge = ({
  file,
  showSize = true,
  lang = defaultLocale,
}: KindBadgeProps) => {
  const labels = useResourceLabels(lang);
  const kind = getFileKind(file);
  const meta = FileKindMeta[kind];
  const size = showSize ? formatFileSize(file?.size) : "";

  return (
    <FlexBox alignItems="center" gap={1.5}>
      <Icon icon={meta.icon} size={18} color={meta.color} />
      <Text.Small fontWeight={700} style={{ color: meta.color }}>
        {labels.kinds[kind]}
      </Text.Small>
      {size && <Text.Small color={palette.grey[500]}>{`· ${size}`}</Text.Small>}
    </FlexBox>
  );
};
