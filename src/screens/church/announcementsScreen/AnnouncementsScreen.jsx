import { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, Modal, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Layout from "@/components/Layout";
import DataLoaderWrapper from "@/components/DataLoaderWrapper";

import PosterListCard from "@/components/poster/posterListCard/PosterListCard";
import PostForm from "@/components/poster/postForm/PostForm";
import styles from "./AnnouncementsScreenStyles";

import { fetchPost } from "@/api/postAPI";
import { useUser } from "@/context/UserContext";
import { useReviewerGuard } from "@/hooks/useReviewerGuard";
import { useTranslation } from "react-i18next";

const AnnouncementsScreen = () => {
  const { t } = useTranslation("announcements");
  const guard = useReviewerGuard();
  const [contentData, setContentData] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAnnouncementsEditor } = useUser();

  const loadData = () => {
    setLoading(true);
    fetchPost()
      .then((res) => {
      const sorted = [...res].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
      setContentData(sorted);
    })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Layout>
      <View style={styles.container}>
        {isAnnouncementsEditor && (
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => guard(() => setShowEditModal(true))}
            >
              <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
              <Text style={styles.createText}>Create Announcements</Text>
            </TouchableOpacity>
          </View>
        )}
        <DataLoaderWrapper
          loading={loading}
          data={contentData}
          onRetry={loadData}
        >
          <PosterListCard
            contentData={contentData}
            showActions={isAnnouncementsEditor}
            reLoad={loadData}
          />
        </DataLoaderWrapper>
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

export default AnnouncementsScreen;
