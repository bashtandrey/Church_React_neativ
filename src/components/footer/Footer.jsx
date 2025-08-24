// components/Footer.js
import React from "react";
import { View,Text } from "react-native";
import styles from "./footerStyles";


const Footer = () => {
  return (
    <View style={styles.footer}>      
      <Text style={{ color: "white" }}>
        © 2023 ChurchApp. All rights reserved.
      </Text>
    </View>
  );
};

export default Footer;
