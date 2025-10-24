import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Header from "@/components/header/Header";
import SubMenuBar from "@/components/header/SubMenuBar";
import Footer from "@/components/footer/Footer";

import { useNavigation } from "@react-navigation/native";

const Layout = ({ children }) => {
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [hiddenScreens, setHiddenScreens] = useState(null);
  const [disabledScreens, setDisabledScreens] = useState(null);

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Header
        selectedMenu={selectedMenu}
        setSelectedMenu={setSelectedMenu}

        hiddenScreens={hiddenScreens}
        setHiddenScreens={setHiddenScreens}

        disabledScreens={disabledScreens}
        setDisabledScreens={setDisabledScreens}
      />
      <SubMenuBar 
      selectedMenu={selectedMenu} 
      navigation={navigation}
      hiddenScreens={hiddenScreens}
      disabledScreens={disabledScreens}
       />
      <View style={styles.content}>{children}</View>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    padding: 20,
  },
});

export default Layout;
