// AddedMemberInEmtry.js
import React, { useEffect, useCallback, useState, useMemo } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import styles, { COLORS } from "./AddedMemberInEmtryStyles.js";
import { useTranslation } from "react-i18next";
import { getMemberList, addedMemberInEntry } from "@/api/donationAPI";
import Toast from "react-native-toast-message";

export default function AddedMemberInEmtry({ visible, onClose, entry, onRetry }) {
  const { t } = useTranslation("donateScreen");
  const [members, setMembers] = useState([]);
  const [memberId, setMemberId] = useState(null);
  const [search, setSearch] = useState("");

  const filteredMembers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return members;
    return members.filter(
      (m) =>
        m.firstName.toLowerCase().includes(q) ||
        m.lastName.toLowerCase().includes(q)
    );
  }, [members, search]);

  const loadMembers = useCallback(() => {
    return getMemberList()
      .then((res) => setMembers(res))
      .catch((error) => {
        Toast.show({
          type: "error",
          text1: t("errorTitle"),
          text2: error?.message || t("errorLoad"),
          position: "top",
        });
      });
  }, [t]);

  useEffect(() => {
    if (!visible) return;
    loadMembers();
    setMemberId(null);
  }, [visible, loadMembers]);

  const applyMemberToEntry = useCallback(
    async (selectedMemberId) => {
      try {
        setMemberId(selectedMemberId);

        await addedMemberInEntry({
          entryId: entry.id,
          memberId: selectedMemberId,
        });

        Toast.show({
          type: "success",
          text1: t("successTitle"),
          text2: t("addedMember.success"),
          position: "top",
        });

        onClose();
        onRetry();
      } catch (error) {
        Toast.show({
          type: "error",
          text1: t("errorTitle"),
          text2: error?.message || t("addedMember.errorUpdate"),
          position: "top",
        });
      }
    },
    [entry?.id, t, onClose]
  );

  const handleSelectMember = useCallback(
    (id, fullName) => {
      if (id === null) {
        Alert.alert(
          t("addedMember.confirmTitleClear"),
          t("addedMember.confirmTextClear"),
          [
            { text: t("cancel"), style: "cancel" },
            {
              text: t("ok"),
              onPress: () => applyMemberToEntry(null),
            },
          ]
        );
        return;
      }

      Alert.alert(
        t("addedMember.confirmTitle"),
        t("addedMember.confirmText", { name: fullName }),
        [
          { text: t("cancel"), style: "cancel" },
          {
            text: t("ok"),
            onPress: () => applyMemberToEntry(id),
          },
        ]
      );
    },
    [applyMemberToEntry, t]
  );

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.overlay}>
          <View style={styles.cardWrapper}>
            {/* шапка + крестик */}
            <View style={styles.headerRow}>
              <Text style={styles.modalTitle}>
                {t("addedMember.modalTitle")}
              </Text>
              <TouchableOpacity
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* контент */}
            <ScrollView
              contentContainerStyle={styles.scrollInner}
              keyboardShouldPersistTaps="handled"
            >
              <View style={{ flex: 1 }}>
                <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder={t("searchPlaceholder")}
                  placeholderTextColor={COLORS.muted}
                  style={styles.input}
                />

                <Text style={styles.foundCounter}>
                  {t("foundMembers", { count: filteredMembers.length })}
                </Text>

                <ScrollView style={{ flex: 1, marginTop: 8 }}>
                  {/* список участников */}
                  {filteredMembers.map((m) => {
                    const fullName = `${m.lastName} ${m.firstName}`;
                    return (
                      <Pressable
                        key={`member-${m.id}`}
                        style={[
                          styles.option,
                          memberId === m.id && styles.optionActive,
                        ]}
                        onPress={() => handleSelectMember(m.id, fullName)}
                      >
                        <Text
                          style={
                            memberId === m.id
                              ? styles.optionTextActive
                              : styles.optionText
                          }
                        >
                          {fullName}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
