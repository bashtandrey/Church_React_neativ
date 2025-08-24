import React, { useState } from "react";
import { View, TouchableOpacity, Image, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';


import { useUser } from "@/context/UserContext";
import logo from "@/assets/logo.png";
import styles from "./headerStyles";
import AuthButtons from "@/components/authButtons/AuthButtons";

const Header = () => {
  const sizeIcon = 21; // Размер иконок
  const navigation = useNavigation();
  const { isAdmin, isAuthenticated } = useUser();
  const [selected, setSelected] = useState(null);
  
  const toggleMenu = (key) => {
    setSelected(prev => (prev === key ? null : key));
  };

  return (
    <View style={styles.header}>
      {/* Логотип */}
      <View style={styles.logoContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Image source={logo} style={styles.logo} />
        </TouchableOpacity>
      </View>

      {/* Навигационные иконки */}
      <View style={styles.navContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={styles.navItem}
        >
          <MaterialIcons name="home" size={sizeIcon} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("YouTube")}
          style={styles.navItem}
        >
          <FontAwesome name="youtube-play" size={sizeIcon} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Donate")}
          style={styles.navItem}
        >
          <MaterialIcons name="attach-money" size={sizeIcon} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("About")}
          style={styles.navItem}
        >
          <MaterialIcons name="info-outline" size={sizeIcon} color="white" />
        </TouchableOpacity>
        {isAuthenticated && (
          <>
            {isAdmin && (
              <TouchableOpacity
                onPress={() => navigation.navigate("Admin")}
                style={styles.navItem}
              >
                <FontAwesome name="user" size={sizeIcon} color="white" />
              </TouchableOpacity>
            )}
          </>
        )}
      </View>

      {/* Авторизация / Профиль */}
      <View style={styles.authContainer}>
        <AuthButtons sizeIcon={sizeIcon} />
      </View>
    </View>
  );
};

export default Header;
