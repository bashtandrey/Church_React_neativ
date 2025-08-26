import React, { useState } from "react";
import { View, StyleSheet} from "react-native";
import Header from "@/components/header/Header";
import SubMenuBar from "@/components/header/SubMenuBar";
import Footer from "@/components/footer/Footer";

import { useNavigation } from "@react-navigation/native";


const Layout = ({ children}) => {
  const [selectedMenu, setSelectedMenu] = useState(null);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Header selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />
      <SubMenuBar selectedMenu={selectedMenu} navigation={navigation} />
      <View style={styles.content}>{children}</View>
      <Footer/>
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
    // backgroundColor: "rgba(48, 110, 149, 0.56)",
  },
});

export default Layout;
