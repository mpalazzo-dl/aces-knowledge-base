import localFont from "next/font/local";
import { createTheme, lighten } from "@mui/material/styles";

import { PaletteMode, Shape, Size } from "@aces/types";

declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    xxl: true;
  }
}

interface CustomPalette {
  gradient: {
    primaryMainLight90: string;
  };
  tertiary: {
    grayblue: string;
    yellow: string;
  };
  foreground: {
    default: string;
  };
  border: {
    light: string;
    default: string;
    input: string;
  };
}

declare module "@mui/material/styles/createPalette" {
  interface ColorRange {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  }

  interface Palette extends CustomPalette {}
  interface PaletteOptions extends CustomPalette {}
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    light: true;
    gradient: true;
  }

  interface ButtonOwnProps {
    shape?: Shape;
  }
}

declare module "@mui/material/IconButton" {
  interface IconButtonPropsColorOverrides {
    light: true;
  }

  interface IconButtonOwnProps {
    variant?: "standard" | "contained" | "outlined";
    shape?: Shape;
  }
}

declare module "@mui/material/Chip" {
  interface ChipPropsColorOverrides {
    light: true;
  }

  interface ChipOwnProps {
    shape?: Shape;
  }
}

declare module "@mui/material/Backdrop" {
  interface BackdropOwnProps {
    mode: PaletteMode;
  }
}

declare module "@mui/material/FormControlLabel" {
  interface FormControlLabelProps {
    size?: Size;
  }
}

declare module "@mui/material/styles" {
  interface TypographyVariants {
    textTransform?: string;
  }

  interface TypographyVariantsOptions {
    textTransform?: string;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    caption2: true;
  }
}

const defaultTheme = createTheme();

export const headerFont = localFont({
  src: [
    {
      path: "../../../../public/fonts/BeausiteFit-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../../public/fonts/BeausiteFit-Regular.woff",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-header",
});

export const primaryFont = localFont({
  src: [
    {
      path: "../../../../public/fonts/Gotham-Book.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../../public/fonts/Gotham-Book.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../../public/fonts/Gotham-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../../../public/fonts/Gotham-Light.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../../../public/fonts/Gotham-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../../../public/fonts/Gotham-Bold.woff",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-primary",
});

export const fontWeights = {
  thin: 100,
  extraLight: 200,
  light: 300,
  regular: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
  extraBold: 800,
  black: 900,
};

export const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1080,
    xl: 1440,
    xxl: 1920,
  },
};

export const componentSpacing = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 24,
  xxl: 34,
};

export const containerPadding = {
  xs: 5,
  sm: 8,
  md: 15,
  lg: 15,
  xl: 15,
};

export const spacing = 4;

export const maxTextWidth = "815px";

export const common = {
  white: "#ffffff",
  black: "#000000",
};

export const primary = {
  light: "#A8D9FF",
  main: "#007BE8",
  dark: "#003D72",
};

export const secondary = {
  light: "#FFB49B",
  main: "#E94718",
  dark: "#7A260C",
};

export const tertiary = {
  grayblue: "#EAEEF3",
  yellow: "#FFD627",
};

export const red = {
  light: "#FFB49B",
  main: "#E94718",
  dark: "#7A260C",
};

export const green = {
  light: "#9DC44B",
  main: "#5BA64F",
  dark: "#439652",
};

export const grey = {
  50: "#fafafa",
  100: "#F4F4F4",
  200: "#f0f0f0",
  300: "#d4d4d4",
  400: "#a3a3a3",
  500: "#737373",
  600: "#525252",
  700: "#404040",
  800: "#262626",
  900: "#171717",
  950: "#0a0a0a",
};

export const gradient = {
  primaryMainLight90: `linear-gradient(90deg, ${primary.main} 0%, ${primary.light} 100%)`,
  primaryMainLight270: `linear-gradient(270deg, ${primary.main} 0%, ${primary.light} 100%)`,
  tertiaryBlueGray90: `linear-gradient(90deg, ${tertiary.grayblue} 0%, ${lighten(tertiary.grayblue, 0.5)} 100%)`,
};

export const palette = {
  mode: "light",
  common: {
    white: common.white,
    black: common.black,
  },
  primary: {
    light: primary.light,
    main: primary.main,
    dark: primary.dark,
    contrastText: common.white,
  },
  secondary: {
    main: secondary.main,
    light: secondary.light,
    dark: secondary.dark,
    contrastText: common.white,
  },
  tertiary: {
    grayblue: tertiary.grayblue,
    yellow: tertiary.yellow,
  },
  error: {
    light: red.light,
    main: red.main,
    dark: red.dark,
    contrastText: common.white,
  },
  success: {
    light: green.light,
    main: green.main,
    dark: green.dark,
    contrastText: common.white,
  },
  grey: {
    ...grey,
  },
  gradient: {
    primaryMainLight90: gradient.primaryMainLight90,
    primaryMainLight270: gradient.primaryMainLight270,
    tertiaryBlueGray90: gradient.tertiaryBlueGray90,
  },
  divider: grey[100],
  text: {
    primary: common.black,
    secondary: grey[600],
  },
  background: {
    default: common.white,
    paper: common.white,
  },
  foreground: {
    default: common.black,
  },
  border: {
    light: grey[200],
    default: grey[300],
    input: grey[400],
  },
};

export const shape = {
  borderRadius: 2.5,
};

export const typography = {
  fontFamily: primaryFont.style.fontFamily,
  h1: {
    fontFamily: headerFont.style.fontFamily,
    fontSize: defaultTheme.typography.pxToRem(100),
    lineHeight: defaultTheme.typography.pxToRem(80),
    fontWeight: 400,
    [`@media (max-width:${breakpoints.values.md}px)`]: {
      fontSize: defaultTheme.typography.pxToRem(50),
      lineHeight: defaultTheme.typography.pxToRem(50),
    },
  },
  h2: {
    fontFamily: headerFont.style.fontFamily,
    fontSize: defaultTheme.typography.pxToRem(80),
    lineHeight: defaultTheme.typography.pxToRem(80),
    fontWeight: 400,
    [`@media (max-width:${breakpoints.values.md}px)`]: {
      fontSize: defaultTheme.typography.pxToRem(48),
      lineHeight: defaultTheme.typography.pxToRem(48),
    },
  },
  h3: {
    fontFamily: headerFont.style.fontFamily,
    fontSize: defaultTheme.typography.pxToRem(50),
    lineHeight: defaultTheme.typography.pxToRem(50),
    fontWeight: 400,
    [`@media (max-width:${breakpoints.values.md}px)`]: {
      fontSize: defaultTheme.typography.pxToRem(40),
      lineHeight: defaultTheme.typography.pxToRem(44),
    },
  },
  h4: {
    fontFamily: headerFont.style.fontFamily,
    fontSize: defaultTheme.typography.pxToRem(40),
    lineHeight: defaultTheme.typography.pxToRem(44),
    fontWeight: 400,
    [`@media (max-width:${breakpoints.values.md}px)`]: {
      fontSize: defaultTheme.typography.pxToRem(36),
      lineHeight: defaultTheme.typography.pxToRem(40),
    },
  },
  h5: {
    fontFamily: headerFont.style.fontFamily,
    fontSize: defaultTheme.typography.pxToRem(30),
    lineHeight: defaultTheme.typography.pxToRem(36),
    fontWeight: 400,
    [`@media (max-width:${breakpoints.values.md}px)`]: {
      fontSize: defaultTheme.typography.pxToRem(30),
      lineHeight: defaultTheme.typography.pxToRem(36),
    },
  },
  h6: {
    fontFamily: primaryFont.style.fontFamily,
    fontSize: defaultTheme.typography.pxToRem(14),
    lineHeight: defaultTheme.typography.pxToRem(21),
    fontWeight: 400,
    [`@media (max-width:${breakpoints.values.md}px)`]: {
      fontSize: defaultTheme.typography.pxToRem(14),
      lineHeight: defaultTheme.typography.pxToRem(18),
    },
  },
  subtitle1: {
    fontSize: defaultTheme.typography.pxToRem(18),
    lineHeight: defaultTheme.typography.pxToRem(24),
  },
  subtitle2: {
    fontSize: defaultTheme.typography.pxToRem(14),
    lineHeight: defaultTheme.typography.pxToRem(24),
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  },
  body1: {
    fontSize: defaultTheme.typography.pxToRem(16),
    lineHeight: defaultTheme.typography.pxToRem(21),
  },
  body2: {
    fontSize: defaultTheme.typography.pxToRem(18),
    lineHeight: defaultTheme.typography.pxToRem(24),
  },
  caption: {
    fontSize: defaultTheme.typography.pxToRem(11),
    lineHeight: defaultTheme.typography.pxToRem(12),
  },
  caption2: {
    fontSize: defaultTheme.typography.pxToRem(12),
    lineHeight: defaultTheme.typography.pxToRem(14),
  },
  link: {
    color: palette.primary.main,
    "&:hover": {
      color: palette.primary.light,
    },
  },
};
