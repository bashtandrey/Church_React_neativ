import React, { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import styles from "./SaveBookModalStyles";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import { saveBook } from "@/api/libraryAPI";

const SaveBookModal = ({ visible, onClose, book, reLoad }) => {
  const { t } = useTranslation("bookScreen");

  const [id, setId] = useState(null);
  const [serial, setSerial] = useState("");
  const [errorSerial, setErrorSerial] = useState(null);
  const [nameBook, setNameBook] = useState("");
  const [errorNameBook, setErrorNameBook] = useState(null);
  const [publishingYear, setPublishingYear] = useState("");
  const [publishingHouse, setPublishingHouse] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (book) {
      setId(book.id);
      setSerial(book.serial || "");
      setNameBook(book.nameBook || "");
      setPublishingYear(book.publishingYear || "");
      setPublishingHouse(book.publishingHouse || "");
      setDescription(book.description || "");
    } else {
      setId(null);
      setSerial("");
      setNameBook("");
      setPublishingYear("");
      setPublishingHouse("");
      setDescription("");
    }
  }, [book, visible]);

  const handleSave = async () => {
    let hasError = false;

    if (!serial.trim()) {
      setErrorSerial(t("createForm.errors.serialRequired"));
      hasError = true;
    } else setErrorSerial(null);

    if (!nameBook.trim()) {
      setErrorNameBook(t("createForm.errors.nameRequired"));
      hasError = true;
    } else setErrorNameBook(null);

    if (hasError) return;

    const res = await saveBook({
      id,
      serial,
      nameBook,
      publishingYear,
      publishingHouse,
      description,
    });

    if (res.success) {
      Toast.show({
        type: "success",
        text1: t("createForm.toasts.successTitle"),
        text2:
          res.status === 201
            ? t("createForm.toasts.successCreate")
            : t("createForm.toasts.successEdit"),
        position: "top",
      });
      reLoad?.();
      onClose();
    } else {
      if (res.field === "serial") {
        setErrorSerial(res.error);
      } else if (res.field === "nameBook") {
        setErrorNameBook(res.error);
      } else {
        Toast.show({
          type: "error",
          text1: t("createForm.toasts.errorTitle"),
          text2: res.error || t("createForm.toasts.unknownError"),
          position: "top",
        });
      }
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>
            {book ? t("createForm.editTitle") : t("createForm.createTitle")}
          </Text>

          <TextInput
            value={serial}
            onChangeText={setSerial}
            placeholder={t("createForm.serial")}
            style={[styles.input, errorSerial && styles.inputError]}
          />
          {errorSerial && <Text style={styles.errorText}>{errorSerial}</Text>}

          <TextInput
            value={nameBook}
            onChangeText={setNameBook}
            placeholder={t("createForm.nameBook")}
            style={[styles.input, errorNameBook && styles.inputError]}
          />
          {errorNameBook && (
            <Text style={styles.errorText}>{errorNameBook}</Text>
          )}

          <TextInput
            value={publishingYear}
            onChangeText={setPublishingYear}
            placeholder={t("createForm.publishingYear")}
            style={styles.input}
          />

          <TextInput
            value={publishingHouse}
            onChangeText={setPublishingHouse}
            placeholder={t("createForm.publishingHouse")}
            style={styles.input}
          />

          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder={t("createForm.description")}
            multiline
            numberOfLines={3}
            style={[styles.input, { height: 80 }]}
          />

          <View style={styles.buttonsRow}>
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveText}>
                {book ? t("createForm.buttons.save") : t("createForm.buttons.create")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>{t("createForm.buttons.cancel")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SaveBookModal;
