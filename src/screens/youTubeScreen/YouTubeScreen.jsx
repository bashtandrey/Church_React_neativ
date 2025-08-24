import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, TouchableOpacity, Text, Modal, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Layout from "@/components/Layout";
import styles from "./YouTubeScreenStyles";
import VideoSaveForm from "@/components/video/videoCard/actionVideo/videoSaveForm/VideoSaveForm";
import VideoListCard from "@/components/video/videoListCard/VideoListCard";
import DataLoaderWrapper from "@/components/DataLoaderWrapper";
import { fetchVideo } from "@/api/videoAPI";
import { useUser } from "@/context/UserContext";
import { useReviewerGuard } from "@/hooks/useReviewerGuard";

const YouTubeScreen = () => {
  const [contentData, setContentData] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isVideoAdmin } = useUser();
  const guard = useReviewerGuard();

  const loadData = () => {
    setLoading(true);
    fetchVideo()
      .then((res) => setContentData(res))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Layout>
      <View style={styles.container}>
        {isVideoAdmin && (
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => guard(() => setShowEditModal(true))}
            >
              <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
              <Text style={styles.createText}>Create Vide</Text>
            </TouchableOpacity>
          </View>
        )}
        <DataLoaderWrapper
          loading={loading}
          data={contentData}
          onRetry={loadData}
        >
          <VideoListCard
            showActions={isVideoAdmin}
            contentData={contentData}
            reLoad={loadData}
          />
        </DataLoaderWrapper>
      </View>

      <Modal visible={showEditModal} animationType="slide">
        <View style={{ flex: 1, paddingTop: 40 }}>
          <VideoSaveForm
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

export default YouTubeScreen;
