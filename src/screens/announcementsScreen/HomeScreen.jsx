import { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Modal,
  Pressable,
  Button,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Layout from "@/components/Layout";

import PosterListCard from "@/components/poster/posterListCard/PosterListCard";
import PostForm from "@/components/poster/postForm/PostForm";
import styles from "./HomeScreenStyles";

import { fetchPost } from "@/api/postAPI";
import { useUser } from "@/context/UserContext";

const HomeScreen = () => {
  const [contentData, setContentData] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isPostEditor } = useUser();

  const loadData = () => {
    setLoading(true);
    fetchPost()
      .then((res) => setContentData(res))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Layout>
      <View style={styles.container}>
        {isPostEditor && (
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => setShowEditModal(true)}
            >
              <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
              <Text style={styles.createText}>Create Post</Text>
            </TouchableOpacity>
          </View>
        )}
        {loading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        ) : contentData && contentData.length > 0 ? (
          <PosterListCard
            contentData={contentData}
            showActions={isPostEditor}
            reLoad={loadData}
          />
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ fontSize: 16, marginBottom: 16, color: "gray" }}>
              Нет связи с сервером
            </Text>
            <Button title="Обновить" onPress={loadData} />
          </View>
        )}
      </View>

      <Modal visible={showEditModal} animationType="slide">
        <View style={{ flex: 1, paddingTop: 40 }}>
          <PostForm
            item={null}
            onSuccess={() => {
              setShowEditModal(false);
              loadData();
            }}
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

export default HomeScreen;
