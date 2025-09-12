import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  TouchableOpacity,
  Text,
  Modal,
  Pressable,
  ActivityIndicator,
} from "react-native";
import styles from "./DonateMemberScreenStyles";

const DonateMemberScreen = () => {
  const [contentData, setContentData] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  // const { isAdmin } = useUser();
  const [loading, setLoading] = useState(true);

  // const navigation = useNavigation();
    const loadData = () => {
      setLoading(true);
      // fetchUsers()
        // .then((res) => setContentData(res))
        // .catch((error) => {
          // const message = error?.message || "Ошибка при загрузке пользователей";
          // Toast.show({
            // type: "error",
            // text1: "Ошибка!",
            // text2: message,
            // position: "top",
          // });
        // })
        // .finally(() => setLoading(false));
      setLoading(false); // Remove this line if using fetchUsers, otherwise keep for demo
    };
  
    useEffect(() => {
      loadData();
    }, []);
  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.createButton}
            // onPress={handleCreatePress}
          >
            <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
            <Text style={styles.createText}>Create Member</Text>
          </TouchableOpacity>
        </View>
                {loading ? (
                  <View
                    style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
                  >
                    <ActivityIndicator size="large" color="#007AFF" />
                  </View>
                ) : (
                  {/* Replace with your actual content or component */}
                  {/* <UserListCard
                    contentData={contentData}
                    isAdmin={isAdmin}
                    reLoad={loadData}
                  /> */}
                )}
        </View>

    </Layout>
  );
};

export default DonateMemberScreen;