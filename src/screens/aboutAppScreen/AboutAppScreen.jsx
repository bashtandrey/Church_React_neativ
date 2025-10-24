import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import * as Device from "expo-device";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import styles from "./AboutAppScreenStyles";
import { checkForAppUpdate } from "@/api/checkUpdate";
import { getPushPermissionStatus } from "@/api/PushTokenService";
import Layout from "@/components/Layout";
import i18n from "@/i18n";
import { useTranslation } from "react-i18next";
import CountryFlag from "react-native-country-flag";

const AboutAppScreen = () => {
  const { t } = useTranslation("aboutApp");
  const [currentVersion, setCurrentVersion] = useState(null);
  const [latestVersion, setLatestVersion] = useState(null);
  const [updateUrl, setUpdateUrl] = useState(null);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(null);
  const [language, setLanguage] = useState(i18n.language);

  useEffect(() => {
    const checkPush = async () => {
      const isEnabled = await getPushPermissionStatus();
      setPushEnabled(isEnabled);
      if (!Device.isDevice) {
        console.log("Push notifications are not supported on virtual devices");
      } else if (isEnabled === false) {
        Alert.alert(
          "Push Notifications Disabled",
          "You have disabled push notifications. Do you want to enable them again?",
          [
            { text: "No", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () => Linking.openSettings(),
            },
          ]
        );
      }
    };

    checkForAppUpdate().then((data) => {
      setCurrentVersion(data.currentVersion);
      setLatestVersion(data.latestVersion);
      setUpdateUrl(data.storeUrl);
      setIsUpdateAvailable(data.isUpdateAvailable);
    });

    checkPush();
  }, []);
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };
  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <FontAwesome5 name="info-circle" size={30} color="#333" />
          <Text style={styles.title}>{t("title")}</Text>
        </View>
        <View style={styles.block}>
          <Text style={styles.label}>{t("application")}</Text>
          <Text style={styles.text}>Church River Of Life</Text>
        </View>
        <View style={styles.block}>
          <Text style={styles.label}>{t("selectedLanguage")}</Text>
          <View style={styles.languageSwitcher}>
            <TouchableOpacity
              style={[
                styles.langButton,
                language === "ua" ? styles.langButtonActive : null,
              ]}
              onPress={() => changeLanguage("ua")}
            >
              <CountryFlag isoCode="UA" size={16} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.langButton,
                language === "ru" ? styles.langButtonActive : null,
              ]}
              onPress={() => changeLanguage("ru")}
            >
              <CountryFlag isoCode="RU" size={16} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.langButton,
                language === "en" ? styles.langButtonActive : null,
              ]}
              onPress={() => changeLanguage("en")}
            >
              <CountryFlag isoCode="US" size={16} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.block}>
          <Text style={styles.label}>{t("version")}</Text>
          <Text style={styles.text}>
            {currentVersion}
            {isUpdateAvailable && `(${t("available")} ${latestVersion})`}
          </Text>
        </View>

        <View style={styles.block}>
          <Text style={styles.label}>{t("push")}</Text>
          <Text
            style={[
              styles.text,
              pushEnabled === true
                ? { color: "green" }
                : pushEnabled === false
                ? { color: "red" }
                : { color: "gray" },
            ]}
          >
            {pushEnabled === null
              ? "Checking..."
              : pushEnabled
              ? t("enabled")
              : t("disabled")}
          </Text>
        </View>

        <View style={styles.block}>
          <Text style={styles.label}>{t("developer")}</Text>
          <View style={styles.row}>
            <MaterialIcons name="person" size={20} color="#555" />
            <Text style={styles.text}> Andrii Bashtan</Text>
          </View>
        </View>

        <View style={styles.block}>
          <Text style={styles.label}>{t("contact")}</Text>
          <View style={styles.row}>
            <MaterialIcons name="email" size={20} color="#555" />
            <Text style={styles.text}> andrii.bashtan@gmail.com</Text>
          </View>
        </View>
        {isUpdateAvailable && updateUrl && (
          <TouchableOpacity
            style={styles.updateButton}
            onPress={() => Linking.openURL(updateUrl)}
          >
            <Text style={styles.updateButtonText}>{t("buttonUpdated")}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </Layout>
  );
};

export default AboutAppScreen;
