import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppColors } from "../constants/Colors";

const { width, height } = Dimensions.get("window");

const OnBoardingPage = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleDone = () => {
    // router.replace("/(tabs)" as any);
    router.replace("/initialData" as any);
  };

  const DoneButton = ({ isLight, ...props }: any) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.02,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, [scaleAnim]);

    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          {...props}
          style={[styles.doneButton, { backgroundColor: "#2BBBAD" }]}
        >
          <Text style={styles.doneButtonText}>Start Now</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const SkipButton = ({ skipLabel, isLight, ...props }: any) => (
    <TouchableOpacity {...props}>
      <Text style={styles.skipButtonText}>Skip</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <StatusBar barStyle="light-content" />
      <Onboarding
        containerStyles={{ paddingTop: insets.top }}
        bottomBarHighlight={false}
        DoneButtonComponent={DoneButton}
        SkipButtonComponent={SkipButton}
        showNext={false}
        onDone={handleDone}
        onSkip={handleDone}
        titleStyles={{ color: AppColors.dark.text }}
        subTitleStyles={{ color: AppColors.dark.secondaryText }}
        pages={[
          {
            backgroundColor: AppColors.dark.background,
            image: (
              <Image
                source={require("../assets/images/logo_ideat2.png")}
                style={styles.image}
              />
            ),
            title: "Meet Moniqa.",
            subtitle:
              "Your smart, simple solution to track every penny effortlessly.",
          },
          {
            backgroundColor: AppColors.dark.background,
            image: (
              <View style={styles.featureIconContainer}>
                <View style={styles.featureIcon}>
                  <Text style={styles.featureIconText}>⚡️</Text>
                </View>
              </View>
            ),
            title: "Add expenses in few taps.",
            subtitle: "No spreadsheets. No clutter. Just log and go.",
          },
          {
            backgroundColor: AppColors.dark.background,
            image: (
              <View style={styles.featureIconContainer}>
                <View style={styles.featureIcon}>
                  <Text style={styles.featureIconText}>📊</Text>
                </View>
              </View>
            ),
            title: "See where your money goes.",
            subtitle:
              "Smart summaries and daily overviews make things crystal clear.",
          },
          {
            backgroundColor: AppColors.dark.background,
            image: (
              <View style={styles.featureIconContainer}>
                <View style={styles.featureIcon}>
                  <Text style={styles.featureIconText}>🎯</Text>
                </View>
              </View>
            ),
            title: "Smarter insights, better habits.",
            subtitle:
              "Set soft limits, track streaks, and get gentle nudges — all personalized for you.",
          },
          {
            backgroundColor: AppColors.dark.background,
            image: (
              <View style={styles.featureIconContainer}>
                <View style={styles.featureIcon}>
                  <Text style={styles.featureIconText}>🔒</Text>
                </View>
              </View>
            ),
            title: "Your money talk stays secret.",
            subtitle:
              "Moniqa keeps everything on your phone — we can’t see a thing, and we like it that way.",
          },
        ]}
      />
    </>
  );
};
const styles = StyleSheet.create({
  image: {
    width: width * 0.6,
    height: height * 0.3,
    resizeMode: "contain",
  },
  doneButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  doneButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
  skipButtonText: {
    color: AppColors.dark.secondaryText,
    fontWeight: "500",
    fontSize: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  featureIconContainer: {
    width: width * 0.6,
    height: height * 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  featureIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: AppColors.dark.tint + "20",
    justifyContent: "center",
    alignItems: "center",
  },
  featureIconText: {
    fontSize: 50,
  },
});

export default OnBoardingPage;
