import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  TouchableOpacity,
  Text,
  Modal,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import UserListCard from "@/components/users/userListCard/UserListCard";
import UserCreateForm from "@/components/users/userCreateForm/UserCreateForm";

import Layout from "@/components/Layout";
import styles from "./AdminScreenStyles";

import Toast from "react-native-toast-message";
import { fetchUsers } from "@/api/userAPI";
import { useUser } from "@/context/UserContext";
import { useReviewerGuard } from "@/hooks/useReviewerGuard";

const AdminScreen = () => {
  const [contentData, setContentData] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const { isAdmin } = useUser();
  const [loading, setLoading] = useState(true);
  const guard = useReviewerGuard();
  const navigation = useNavigation();

  const loadData = () => {
    setLoading(true);
    fetchUsers()
      .then((res) => setContentData(res))
      .catch((error) => {
        const message = error?.message || "Ошибка при загрузке пользователей";
        Toast.show({
          type: "error",
          text1: "Ошибка!",
          text2: message,
          position: "top",
        });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!isAdmin) {
      navigation.replace("Home");
    }
  }, [isAdmin, navigation]);

  const handleCreatePress = () => {
    setShowEditModal(true);
  };
  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => guard(() => handleCreatePress())}
          >
            <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
            <Text style={styles.createText}>Create User</Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        ) : (
          <UserListCard
            contentData={contentData}
            isAdmin={isAdmin}
            reLoad={loadData}
          />
        )}
      </View>

      <Modal visible={showEditModal} animationType="slide" transparent={true}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            paddingTop: 40,
          }}
        >
          <UserCreateForm
            onClose={() => setShowEditModal(false)}
            reLoad={loadData}
          />

          <Pressable
            onPress={() => setShowEditModal(false)}
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
    </Layout>
  );
};

export default AdminScreen;
