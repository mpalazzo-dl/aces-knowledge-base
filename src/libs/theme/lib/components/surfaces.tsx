import { Components, Theme } from "@mui/material";
import { palette, shape } from "../config";

/* eslint-disable import/prefer-default-export */
export const surfacesCustomizations: Components<Theme> = {
  MuiAccordion: {
    defaultProps: {
      disableGutters: true,
      elevation: 0,
    },
    styleOverrides: {
      root: {
        backgroundColor: "transparent",
        boxShadow: "none",
        margin: 0,
      },
    },
  },
  MuiAccordionSummary: {
    styleOverrides: {
      expandIconWrapper: {
        color: "inherit",
      },
      root: {
        borderTop: `1px solid ${palette.border.default} !important`,
        borderBottom: `1px solid ${palette.border.default} !important`,
        borderRight: `1px solid ${palette.border.default} !important`,
        borderLeft: `1px solid ${palette.border.default} !important`,
        borderRadius: shape.borderRadius,
        padding: "16px 20px !important",
      },
    },
  },
  MuiAccordionDetails: {
    styleOverrides: {
      root: {
        background: `${palette.common.white} !important`,
        paddingRight: "20px !important",
        paddingLeft: "20px !important",
        borderBottom: `1px solid ${palette.border.default} !important`,
        borderRight: `1px solid ${palette.border.default} !important`,
        borderLeft: `1px solid ${palette.border.default} !important`,
        borderRadius: `0 0 ${shape.borderRadius} ${shape.borderRadius}`,
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      elevation1: {
        boxShadow: "0px 2px 8px 0px rgba(98, 122, 153, 0.16)",
      },
      elevation2: {
        boxShadow: "0px 1px 12px rgba(0, 0, 0, 0.15)",
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        boxShadow: "0px 2px 8px 0px rgba(98, 122, 153, 0.16)",
      },
    },
  },
};
