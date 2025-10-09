import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import styles from "./SetPrayerCardStyles.js";
import Toast from "react-native-toast-message";
import { setWeeklyPrayer } from "@/api/prayerCardAPI";
import VersePicker from "@/components/bible/versePicker/VersePicker"; // универсальный компонент

export default function SetPrayerCard({ prayerCard, onRetry, onClose }) {
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

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleSave = async () => {
    try {
      await setWeeklyPrayer(form);
      onRetry();
      onClose();
      Toast.show({
        type: "success",
        text1: "Успех!",
        text2: "Молитвенная карточка сохранена",
        position: "top",
      });
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Ошибка!",
        text2: "Не удалось сохранить карточку",
        position: "top",
      });
    }
  };

  const handleVerseAdded = (selectedData) => {
    if (!selectedData) return;
    setForm((prev) => ({
      ...prev,
      bibleVerse: selectedData.text,
      bibleReference: selectedData.info
    }));
    setRefreshKey((k) => k + 1);
    handleNext();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.verseContainer}>
        {/* 🔹 Прогресс по шагам */}
        <View style={styles.progressBarWrap}>
          <View
            style={[styles.progressBarFill, { width: `${(step / 6) * 100}%` }]}
          />
        </View>
        <Text style={styles.progressText}>Шаг {step} из 6</Text>

        {/* 🔹 Основная карточка */}
        <View style={styles.card}>
          {/* greeting */}
          {step === 1 ? (
            <TextInput
              value={form.greeting}
              placeholder="Приветствие"
              onChangeText={(text) => setForm({ ...form, greeting: text })}
              style={styles.input}
            />
          ) : (
            <Text style={styles.greeting}>{form.greeting}</Text>
          )}

          {/* header */}
          {step === 2 ? (
            <TextInput
              value={form.header}
              placeholder="Заголовок"
              onChangeText={(text) => setForm({ ...form, header: text })}
              style={styles.input}
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
                    placeholder={`Семья ${index + 1}`}
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
                  setForm({ ...form, familyList: [...form.familyList, ""] })
                }
                style={{
                  marginTop: 10,
                  padding: 8,
                  backgroundColor: "#eee",
                  borderRadius: 6,
                }}
              >
                <Text style={{ textAlign: "center" }}>+ Добавить семью</Text>
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
              placeholder="Благословение"
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
              {/* 🔹 VersePicker — сразу отображается */}
              <VersePicker
                lang = {"RST"}
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
        </View>

        {/* 🔹 Кнопки */}
        <View style={styles.buttonRow}>
          {step > 1 && <Button title="Назад" onPress={handleBack} />}
          {step < 6 && <Button title="Далее" onPress={handleNext} />}
          {step === 6 && <Button title="Сохранить" onPress={handleSave} />}
        </View>
      </View>
    </ScrollView>
  );
}
