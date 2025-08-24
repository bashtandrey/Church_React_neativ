import React, { useState } from "react";
import styles from "./ActionPostStyles";

import { View, Text, Modal, Pressable, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import PostForm from "../postForm/PostForm";

import Checkbox from "expo-checkbox";
import { deletePost as apiDeletePost } from "@/api/postAPI";
import Toast from "react-native-toast-message";
import { useReviewerGuard } from "@/hooks/useReviewerGuard";

const ActionPost = ({ post, onLoad, styleEDit, styleDelete }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [dontAskAgain, setDontAskAgain] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const guard = useReviewerGuard();

  const handleDeletePress = () => {
    if (dontAskAgain) {
      performDelete();
    } else {
      setShowConfirmModal(true);
    }
  };
  const handleSavePress = () => {
    setShowEditModal(true);
  };

  const performDelete = async () => {
    await apiDeletePost(
      post.id,
      dontAskAgain,
      (message) => {
        setShowConfirmModal(false);
        Toast.show({
          type: "success",
          text1: "Успех!",
          text2: message || `Пост ID ${post.id} удалён`,
          position: "top",
        });
        onLoad?.();
      },
      (errorMessage) => {
        console.error("Ошибка удаления:", errorMessage);
        Toast.show({
          type: "error",
          text1: "Ошибка!",
          text2: errorMessage,
          position: "top",
        });
      }
    );
  };

  return (
    <>
      {/* Модалка подтверждения удаления */}
      <Modal transparent visible={showConfirmModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Вы уверены, что хотите удалить пост ID: {post.id}?
            </Text>

            <View style={styles.checkboxRow}>
              <Checkbox value={dontAskAgain} onValueChange={setDontAskAgain} />
              <Text style={{ marginLeft: 8 }}>Подтвердить</Text>
            </View>

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={styles.cancelText}>Отмена</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.modalButton,
                  styles.confirmButton,
                  !dontAskAgain && { opacity: 0.5 },
                ]}
                onPress={performDelete}
                disabled={!dontAskAgain}
              >
                <Text style={styles.confirmText}>Удалить</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showEditModal} animationType="slide">
        <View style={{ flex: 1, paddingTop: 40 }}>
          <PostForm
            item={post}
            onSuccess={() => {
              setShowEditModal(false);
              onLoad?.(); // перезагрузить список после сохранения
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

      {/* Кнопка запуска удаления */}
      <TouchableOpacity
        style={styleDelete}
        onPress={() => guard(() => handleDeletePress())}
      >
        <FontAwesome name="trash" size={20} color="red" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styleEDit}
        onPress={() => guard(() => handleSavePress())}
      >
        <FontAwesome name="pencil" size={20} color="rgba(3, 86, 9, 0.7)" />
      </TouchableOpacity>
    </>
  );
};

export default ActionPost;
