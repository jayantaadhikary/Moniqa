declare module "react-native-onboarding-swiper" {
  import { ReactElement } from "react";
  import { TextStyle, ViewStyle } from "react-native";

  export interface Page {
    backgroundColor: string;
    image: ReactElement;
    title: string;
    subtitle: string;
    titleStyles?: TextStyle;
    subTitleStyles?: TextStyle;
  }

  export interface OnboardingProps {
    pages: Page[];
    containerStyles?: ViewStyle;
    imageContainerStyles?: ViewStyle;
    titleStyles?: TextStyle;
    subTitleStyles?: TextStyle;
    bottomBarHighlight?: boolean;
    bottomBarHeight?: number;
    bottomBarColor?: string;
    onSkip?: () => void;
    onDone?: () => void;
    skipToPage?: number;
    transitionAnimationDuration?: number;
    skipLabel?: string;
    nextLabel?: string;
    doneLabel?: string;
    DoneButtonComponent?: React.ComponentType<any>;
    NextButtonComponent?: React.ComponentType<any>;
    SkipButtonComponent?: React.ComponentType<any>;
    DotComponent?: React.ComponentType<any>;
    showSkip?: boolean;
    showPagination?: boolean;
    showNext?: boolean;
    showDone?: boolean;
    controlStatusBar?: boolean;
    allowFontScaling?: boolean;
  }

  export default class Onboarding extends React.Component<OnboardingProps> {}
}
