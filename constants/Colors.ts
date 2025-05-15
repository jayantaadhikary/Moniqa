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
  },
};

// Theme compatible with React Navigation
export const Colors = {
  light: {
    dark: false,
    colors: {
      primary: mintAccentLight,
      background: "#FFFFFF",
      card: "#FFFFFF",
      text: "#0D0D0D",
      border: "#E5E5E5",
      notification: mintAccentLight,
      // Custom colors
      icon: "#687076",
      tabIconDefault: "#687076",
      tabIconSelected: mintAccentLight,
      secondaryText: "#71717A",
      brandHighlight: brandHighlightLight,
      tint: mintAccentLight,
    },
    // Default empty fonts object as required by react-navigation
    fonts: {},
  },
  dark: {
    dark: true,
    colors: {
      primary: mintAccentDark,
      background: "#0D0D0D",
      card: "#0D0D0D",
      text: "#FFFFFF",
      border: "#2A2A2A",
      notification: mintAccentDark,
      // Custom colors
      icon: "#D1D1D6",
      tabIconDefault: "#D1D1D6",
      tabIconSelected: mintAccentDark,
      secondaryText: "#D1D1D6",
      brandHighlight: brandHighlightDark,
      tint: mintAccentDark,
    },
    // Default empty fonts object as required by react-navigation
    fonts: {},
  },
};
