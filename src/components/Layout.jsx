import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Header from "@/components/header/Header";
import SubMenuBar from "@/components/header/SubMenuBar";
import Footer from "@/components/footer/Footer";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const Layout = ({ children }) => {
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [hiddenScreens, setHiddenScreens] = useState(null);
  const [disabledScreens, setDisabledScreens] = useState(null);

  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

export default Layout;