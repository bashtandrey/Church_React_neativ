import { useState } from "react";
import { View, TouchableOpacity, Text, Modal, Pressable } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import UserCreateForm from "@/components/users/userCreateForm/UserCreateForm";

import { useNavigation } from "@react-navigation/native";
import { useUser } from "@/context/UserContext";
import styles from "./authButtonsStyles";

const AuthButtons = ({ sizeIcon }) => {
  const navigation = useNavigation();
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  const { isAuthenticated, logOut } = useUser();
  return (
    <View style={styles.container}>
      {!isAuthenticated ? (
        <>
          <TouchableOpacity
            onPress={() => navigation.navigate("LogIn")}
            style={styles.authButton}
          >
            <Entypo name="login" size={sizeIcon} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowSignUpModal(true)}
            style={styles.authButton}
          >
            <MaterialIcons name="person-add-alt" size={sizeIcon} color="white" />
          </TouchableOpacity>
          <Modal visible={showSignUpModal} animationType="slide">
            <View style={{ flex: 1, paddingTop: 40 }}>
              <UserCreateForm onClose={() => setShowSignUpModal(false)} />
              <Pressable
                onPress={() => setShowSignUpModal(false)}
                style={{
                  padding: 10,
                  backgroundColor: "#eee",
                  alignItems: "center",
                }}
              >
                <Text>Закрыть</Text>
              </Pressable>
            </View>
          </Modal>
        </>
      ) : (
        <>
          <TouchableOpacity
            onPress={() => navigation.navigate("Profile")}
            style={styles.authButton}
          >
            <FontAwesome name="user-circle-o" size={sizeIcon} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={logOut} style={styles.authButton}>
            <Entypo name="log-out" size={sizeIcon} color="white" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default AuthButtons;
