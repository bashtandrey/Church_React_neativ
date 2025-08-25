// components/Footer.js
import React from "react";
import { View, Text } from "react-native";
import styles from "./footerStyles";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <View style={styles.footer}>
      <Text style={{ color: "white" }}>
        © {currentYear} Church River of Life. All rights reserved.
      </Text>
    </View>
  );
};

export default Footer;
