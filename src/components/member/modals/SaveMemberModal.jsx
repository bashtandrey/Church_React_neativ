import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  cardBg: "#FFFFFF",
  line: "#D6E9FF",
  title: "#1C3D6E",
  text: "#2E4A6B",
  muted: "#5E7BA6",
  primary: "#3B82F6",
};

export default function SaveMemberModal({
  visible,
  onClose,
  onSubmit,
  member,
}) {
  const [memberId, setMemberId] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // три отдельных поля даты
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  const GENDERS = [
    { key: "MALE", label: "Мужской", icon: "man" },
    { key: "FEMALE", label: "Женский", icon: "woman" },
  ];

  useEffect(() => {
    if (visible) {
      setMemberId(member?.id || null);
      setFirstName(member?.firstName || "");
      setLastName(member?.lastName || "");

      if (member?.birthday) {
        // ожидаем формат YYYY-MM-DD или MM/dd/yyyy
        const parts = member.birthday.includes("-")
          ? member.birthday.split("-") // YYYY-MM-DD
          : member.birthday.split("/"); // MM/dd/yyyy
        if (parts.length === 3) {
          if (member.birthday.includes("-")) {
            setYear(parts[0]);
            setMonth(parts[1]);
            setDay(parts[2]);
          } else {
            setMonth(parts[0]);
            setDay(parts[1]);
            setYear(parts[2]);
          }
        }
      } else {
        setDay("");
        setMonth("");
        setYear("");
      }

      setGender(member?.gender || "");
      setPhone(member?.phone || "");
      setErr("");
      setSubmitting(false);
    }
  }, [visible]);

  const isDateValid =
    (!day && !month && !year) ||
    (/^\d{1,2}$/.test(day) &&
      /^\d{1,2}$/.test(month) &&
      /^\d{4}$/.test(year) &&
      Number(day) >= 1 &&
      Number(day) <= 31 &&
      Number(month) >= 1 &&
      Number(month) <= 12);

  const canSubmit =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    isDateValid &&
    !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setErr("");

    try {
      const birthday =
        day && month && year
          ? `${month.padStart(2, "0")}/${day.padStart(2, "0")}/${year}`
          : null;

      const payload = {
        ...(memberId != null ? { id: memberId } : {}),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        birthday,
        gender: gender.trim() || null,
        phone: phone.trim() || null,
      };

      await onSubmit?.({ data: payload });
      onClose?.();
    } catch (e) {
      setErr(e?.message || "Ошибка создания члена");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.centerWrap}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.centerCard}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {member ? "Редактировать члена" : "Создать члена"}
            </Text>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => pressed && { opacity: 0.6 }}
            >
              <Ionicons name="close" size={22} color={COLORS.muted} />
            </Pressable>
          </View>

          <View style={styles.body}>
            <Text style={styles.label}>Фамилия</Text>
            <TextInput
              value={lastName}
              onChangeText={setLastName}
              placeholder="Введите фамилию"
              placeholderTextColor={COLORS.muted}
              style={styles.input}
            />

            <Text style={styles.label}>Имя</Text>
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Введите имя"
              placeholderTextColor={COLORS.muted}
              style={styles.input}
            />

            <Text style={styles.label}>Дата рождения</Text>
            <View style={styles.dateRow}>
              <TextInput
                value={month}
                onChangeText={setMonth}
                placeholder="MM"
                placeholderTextColor={COLORS.muted}
                keyboardType="numeric"
                maxLength={2}
                style={[styles.input, styles.dateInput]}
              />
              <TextInput
                value={day}
                onChangeText={setDay}
                placeholder="DD"
                placeholderTextColor={COLORS.muted}
                keyboardType="numeric"
                maxLength={2}
                style={[styles.input, styles.dateInput]}
              />
              <TextInput
                value={year}
                onChangeText={setYear}
                placeholder="YYYY"
                placeholderTextColor={COLORS.muted}
                keyboardType="numeric"
                maxLength={4}
                style={[styles.input, styles.dateInput]}
              />
            </View>
            {!isDateValid && (
              <Text style={styles.error}>
                Введите корректную дату (MM/DD/YYYY)
              </Text>
            )}

            <Text style={styles.label}>Пол</Text>
            <View style={styles.genderRow}>
              {GENDERS.map((g) => {
                const active = gender === g.key;
                return (
                  <Pressable
                    key={g.key}
                    onPress={() => setGender(g.key)}
                    style={[
                      styles.genderChip,
                      active && styles.genderChipActive,
                    ]}
                  >
                    <Ionicons
                      name={g.icon}
                      size={16}
                      color={active ? COLORS.primary : COLORS.muted}
                    />
                    <Text
                      style={[
                        styles.genderText,
                        active && styles.genderTextActive,
                      ]}
                    >
                      {g.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.label}>Телефон</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Введите номер телефона"
              placeholderTextColor={COLORS.muted}
              style={styles.input}
              keyboardType="phone-pad"
            />

            {err ? <Text style={styles.error}>{err}</Text> : null}
          </View>

          <View style={styles.footer}>
            <Pressable onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Отмена</Text>
            </Pressable>
            <Pressable
              onPress={handleSubmit}
              disabled={!canSubmit}
              style={[styles.submitBtn, !canSubmit && styles.submitDisabled]}
            >
              <Text style={styles.submitText}>
                {submitting
                  ? "Сохранение…"
                  : member
                  ? "Редактировать"
                  : "Создать"}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centerWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  centerCard: {
    width: "90%",
    maxWidth: 420,
    borderRadius: 16,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 14,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 8 },
    }),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { color: COLORS.title, fontWeight: "800", fontSize: 18 },

  body: { marginTop: 10, gap: 8 },
  label: { color: COLORS.text, fontWeight: "700" },
  input: {
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: COLORS.text,
  },
  error: { color: "#b91c1c", fontWeight: "700", fontSize: 12 },

  dateRow: {
    flexDirection: "row",
    gap: 8,
  },
  dateInput: {
    flex: 1,
    textAlign: "center",
  },

  genderRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  genderChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.cardBg,
  },
  genderChipActive: {
    backgroundColor: "#E8F0FE",
    borderColor: "#C7DBFF",
  },
  genderText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.muted,
  },
  genderTextActive: {
    color: COLORS.primary,
  },

  footer: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  cancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  cancelText: { color: COLORS.text, fontWeight: "700" },
  submitBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
  },
  submitDisabled: { opacity: 0.5 },
  submitText: { color: "#fff", fontWeight: "800" },
});
