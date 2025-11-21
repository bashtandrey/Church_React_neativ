import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Button,
  Modal,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import styles from "./SetPrayerCardStyles.js";
import Toast from "react-native-toast-message";
import { setWeeklyPrayer } from "@/api/prayerCardAPI";
import VersePicker from "@/components/bible/versePicker/VersePicker";
import { useTranslation } from "react-i18next";

export default function SetPrayerCard({
  prayerCard,
  onRetry,
  visible,
  onClose,
}) {
  const [step, setStep] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [form, setForm] = useState({
    greeting: prayerCard?.greeting || "",
    header: prayerCard?.header || "",
    familyList: prayerCard?.familyList || [],
    blessingMessage: prayerCard?.blessingMessage || "",
    bibleVerse: prayerCard?.bibleVerse || "",
    bibleReference: prayerCard?.bibleReference || "",
  });

  const { t } = useTranslation("prayerCard");

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleSave = async () => {
    try {
      await setWeeklyPrayer(form);
      onRetry();
      onClose();
      Toast.show({
        type: "success",
        text1: t("successTitle"),
        text2: t("successMessage"),
        position: "top",
      });
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: t("errorTitle"),
        text2: t("errorMessage"),
        position: "top",
      });
    }
  };

  const handleVerseAdded = (selectedData) => {
    if (!selectedData) return;
    setForm((prev) => ({
      ...prev,
      bibleVerse: selectedData.text,
      bibleReference: selectedData.info,
    }));
    setRefreshKey((k) => k + 1);
    // после выбора стиха сразу переходим на шаг 6 (превью/сохранение)
    handleNext();
  };

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
              <Text style={styles.modalTitle}>{t("modalTitle")}</Text>
              <TouchableOpacity
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* прогресс */}
            <View style={styles.progressBarWrap}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${(step / 6) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {t("stepProgress", { step, total: 6 })}
            </Text>

            {/* контент */}
            <ScrollView
              contentContainerStyle={styles.scrollInner}
              keyboardShouldPersistTaps="handled"
            >
              {/* greeting */}
              {step === 1 ? (
                <TextInput
                  value={form.greeting}
                  placeholder={t("greetingPlaceholder")}
                  onChangeText={(text) => setForm({ ...form, greeting: text })}
                  multiline
                  style={[styles.input, styles.textArea]}
                />
              ) : (
                <Text style={styles.greeting}>{form.greeting}</Text>
              )}

              {/* header */}
              {step === 2 ? (
                <TextInput
                  value={form.header}
                  placeholder={t("headerPlaceholder")}
                  onChangeText={(text) => setForm({ ...form, header: text })}
                  multiline
                  style={[styles.input, styles.textArea]}
                />
              ) : (
                <Text style={styles.text}>{form.header}</Text>
              )}

              {/* families */}
              {step === 3 ? (
                <View>
                  {form.familyList.map((name, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 6,
                      }}
                    >
                      <TextInput
                        value={name}
                        placeholder={t("familyPlaceholder", {
                          index: index + 1,
                        })}
                        onChangeText={(text) => {
                          const updated = [...form.familyList];
                          updated[index] = text;
                          setForm({ ...form, familyList: updated });
                        }}
                        multiline
                        style={[styles.input, styles.textArea, { flex: 1 }]}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          const updated = form.familyList.filter(
                            (_, i) => i !== index
                          );
                          setForm({ ...form, familyList: updated });
                        }}
                        style={{ marginLeft: 8 }}
                      >
                        <Text style={{ color: "red", fontSize: 18 }}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  ))}

                  <TouchableOpacity
                    onPress={() =>
                      setForm({
                        ...form,
                        familyList: [...form.familyList, ""],
                      })
                    }
                    style={styles.addFamilyBtn}
                  >
                    <Text style={styles.addFamilyText}>
                      {t("addFamilyButton")}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  {form.familyList.map((name, index) => (
                    <Text key={index} style={styles.family}>
                      {"\u2022"} {name}
                    </Text>
                  ))}
                </View>
              )}

              {/* blessing */}
              {step === 4 ? (
                <TextInput
                  value={form.blessingMessage}
                  placeholder={t("blessingPlaceholder")}
                  onChangeText={(text) =>
                    setForm({ ...form, blessingMessage: text })
                  }
                  multiline
                  style={[styles.input, styles.textArea]}
                />
              ) : (
                <Text style={styles.blessing}>{form.blessingMessage}</Text>
              )}

              {/* verse + reference */}
              {step === 5 ? (
                <>
                  <VersePicker
                    lang={t("versePickerLang")}
                    onClose={() => {}}
                    onAdded={handleVerseAdded}
                    refreshKey={refreshKey}
                  />

                  {form.bibleVerse && (
                    <>
                      <Text style={styles.quote}>{form.bibleVerse}</Text>
                      <Text style={styles.source}>{form.bibleReference}</Text>
                    </>
                  )}
                </>
              ) : (
                <View style={{ marginTop: 10 }}>
                  {Array.isArray(form.bibleVerse) ? (
                    form.bibleVerse.map((line, idx) => (
                      <Text key={idx} style={styles.quoteLine}>
                        {line}
                      </Text>
                    ))
                  ) : (
                    <Text style={styles.quote}>{form.bibleVerse}</Text>
                  )}
                  <Text style={styles.source}>{form.bibleReference}</Text>
                </View>
              )}
            </ScrollView>

            {/* КНОПКИ ВСЕГДА ВНИЗУ КАРТОЧКИ */}
            <View style={styles.buttonRow}>
              <Button
                title={t("backButton")}
                disabled={step === 1}
                onPress={handleBack}
              />

              {step === 6 ? (
                <Button title={t("saveButton")} onPress={handleSave} />
              ) : step === 5 ? null : (
                <Button title={t("nextButton")} onPress={handleNext} />
              )}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}