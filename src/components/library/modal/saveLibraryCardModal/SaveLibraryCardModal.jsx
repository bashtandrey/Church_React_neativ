import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import styles from "./SaveLibraryCardModalStyles";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import { saveLibraryCard, geAllMemberWithoutLibraryCard } from "@/api/libraryAPI";
import DataLoaderWrapper from "@/components/DataLoaderWrapper";
import Ionicons from "react-native-vector-icons/Ionicons";

const SaveLibraryCardModal = ({ visible, onClose, card, reLoad }) => {
  const { t } = useTranslation("libraryCardScreen");

  const [id, setId] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [memberId, setMemberId] = useState(null);

  const [step, setStep] = useState("chooseMode"); // chooseMode | selectMember | form
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  // при открытии
  useEffect(() => {
    if (card) {
      setId(card.id);
      setFirstName(card.firstName || "");
      setLastName(card.lastName || "");
      setMemberId(card.member?.id || null);
      setStep("form");
    } else {
      resetForm();
    }
  }, [card, visible]);

  const resetForm = () => {
    setId(null);
    setFirstName("");
    setLastName("");
    setMemberId(null);
    setStep("chooseMode");
  };

  const loadMembers = async () => {
    try {
      setLoading(true);
      const list = await geAllMemberWithoutLibraryCard();
      setMembers(list || []);
    } catch (e) {
      console.error(e);
      Toast.show({
        type: "error",
        text1: t("createForm.toasts.errorTitle"),
        text2: "Не удалось загрузить участников",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChooseMode = (withMember) => {
    if (withMember) {
      setStep("selectMember");
      loadMembers();
    } else {
      setStep("form");
      setMemberId(null);
    }
  };

  const handleSelectMember = (m) => {
    setMemberId(m.id);
    setFirstName(m.firstName);
    setLastName(m.lastName);
    setStep("form");
  };
  const handleSave = async () => {
    const res = await saveLibraryCard({
      id,
      firstName,
      lastName,
      memberId,
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
      Toast.show({
        type: "error",
        text1: t("createForm.toasts.errorTitle"),
        text2: res.error || t("createForm.toasts.unknownError"),
        position: "top",
      });
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#E63946" />
          </TouchableOpacity>
          <Text style={styles.title}>
            {card ? t("createForm.editTitle") : t("createForm.createTitle")}
          </Text>

          {/* --- Этап 1: выбор сценария --- */}
          {step === "chooseMode" && (
            <View>
              <Text style={styles.subtitle}>
                {t("createForm.chooseModeQuestion")}
              </Text>

              <TouchableOpacity
                style={styles.choiceButton}
                onPress={() => handleChooseMode(true)}
              >
                <Text style={styles.choiceText}>
                  {t("createForm.withMember")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.choiceButtonAlt}
                onPress={() => handleChooseMode(false)}
              >
                <Text style={styles.choiceTextAlt}>
                  {t("createForm.withoutMember")}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* --- Этап 2: выбор участника --- */}
          {step === "selectMember" && (
            <>
              {members.length > 0 ? (
                <DataLoaderWrapper loading={loading} data={members}>
                  <ScrollView style={{ maxHeight: 300 }}>
                    {members.map((m) => (
                      <TouchableOpacity
                        key={m.id}
                        style={styles.memberItem}
                        onPress={() => handleSelectMember(m)}
                      >
                        <View style={styles.memberRow}>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.memberText}>
                              {m.firstName} {m.lastName}
                            </Text>
                          </View>
                          <Ionicons
                            name="chevron-forward-outline"
                            size={22}
                            color="#118AB2"
                          />
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </DataLoaderWrapper>
              ) : (
                <View style={styles.emptyContainer}>
                  <Ionicons
                    name="alert-circle-outline"
                    size={40}
                    color="#888"
                    style={{ marginBottom: 10 }}
                  />
                  <Text style={styles.emptyText}>
                    {t("createForm.noFreeMembers")}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={[styles.choiceButtonAlt, { marginTop: 20 }]}
                onPress={() => setStep("chooseMode")}
              >
                <Text style={styles.choiceTextAlt}>
                  {t("createForm.backToMode")}
                </Text>
              </TouchableOpacity>
            </>
          )}

          {/* --- Этап 3: форма --- */}
          {step === "form" && (
            <>
              {memberId && (
                <Text style={styles.memberInfo}>ID участника: {memberId}</Text>
              )}

              <TextInput
                value={firstName}
                onChangeText={setFirstName}
                placeholder={t("createForm.firstName")}
                style={styles.input}
                editable={!memberId}
              />
              <TextInput
                value={lastName}
                onChangeText={setLastName}
                placeholder={t("createForm.lastName")}
                style={styles.input}
                editable={!memberId}
              />

              <View style={styles.buttonsRow}>
                <TouchableOpacity
                  onPress={handleSave}
                  style={styles.saveButton}
                >
                  <Text style={styles.saveText}>
                    {card
                      ? t("createForm.buttons.save")
                      : t("createForm.buttons.create")}
                  </Text>
                </TouchableOpacity>

                {!card && (
                  <TouchableOpacity
                    onPress={() => {
                      setStep("chooseMode");
                      resetForm();
                    }}
                    style={styles.cancelButton}
                  >
                    <Text style={styles.cancelText}>
                      {t("createForm.buttons.back")}
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                  <Text style={styles.cancelText}>
                    {t("createForm.buttons.cancel")}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default SaveLibraryCardModal;
