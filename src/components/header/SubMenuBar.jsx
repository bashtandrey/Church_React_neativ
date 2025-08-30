import React from "react";
import { View, TouchableOpacity } from "react-native";
import { MaterialIcons, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import styles from "./subMenuStyles";

const SubMenuBar = ({ selectedMenu, navigation }) => {
  if (!selectedMenu) return null;

  let items = [];
  switch (selectedMenu) {
    case "church":
      items = [
        { icon: "bullhorn", screen: "Announcements", lib: "FontAwesome" },
        { icon: "youtube-play", screen: "YouTube", lib: "FontAwesome" },
        { icon: "donate", screen: "LinkDonate", lib: "FontAwesome5" },
        { icon: "bible", screen: "PlanVersesYear", lib: "FontAwesome5" },
        { icon: "announcement", screen: "AboutChurch", lib: "MaterialIcons" },
      ];
      break;
    // case "donate":
    //   console.log("Donate menu selected");
    // items = [
    //   { icon: "users", screen: "DonateMember", lib: "FontAwesome" },
    //   // { icon: "circle-dollar-to-slot", screen: "*", lib :"FontAwesome" },
    //   // { icon: "attach-money", screen: "Donate", lib :"TouchableOpacity" },
    //   // { icon: "announcement", screen: "About", lib :"MaterialIcons" },

    // ];
    // break;
    case "admin":
      console.log("Admin menu selected");
      items = [
        // { icon: "users", screen: "*", lib: "FontAwesome" },
        // { icon: "circle-dollar-to-slot", screen: "*", lib :"FontAwesome" },
        { icon: "user", screen: "Admin", lib: "FontAwesome" },
        // { icon: "announcement", screen: "About", lib :"MaterialIcons" },
      ];
      break;

    default:
      return null;
  }

  return (
    <View style={styles.subMenuBar}>
      {items.map((item, index) => {
        const IconComponent =
          item.lib === "FontAwesome"
            ? FontAwesome
            : item.lib === "FontAwesome5"
            ? FontAwesome5
            : MaterialIcons;

        return (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate(item.screen)}
            style={styles.subMenuItem}
          >
            <IconComponent name={item.icon} size={24} color="white" />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default SubMenuBar;
