import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  Button,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";

import { savePost } from "@/api/postAPI";
import Toast from "react-native-toast-message";
import styles from "./PostFormStyles";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialIcons } from "@expo/vector-icons";

const PostForm = ({ item, onSuccess }) => {
  const id = item?.id ?? null;

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(item?.imageUrl || null);
  const [canEditImage, setCanEditImage] = useState(false);

  const [title, setTitle] = useState(item?.title || null);
  const [showTitle, setShowTitle] = useState(!!item?.title);

  const [description, setDescription] = useState(item?.description || null);
  const [showDescription, setShowDescription] = useState(!!item?.description);

  const [showLink, setShowLink] = useState(!!item?.link);
  const [link, setLink] = useState(item?.link || null);

  const initialDate =
    item?.eventDate && !isNaN(parseLocalDate(item.eventDate))
      ? item.eventDate
      : null;
  const [eventDate, setEventDate] = useState(initialDate);

  const [showEventDate, setShowEventDate] = useState(!!item?.eventDate);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (item?.eventDate) {
      const parsed = parseLocalDate(item.eventDate);
      if (parsed) {
        const year = parsed.getFullYear();
        const month = String(parsed.getMonth() + 1).padStart(2, "0");
        const day = String(parsed.getDate()).padStart(2, "0");
        setEventDate(`${year}-${month}-${day}`);
        setShowEventDate(true);
      }
    }
  }, [item?.eventDate]);

  function parseLocalDate(dateString) {
    if (!dateString || typeof dateString !== "string") return null;

    const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match) return null;

    const [, year, month, day] = match;
    const date = new Date(`${year}-${month}-${day}T00:00:00`);
    return isNaN(date.getTime()) ? null : date;
  }

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "Выбрать дату";
    const date = parseLocalDate(dateString);
    if (!date || isNaN(date)) return "Выбрать дату";
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Toast.show({
        type: "error",
        text1: "Ошибка!",
        text2: "Разрешение на доступ к фото отклонено",
        position: "top",
      });
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
      if (!result.canceled && result.assets?.[0]) {
        const selectedImage = result.assets[0];

        const manipulatedImage = await ImageManipulator.manipulateAsync(
          selectedImage.uri,
          [{ resize: { width: 1000 } }],
          {
            compress: 0.7,
            format: ImageManipulator.SaveFormat.JPEG,
          }
        );

        setImage({
          uri: manipulatedImage.uri,
          name: selectedImage.fileName || "photo.jpg",
          type: "image/jpeg",
        });

        setImagePreview(manipulatedImage.uri);
      }
    } catch (e) {
      console.error("Ошибка выбора изображения:", e);
    }
  };

  const resetForm = () => {
    setImage(null);
    setImagePreview(null);
    setTitle(null);
    setShowTitle(false);
    setDescription(null);
    setShowDescription(false);
    setEventDate(null);
    setLink(null);
    setShowLink(false);
    setShowEventDate(false);
    setCanEditImage(false);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    if (id) formData.append("id", id);
    if (image) {
      formData.append("image", {
        uri: image.uri,
        name: image.name,
        type: image.type,
      });
    }
    if (showTitle && title) formData.append("title", title);
    if (showDescription && description)
      formData.append("description", description);
    if (showEventDate && eventDate) formData.append("eventDate", eventDate);
    if (showLink) {
      formData.append("link", link || null);
    }
    try {
      await savePost(formData);

      Toast.show({
        type: "success",
        text1: "Успех!",
        text2: "Сохранено успешно",
        position: "top",
      });
      onSuccess?.();
      resetForm();
    } catch (err) {
      console.error(err);
      Toast.show({
        type: "error",
        text1: "Ошибка!",
        text2: "Ошибка при сохранении",
        position: "top",
      });
    }
  };
  const renderCheckboxRow = (label, value, setValue) => (
    <View style={styles.checkboxRow}>
      <Pressable onPress={() => setValue(!value)} style={styles.iconButton}>
        <Text style={styles.iconText}>{value ? "−" : "+"}</Text>
      </Pressable>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {renderCheckboxRow("Изменить изображение", canEditImage, setCanEditImage)}

      {canEditImage && (
        <Button title="Выбрать изображение" onPress={pickImage} />
      )}

      {imagePreview && (
        <View style={styles.imageWrapper}>
          {id && <Text style={styles.imageId}>ID: {id}</Text>}
          <Image source={{ uri: imagePreview }} style={styles.imagePreview} />
        </View>
      )}

      {(image || imagePreview) && (
        <>
          {renderCheckboxRow("Добавить заголовок", showTitle, setShowTitle)}
          {showTitle && (
            <TextInput
              style={styles.input}
              placeholder="Заголовок"
              value={title}
              onChangeText={setTitle}
            />
          )}

          {renderCheckboxRow(
            "Добавить описание",
            showDescription,
            setShowDescription
          )}
          {showDescription && (
            <TextInput
              style={styles.textarea}
              placeholder="Описание"
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
            />
          )}

          {renderCheckboxRow(
            "Добавить дату события",
            showEventDate,
            setShowEventDate
          )}
          {showEventDate && (
            <>
              <Pressable
                style={styles.datePickerButton}
                onPress={() => {
                  setShowPicker(true);
                }}
              >
                <MaterialIcons name="calendar-today" size={24} color="#333" />
                <Text style={styles.dateText}>
                  {formatDateForDisplay(eventDate)}
                </Text>
              </Pressable>

              {showPicker && (
                <DateTimePicker
                  value={parseLocalDate(eventDate) || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowPicker(false); // лучше закрывать в любом случае
                    if (selectedDate) {
                      const year = selectedDate.getFullYear();
                      const month = (selectedDate.getMonth() + 1)
                        .toString()
                        .padStart(2, "0");
                      const day = selectedDate
                        .getDate()
                        .toString()
                        .padStart(2, "0");
                      const formattedDate = `${year}-${month}-${day}`;
                      setEventDate(formattedDate);
                      console.log("Выбрана дата:", formattedDate);
                    }
                  }}
                />
              )}
            </>
          )}
          {renderCheckboxRow("Добавить ссылку", showLink, setShowLink)}
          {showLink && (
            <TextInput
              style={styles.input}
              placeholder="Ссылка"
              value={link}
              onChangeText={setLink}
            />
          )}
        </>
      )}

      <Button title="Сохранить" onPress={handleSubmit} />
    </ScrollView>
  );
};

export default PostForm;
