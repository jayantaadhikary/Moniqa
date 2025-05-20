import { AppColors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Alert,
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const AboutPage: React.FC = () => {
  const openLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(
        "Cannot Open Link",
        `Could not open the URL: ${url}. Please check if you have a web browser installed or try again later.`
      );
      console.error(`Don't know how to open this URL: ${url}`);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={require("@/assets/images/developer-ghibli.jpg")}
          style={styles.developerImage}
        />
        <Text style={styles.title}>Meet the Developer</Text>
        <Text style={styles.paragraph}>
          Hi, I&apos;m Jay, a passionate indie mobile developer and the creator
          of Moniqa.
        </Text>

        <Text style={styles.paragraph}>
          The idea for Moniqa, a personal finance tracking app designed to help
          manage expenses and income with ease, came about when a close friend
          mentioned needing a simple, private way to track their finances.
          Honestly, I also needed something similar to keep my own budget in
          check, as I have a habit of overspending! So, Moniqa is my way of
          granting that wish for my friend, tackling my own financial goals, and
          hopefully helping many others along the way.
        </Text>

        <Text style={styles.subHeader}>My Other Apps</Text>
        <View style={styles.listSectionContainer}>
          <TouchableOpacity
            style={styles.listItemContainer}
            onPress={() => openLink("https://thestoicmonk.xyz")}
          >
            <View style={styles.listItemContent}>
              <Text style={styles.listItemEmojiIcon}>🧘</Text>
              <Text style={styles.listItemText}>
                TheStoicMonk - Mindfulness App
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={AppColors.dark.secondaryText}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.subHeader}>Connect With Me</Text>
        <View style={styles.listSectionContainer}>
          <TouchableOpacity
            style={styles.listItemContainer}
            onPress={() => openLink("https://jayantaadhikary.xyz")}
          >
            <View style={styles.listItemContent}>
              <Text style={styles.listItemEmojiIcon}>🌐</Text>
              <Text style={styles.listItemText}>Website</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={AppColors.dark.secondaryText}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.listItemContainer}
            onPress={() => openLink("https://x.com/jayadky")}
          >
            <View style={styles.listItemContent}>
              <Text style={styles.listItemEmojiIcon}>🐦</Text>
              <Text style={styles.listItemText}>X (Twitter)</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={AppColors.dark.secondaryText}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.listItemContainer}
            onPress={() => openLink("https://youtube.com/yourchannel")}
          >
            <View style={styles.listItemContent}>
              <Text style={styles.listItemEmojiIcon}>▶️</Text>
              <Text style={styles.listItemText}>YouTube</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={AppColors.dark.secondaryText}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.listItemContainer}
            onPress={() => openLink("https://instagram.com/yourprofile")}
          >
            <View style={styles.listItemContent}>
              <Text style={styles.listItemEmojiIcon}>📸</Text>
              <Text style={styles.listItemText}>Instagram</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={AppColors.dark.secondaryText}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.subHeader}>Legal</Text>
        <View style={styles.listSectionContainer}>
          <TouchableOpacity
            style={styles.listItemContainer}
            onPress={() => openLink("https://moniqa.app/terms")}
          >
            <View style={styles.listItemContent}>
              <Text style={styles.listItemEmojiIcon}>📄</Text>
              <Text style={styles.listItemText}>Terms of Service</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={AppColors.dark.secondaryText}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.listItemContainer}
            onPress={() => openLink("https://moniqa.app/privacy")}
          >
            <View style={styles.listItemContent}>
              <Text style={styles.listItemEmojiIcon}>🛡️</Text>
              <Text style={styles.listItemText}>Privacy Policy</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={AppColors.dark.secondaryText}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.dark.background,
  },
  container: {
    flexGrow: 1,
    paddingVertical: 30,
    paddingHorizontal: 15,
  },
  developerImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 25,
    alignSelf: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: AppColors.dark.text,
    marginBottom: 25,
    textAlign: "center",
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: AppColors.dark.text,
    marginTop: 30,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  paragraph: {
    fontSize: 16,
    color: AppColors.dark.text,
    marginBottom: 20,
    lineHeight: 26,
    textAlign: "justify",
    paddingHorizontal: 10,
  },
  listSectionContainer: {
    width: "100%",
    marginBottom: 15,
  },
  listItemContainer: {
    backgroundColor: AppColors.dark.secondaryBackground,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
  },
  listItemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  listItemEmojiIcon: {
    fontSize: 20,
    marginRight: 12,
    color: AppColors.dark.text,
  },
  listItemText: {
    fontSize: 16,
    color: AppColors.dark.text,
    flexShrink: 1,
  },
});

export default AboutPage;
