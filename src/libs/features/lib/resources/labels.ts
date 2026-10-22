"use client";

import { useGetLocale } from "@aces/hooks";
import { defaultLocale, Locale } from "@aces/i18n";

import defaultCommon from "../../../i18n/locale/en-US/common.json";

export type ResourceLabels = typeof defaultCommon.resources;

/**
 * Resource UI strings for client components. Falls back to the default
 * locale while the requested locale is loading so cards never flash empty.
 */
export const useResourceLabels = (
  lang: Locale = defaultLocale,
): ResourceLabels => {
  const { t } = useGetLocale(lang, "common");
  return t?.resources ?? defaultCommon.resources;
};
