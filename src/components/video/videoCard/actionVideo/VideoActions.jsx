import { useState } from "react";
import { View, TouchableOpacity, Text, Modal, Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import styles from "./VideoActionsStyles";
import DeleteVideoModal from "./deleteVideoModal/DeleteVideoModal";
import VideoSaveForm from "./videoSaveForm/VideoSaveForm";
import { useReviewerGuard } from "@/hooks/useReviewerGuard";

const VideoActions = ({ video, reLoad }) => {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const guard = useReviewerGuard();

  return (
    <View style={styles.actionsContainer}>
      <Text style={styles.id}>ID: {video.id}</Text>
      <View style={styles.iconsWrapper}>
        <TouchableOpacity
          onPress={() => guard(() => setSaveModalVisible(true))}
          style={styles.iconButton}
        >
          <FontAwesome name="pencil" size={20} color="#f0ad4e" />
          <Modal visible={saveModalVisible} animationType="slide">
            <View style={{ flex: 1, paddingTop: 40 }}>
              <VideoSaveForm
                video={video}
                onClose={() => setSaveModalVisible(false)}
                reLoad={reLoad}
              />
              <Pressable
                onPress={() => setSaveModalVisible(false)}
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
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => guard(() => setDeleteModalVisible(true))}
          style={styles.iconButton}
        >
          <FontAwesome name="trash" size={20} color="#d9534f" />
        </TouchableOpacity>
        <DeleteVideoModal
          visible={deleteModalVisible}
          onClose={() => setDeleteModalVisible(false)}
          video={video}
          reLoad={reLoad}
        />
      </View>
    </View>
  );
};

export default VideoActions;
