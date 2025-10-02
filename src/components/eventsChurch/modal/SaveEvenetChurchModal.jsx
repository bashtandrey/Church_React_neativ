import React, { useEffect, useMemo, useState } from "react";
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
import { useTranslation } from "react-i18next";
import { Calendar, LocaleConfig } from "react-native-calendars";

const COLORS = {
  cardBg: "#FFFFFF",
  line: "#D6E9FF",
  title: "#1C3D6E",
  text: "#2E4A6B",
  muted: "#5E7BA6",
  primary: "#3B82F6",
  danger: "#b91c1c",
};

export default function SaveEventChurchModal({
  visible,
  onClose,
  onSubmit,
  event, // { id?, title?, description?, startEventDate?: "MM/dd/yyyy", endEventDate?: "MM/dd/yyyy" }
}) {
  const { t, i18n } = useTranslation("eventsChurch");

  // шаги: 0-title, 1-description, 2-start, 3-end
  const [step, setStep] = useState(0);

  const [eventId, setEventId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [startDate, setStartDate] = useState(null); // Date | null
  const [endDate, setEndDate] = useState(null);     // Date | null

  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  // локализация календаря из i18n
  useEffect(() => {
    const cal = t("calendar", { returnObjects: true });
    const loc = i18n.language.startsWith("ru") ? "ru" : "en";
    LocaleConfig.locales[loc] = cal;
    LocaleConfig.defaultLocale = loc;
  }, [i18n.language, t]);

  // hелперы
  const parseMMDDYYYY = (str) => {
    // "MM/dd/yyyy" -> Date | null
    if (!str) return null;
    const [m, d, y] = str.split("/");
    if (!m || !d || !y) return null;
    const dt = new Date(Number(y), Number(m) - 1, Number(d));
    return isNaN(dt.getTime()) ? null : dt;
  };
  const fmtMMDDYYYY = (dt) =>
    dt ? `${String(dt.getMonth() + 1).padStart(2, "0")}/${String(dt.getDate()).padStart(2, "0")}/${dt.getFullYear()}` : null;

  // инициализация при открытии
  useEffect(() => {
    if (!visible) return;
    setStep(0);
    setErr("");
    setSubmitting(false);

    setEventId(event?.id ?? null);
    setTitle(event?.title ?? "");
    setDescription(event?.description ?? "");

    setStartDate(parseMMDDYYYY(event?.startEventDate));
    setEndDate(parseMMDDYYYY(event?.endEventDate));
  }, [visible]);

  const canGoNext = useMemo(() => {
    if (step === 0) return title.trim().length > 0;  // заголовок обязателен
    if (step === 2) return !!startDate;              // дата начала обязательна
    return true;                                     // остальные шаги можно пролистнуть
  }, [step, title, startDate]);

  const next = () => {
    if (!canGoNext) return;
    if (step === 3) return; // финальный шаг — дальше не идём
    setStep((s) => s + 1);
    setErr("");
  };
  const back = () => {
    if (step === 0) return;
    setStep((s) => s - 1);
    setErr("");
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;
    if (!startDate) {
      setErr(t("form.startRequired", "Start date is required"));
      setStep(2);
      return;
    }
    if (endDate && startDate && endDate < startDate) {
      setErr(t("form.rangeInvalid", "End date must be after start date"));
      setStep(3);
      return;
    }

    setSubmitting(true);
    setErr("");
    try {
      const payload = {
        ...(eventId != null ? { id: eventId } : {}),
        title: title.trim(),
        description: description.trim() || null,
        startEventDate: fmtMMDDYYYY(startDate), // MM/dd/yyyy
        endEventDate: fmtMMDDYYYY(endDate),     // MM/dd/yyyy or null
      };
      await onSubmit?.({ data: payload });
      onClose?.();
    } catch (e) {
      setErr(e?.message || t("form.errorSave"));
    } finally {
      setSubmitting(false);
    }
  };

  // календарь на шаге: отдаём selected/marked
  const calendarMarkedStart = useMemo(() => {
    if (!startDate) return {};
    const key = startDate.toISOString().slice(0, 10);
    return {
      [key]: {
        selected: true,
        selectedColor: COLORS.primary,
      },
    };
  }, [startDate]);

  const calendarMarkedEnd = useMemo(() => {
    if (!endDate) return {};
    const key = endDate.toISOString().slice(0, 10);
    return {
      [key]: {
        selected: true,
        selectedColor: COLORS.primary,
      },
    };
  }, [endDate]);

  // заголовки шагов
  const stepTitle = [
    t("form.titleLabel"),
    t("form.descriptionLabel"),
    t("form.startDateLabel"),
    t("form.endDateLabel"),
  ][step];

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.centerWrap}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.centerCard}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {event ? t("form.editTitle") : t("form.createTitle")}
            </Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={22} color={COLORS.muted} />
            </Pressable>
          </View>

          {/* Stepper */}
          <View style={styles.stepper}>
            {[0, 1, 2, 3].map((i) => (
              <View key={i} style={styles.stepDotWrap}>
                <View
                  style={[
                    styles.stepDot,
                    i === step && styles.stepDotActive,
                    i < step && styles.stepDotDone,
                  ]}
                />
                {i < 3 && <View style={styles.stepLine} />}
              </View>
            ))}
          </View>

          {/* Body */}
          <View style={styles.body}>
            <Text style={styles.stepTitle}>{stepTitle}</Text>

            {step === 0 && (
              <>
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder={t("form.titlePlaceholder")}
                  placeholderTextColor={COLORS.muted}
                  style={styles.input}
                />
                {!title.trim() && (
                  <Text style={styles.hint}>
                    {t("form.titleHint", "Required field")}
                  </Text>
                )}
              </>
            )}

            {step === 1 && (
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder={t("form.descriptionPlaceholder")}
                placeholderTextColor={COLORS.muted}
                style={[styles.input, styles.inputMultiline]}
                multiline
              />
            )}

            {step === 2 && (
              <View style={styles.calendarWrap}>
                <Calendar
                  onDayPress={(day) => {
                    // day.dateString -> "yyyy-MM-dd"
                    const [y, m, d] = day.dateString.split("-");
                    setStartDate(new Date(Number(y), Number(m) - 1, Number(d)));
                    // авто-сброс конца, если он раньше старта
                    if (endDate && new Date(Number(y), Number(m) - 1, Number(d)) > endDate) {
                      setEndDate(null);
                    }
                  }}
                  markedDates={calendarMarkedStart}
                  theme={{
                    todayTextColor: COLORS.primary,
                    selectedDayBackgroundColor: COLORS.primary,
                  }}
                />
                {!startDate && (
                  <Text style={styles.hint}>
                    {t("form.startPickHint", "Pick a start date")}
                  </Text>
                )}
              </View>
            )}

            {step === 3 && (
              <View style={styles.calendarWrap}>
                <Calendar
                  minDate={
                    startDate
                      ? startDate.toISOString().slice(0, 10)
                      : undefined
                  }
                  onDayPress={(day) => {
                    const [y, m, d] = day.dateString.split("-");
                    setEndDate(new Date(Number(y), Number(m) - 1, Number(d)));
                  }}
                  markedDates={calendarMarkedEnd}
                  theme={{
                    todayTextColor: COLORS.primary,
                    selectedDayBackgroundColor: COLORS.primary,
                  }}
                />
                <Text style={styles.hint}>
                  {t(
                    "form.endPickHint",
                    "Optional. If empty, event is a single day."
                  )}
                </Text>
              </View>
            )}

            {err ? <Text style={styles.error}>{err}</Text> : null}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Pressable
              onPress={back}
              disabled={step === 0}
              style={[styles.secondaryBtn, step === 0 && styles.disabled]}
            >
              <Text style={styles.secondaryText}>{t("form.back", "Back")}</Text>
            </Pressable>

            {step < 3 ? (
              <Pressable
                onPress={next}
                disabled={!canGoNext}
                style={[styles.primaryBtn, !canGoNext && styles.disabled]}
              >
                <Text style={styles.primaryText}>{t("form.next", "Next")}</Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={handleSubmit}
                disabled={submitting || !title.trim() || !startDate}
                style={[
                  styles.primaryBtn,
                  (submitting || !title.trim() || !startDate) && styles.disabled,
                ]}
              >
                <Text style={styles.primaryText}>
                  {submitting
                    ? t("form.saving")
                    : event
                    ? t("form.edit")
                    : t("form.create")}
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centerWrap: { flex: 1, justifyContent: "center", alignItems: "center" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.3)" },
  centerCard: {
    width: "92%",
    maxWidth: 480,
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

  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { color: COLORS.title, fontWeight: "800", fontSize: 18 },

  stepper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 4,
  },
  stepDotWrap: { flexDirection: "row", alignItems: "center" },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 6,
    backgroundColor: "#cbd5e1",
  },
  stepDotActive: { backgroundColor: COLORS.primary },
  stepDotDone: { backgroundColor: "#60a5fa" },
  stepLine: {
    width: 22,
    height: 2,
    backgroundColor: "#cbd5e1",
    marginHorizontal: 6,
  },

  body: { marginTop: 8, gap: 10 },
  stepTitle: { color: COLORS.text, fontWeight: "800" },

  input: {
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: COLORS.text,
  },
  inputMultiline: { minHeight: 80, textAlignVertical: "top" },

  calendarWrap: {
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 10,
    overflow: "hidden",
  },

  hint: { color: COLORS.muted, fontSize: 12 },
  error: { color: COLORS.danger, fontWeight: "700", fontSize: 12 },

  footer: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  secondaryBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  secondaryText: { color: COLORS.text, fontWeight: "700" },

  primaryBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
  },
  primaryText: { color: "#fff", fontWeight: "800" },

  disabled: { opacity: 0.5 },
});