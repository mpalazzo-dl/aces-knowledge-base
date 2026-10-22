import type { CfFetchById } from "@aces/types";
import { ButtonColor, ButtonVariant } from "@aces/ui";

import { CfButton } from "./render";
import { fetchButton } from "./services";
import { ButtonSkeleton } from "./skeleton";

export enum ButtonStyleType {
  PrimaryOutline = "Primary Outline",
  Knockout = "Knockout",
  KnockoutOutline = "Knockout Outline",
}

export const buttonStyles: Record<
  ButtonStyleType,
  { color: ButtonColor; variant: ButtonVariant }
> = {
  [ButtonStyleType.PrimaryOutline]: { color: "primary", variant: "outlined" },
  [ButtonStyleType.Knockout]: {
    color: "secondary",
    variant: "contained",
  },
  [ButtonStyleType.KnockoutOutline]: {
    color: "secondary",
    variant: "outlined",
  },
};

export const CfButtonServer = async ({ id, preview, lang }: CfFetchById) => {
  let data;

  try {
    data = await fetchButton(id, preview, lang);
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return <ButtonSkeleton />;
  }

  if (!data) {
    return <ButtonSkeleton />;
  }

  return (
    <CfButton
      internalTitle={data.internalTitle}
      title={data.title}
      link={data.link}
      buttonStyle={data.buttonStyle}
      rightIcon={data.rightIcon}
      fullWidthMobile={data.fullWidthMobile}
      __typename={data.__typename}
      id={id}
      lang={lang}
      preview={preview}
    />
  );
};
