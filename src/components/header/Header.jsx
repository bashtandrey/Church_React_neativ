import React, { useMemo, useState } from "react";
import {
  View,
  Image,
  Pressable,
  StatusBar,
  Platform,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {FontAwesome, FontAwesome5 } from "@expo/vector-icons";

import { LinearGradient } from "expo-linear-gradient";
import CountryFlag from "react-native-country-flag";

import { useUser } from "@/context/UserContext";
import AuthButtons from "@/components/authButtons/AuthButtons";
import i18n from "@/i18n";
import logo from "@/assets/logo.png";

import styles, { COLORS } from "./headerStyles";
const sizeIcon = 20; // иконки в навигации
const LANGS = [
  { code: "ru", iso: "RU" },
  { code: "en", iso: "US" },
];

const NavButton = ({ icon, isActive, onPress, accessibilityLabel }) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel}
    style={({ pressed }) => [
      styles.navItem,
      isActive && styles.navItemActive,
      pressed && styles.navItemPressed,
    ]}
    android_ripple={{ borderless: true, radius: 26 }}
    hitSlop={8}
  >
    {icon}
  </Pressable>
);

const Header = ({ selectedMenu, setSelectedMenu }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { isAdmin, isDonationView, isAuthenticated } = useUser();

  const [langIndex, setLangIndex] = useState(
    Math.max(0, LANGS.findIndex((l) => l.code === i18n.language))
  );
  const lang = LANGS[langIndex];

  const changeLanguage = () => {
    const next = (langIndex + 1) % LANGS.length;
    i18n.changeLanguage(LANGS[next].code);
    setLangIndex(next);
  };

  const currentRouteName = route?.name ?? "";
  const isRoute = (name) => currentRouteName === name;

  const churchActive = selectedMenu === "church";
  const adminActive = selectedMenu === "admin";

  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  const onScroll = (e) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const atStart = contentOffset.x <= 1;
    const atEnd =
      contentOffset.x + layoutMeasurement.width >= contentSize.width - 1;
    setShowLeftFade(!atStart);
    setShowRightFade(!atEnd);
  };

  const shadowStyle = useMemo(
    () => (Platform.OS === "ios" ? styles.shadowIOS : styles.shadowAndroid),
    []
  );

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={[styles.safe, { backgroundColor: COLORS.headerBg }]} />
      <View style={[styles.header, shadowStyle]}>
        {/* ЛЕВО: Логотип + язык */}
        <View style={styles.left}>
          <Pressable
            onPress={() => navigation.navigate("Welcome")}
            hitSlop={8}
            style={({ pressed }) => [styles.logoWrap, pressed && { opacity: 0.8 }]}
          >
            <Image source={logo} style={styles.logo} />
          </Pressable>

          <Pressable
            onPress={changeLanguage}
            hitSlop={8}
            accessibilityLabel="Change language"
            style={({ pressed }) => [styles.langPill, pressed && styles.navItemPressed]}
          >
            <CountryFlag isoCode={lang.iso} size={14} />
          </Pressable>
        </View>

        {/* ЦЕНТР: прокручиваемые кнопки */}
        <View style={styles.centerWrap}>
          {showLeftFade && (
            <LinearGradient
              pointerEvents="none"
              colors={[COLORS.headerBg, "transparent"]}
              style={[styles.centerEdge, { left: 0 }]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            />
          )}
          {showRightFade && (
            <LinearGradient
              pointerEvents="none"
              colors={["transparent", COLORS.headerBg]}
              style={[styles.centerEdge, { right: 0 }]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            />
          )}

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.centerContent}
            onScroll={onScroll}
            scrollEventThrottle={16}
            bounces
          >
            <NavButton
              accessibilityLabel="Home"
              isActive={isRoute("Welcome")}
              onPress={() => navigation.navigate("Welcome")}
              icon={<FontAwesome5 name="home" size={sizeIcon} color="white" />}
            />

            <NavButton
              accessibilityLabel="Church"
              isActive={churchActive}
              onPress={() =>
                setSelectedMenu(churchActive ? null : "church")
              }
              icon={<FontAwesome5 name="place-of-worship" size={20} color="lightblue" />}
            />


            {isAuthenticated && isAdmin && (
              <NavButton
                accessibilityLabel="Admin"
                isActive={isRoute("ManageAdmin")}
                onPress={() => navigation.navigate("ManageAdmin")}
                icon={<FontAwesome name="users" size={sizeIcon} color="red" />}
              />
            )}
            {isAuthenticated && isDonationView && (
              <NavButton
                accessibilityLabel="Donate"
                isActive={isRoute("DonateScreen")}
                onPress={() => navigation.navigate("DonateScreen")}
                icon={<FontAwesome5 name="donate" size={sizeIcon} color="lightgreen" />}
              />
            )}

            <NavButton
              accessibilityLabel="About"
              isActive={isRoute("AboutApp")}
              onPress={() => navigation.navigate("AboutApp")}
              icon={<FontAwesome5 name="info-circle" size={sizeIcon} color="white" />}
            />
          </ScrollView>
        </View>

        {/* ПРАВО: Авторизация/профиль */}
        <View style={styles.right}>
          <AuthButtons sizeIcon={sizeIcon} setSelectedMenu={setSelectedMenu} />
        </View>
      </View>
    </>
  );
};

export default Header;