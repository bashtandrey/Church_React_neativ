import React, { useState } from "react";
import { View, TouchableOpacity, Image, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";

import { useUser } from "@/context/UserContext";
import logo from "@/assets/logo.png";
import styles from "./headerStyles";
import AuthButtons from "@/components/authButtons/AuthButtons";
import i18n from "@/i18n";

import CountryFlag from "react-native-country-flag";

const Header = ({ selectedMenu, setSelectedMenu }) => {
  const sizeIcon = 21; // Размер иконок
  const navigation = useNavigation();
  const { isAdmin, isAuthenticated } = useUser();
  const languages = [
    { code: "ru", iso: "RU" },
    { code: "en", iso: "US" },
  ];
  const handleSelect = (key) => {
    setSelectedMenu(selectedMenu === key ? null : key);
  };
  const [currentIndex, setCurrentIndex] = useState(
    languages.findIndex((l) => l.code === i18n.language) || 0
  );
  const changeLanguage = () => {
    const nextIndex = (currentIndex + 1) % languages.length;
    const nextLang = languages[nextIndex];
    i18n.changeLanguage(nextLang.code);
    setCurrentIndex(nextIndex);
  };

  return (
    <View style={styles.header}>
      {/* Логотип */}
      <View style={styles.logoContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Welcome")}>
          <Image source={logo} style={styles.logo} />
        </TouchableOpacity>
        <TouchableOpacity onPress={changeLanguage} style={styles.navItem}>
          <CountryFlag isoCode={languages[currentIndex].iso} size={16} />
        </TouchableOpacity>
      </View>

      {/* Навигационные иконки */}
      <View style={styles.navContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Welcome")}
          style={styles.navItem}
        >
          <FontAwesome5 name="home" size={sizeIcon} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleSelect("church")}
          style={styles.navItem}
        >
          <FontAwesome5 name="place-of-worship" size={sizeIcon} color="white" />
        </TouchableOpacity>

        {isAuthenticated && (
          <>
            {false && (
              <TouchableOpacity
                onPress={() => handleSelect("donate")}
                style={styles.navItem}
              >
                <FontAwesome5
                  name="hand-holding-heart"
                  size={sizeIcon}
                  color="white"
                />
              </TouchableOpacity>
            )}
            {false && (
              <TouchableOpacity
                onPress={() => handleSelect("library")}
                style={styles.navItem}
              >
                <FontAwesome5 name="landmark" size={sizeIcon} color="white" />
              </TouchableOpacity>
            )}
            {isAdmin && (
              <TouchableOpacity
                onPress={() => handleSelect("admin")}
                style={styles.navItem}
              >
                <FontAwesome name="users" size={sizeIcon} color="white" />
              </TouchableOpacity>
            )}
          </>
        )}
        <TouchableOpacity
          onPress={() => navigation.navigate("AboutApp")}
          style={styles.navItem}
        >
          <FontAwesome5 name="info-circle" size={sizeIcon} color="white" />
        </TouchableOpacity>
      </View>

      {/* Авторизация / Профиль */}
      <View style={styles.authContainer}>
        <AuthButtons sizeIcon={sizeIcon} />
      </View>
    </View>
  );
};

export default Header;
