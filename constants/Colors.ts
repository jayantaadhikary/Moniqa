/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */
// Primary accent colors
const mintAccentDark = "#2BBBAD"; // Cool Mint
const mintAccentLight = "#A5F3FC"; // Teal Blue"

// Brand highlight colors
const brandHighlightDark = "#2BBBAD"; // Teal Blue
const brandHighlightLight = "#0D0D0D"; // Jet Black

// Custom colors for our app
export const AppColors = {
  light: {
    text: "#0D0D0D", // Jet Black for text in light mode
    background: "#FFFFFF", // White background for light mode
    tint: mintAccentLight, // Teal Blue as primary accent
    icon: "#687076", // Medium gray for icons
    tabIconDefault: "#687076",
    tabIconSelected: mintAccentLight,
    secondaryText: "#71717A", // Medium dark gray for secondary text
    brandHighlight: brandHighlightLight,
    error: "#D32F2F",
    cardBackground: "#FFFFFF",
    border: "#E0E0E0",
    primary: mintAccentLight, // Added for completeness, though tint is often used
    danger: "#FF3B30", // iOS Red
  },
  dark: {
    text: "#FFFFFF", // Pure White for primary text
    background: "#0D0D0D", // Jet Black background
    tint: mintAccentDark, // Cool Mint as primary accent
    icon: "#D1D1D6", // Light Gray for icons
    tabIconDefault: "#D1D1D6",
    tabIconSelected: mintAccentDark,
    secondaryText: "#D1D1D6", // Light Gray for secondary text
    brandHighlight: brandHighlightDark,
    secondaryBackground: "#1e1e1e",
    error: "#FF6B6B",
    cardBackground: "#2C2C2E",
    border: "#3A3A3C",
    primary: mintAccentDark, // Added for completeness
    success: "#34C759", // Standard iOS success green
    danger: "#FF3B30", // iOS Red
  },
};

// Theme compatible with React Navigation
export const Colors = {
  light: {
    dark: false,
    colors: {
      primary: AppColors.light.primary,
      background: AppColors.light.background,
      card: AppColors.light.cardBackground,
      text: AppColors.light.text,
      border: AppColors.light.border,
      notification: AppColors.light.tint, // Or specific notification color
      // Custom colors propagated to the theme
      icon: AppColors.light.icon,
      tabIconDefault: AppColors.light.tabIconDefault,
      tabIconSelected: AppColors.light.tabIconSelected,
      secondaryText: AppColors.light.secondaryText,
      brandHighlight: AppColors.light.brandHighlight,
      tint: AppColors.light.tint,
      error: AppColors.light.error,
    },
    fonts: {},
  },
  dark: {
    dark: true,
    colors: {
      primary: AppColors.dark.primary,
      background: AppColors.dark.background,
      card: AppColors.dark.cardBackground,
      text: AppColors.dark.text,
      border: AppColors.dark.border,
      notification: AppColors.dark.tint, // Or specific notification color
      // Custom colors propagated to the theme
      icon: AppColors.dark.icon,
      tabIconDefault: AppColors.dark.tabIconDefault,
      tabIconSelected: AppColors.dark.tabIconSelected,
      secondaryText: AppColors.dark.secondaryText,
      brandHighlight: AppColors.dark.brandHighlight,
      tint: AppColors.dark.tint,
      error: AppColors.dark.error,
    },
    fonts: {},
  },
};
