import { useState } from "react";
import { View, TouchableOpacity, Text, Modal, Pressable } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import UserCreateForm from "@/components/users/userCreateForm/UserCreateForm";
import ModalTrigger from "@/components/common/ModalTrigger";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "@/context/UserContext";
import styles from "./authButtonsStyles";
import { useReviewerGuard } from "@/hooks/useReviewerGuard";

const AuthButtons = ({ sizeIcon, setSelectedMenu }) => {
  const navigation = useNavigation();
  const guard = useReviewerGuard();
  const { isAuthenticated, logOut } = useUser();
  return (
    <View style={styles.container}>
      {!isAuthenticated && (
        <>
          <TouchableOpacity
            onPress={() => navigation.navigate("LogIn")}
            style={styles.authButton}
          >
            <Entypo name="login" size={sizeIcon} color="white" />
          </TouchableOpacity>
          <ModalTrigger
            opener={(open) => (
              <TouchableOpacity
                onPress={() => guard(open)}
                style={styles.authButton}
              >
                <MaterialIcons
                  name="person-add-alt"
                  size={sizeIcon}
                  color="white"
                />
              </TouchableOpacity>
            )}
          >
            {({ close }) => (
              <UserCreateForm
                visible
                onClose={close}
              />
            )}
          </ModalTrigger>
        </>
      )}
      {isAuthenticated && (
        <>
          <TouchableOpacity
            onPress={() => navigation.navigate("Profile")}
            style={styles.authButton}
          >
            <FontAwesome name="user-circle-o" size={sizeIcon} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              navigation.navigate("Welcome");
              setSelectedMenu?.(null);
              await logOut();
            }}
            style={styles.authButton}
          >
            <Entypo name="log-out" size={sizeIcon} color="white" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default AuthButtons;
