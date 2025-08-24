import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, TouchableOpacity } from "react-native";
import styles from "./SetPrayerCardStyles.js";
import {
  fetchAllBooks,
  fetchAllBookChapter,
  fetchAllBookChapterVerses,
  getVerseText,
} from "@/api/bibleAPI";
import { setWeeklyPrayer } from "@/api/prayerCardAPI";
import DataLoaderWrapper from "@/components/DataLoaderWrapper";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";

const StepPicker = {
  BOOK: "BOOK",
  CHAPTER: "CHAPTER",
  VERSE: "VERSE",
  PREVIEW: "PREVIEW",
};

export default function SetPrayerCard({ prayerCard, onRetry, onClose }) {
  const [step, setStep] = useState(1);
  const [stepPicker, setStepPicker] = useState(StepPicker.BOOK);
  const [bookList, setBookList] = useState([]);
  const [chapterList, setChapterList] = useState([]);
  const [verseList, setVerseList] = useState([]);

  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [loading, setLoading] = useState(false);

  // Загрузка книг
  useEffect(() => {
    setLoading(true);
    fetchAllBooks()
      .then((res) => setBookList(res))
      .finally(() => setLoading(false));
  }, []);
  // Загрузка глав при выборе книги
  useEffect(() => {
    if (selectedBook) {
      setLoading(true);
      fetchAllBookChapter(selectedBook).then((res) => {
        setChapterList(res);
        setLoading(false);
      });
    }
  }, [selectedBook]);
  // Загрузка стихов при выборе главы
  useEffect(() => {
    if (selectedBook && selectedChapter) {
      setLoading(true);
      fetchAllBookChapterVerses(selectedBook, selectedChapter).then((res) => {
        setVerseList(res);
        setLoading(false);
      });
    }
  }, [selectedBook, selectedChapter]);

  const handleVerseSubmit = () => {
    setLoading(true);
    getVerseText("RST", selectedBook, selectedChapter, selectedVerse)
      .then((res) => {
        console.log(res.verses);
        const verseString = res.verses.join(" ");
        const reference = res.info;
        setForm((prev) => ({
          ...prev,
          bibleVerse: verseString,
          bibleReference: reference,
        }));
        handleNext();
      })
      .finally(() => setLoading(false));
  };

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
  const goBack = () => {
    if (stepPicker === StepPicker.CHAPTER) setStepPicker(StepPicker.BOOK);
    else if (stepPicker === StepPicker.VERSE) setStepPicker(StepPicker.CHAPTER);
    else if (stepPicker === StepPicker.PREVIEW) setStepPicker(StepPicker.VERSE);
  };

  return (
    <View style={styles.verseContainer}>
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
            onChangeText={(text) => setForm({ ...form, blessingMessage: text })}
            multiline
            style={[styles.input, styles.textArea]}
          />
        ) : (
          <Text style={styles.blessing}>{form.blessingMessage}</Text>
        )}

        {/* verse + reference */}
        {step === 5 ? (
          <>
            <DataLoaderWrapper loading={loading} data={bookList}>
              {stepPicker === StepPicker.BOOK && (
                <>
                  <Picker
                    selectedValue={selectedBook}
                    onValueChange={(value) => {
                      setSelectedBook(value);
                      setStepPicker(StepPicker.CHAPTER);
                    }}
                    style={styles.picker}
                  >
                    <Picker.Item label="Выберите книгу..." value={null} />
                    {bookList.map((book) => (
                      <Picker.Item
                        key={book.number}
                        label={`${book.russianName} (${book.englishName})`}
                        value={book.number}
                      />
                    ))}
                  </Picker>
                </>
              )}

              {stepPicker === StepPicker.CHAPTER && (
                <>
                  <Text style={styles.titlePicker}>
                    Книга:{" "}
                    {
                      bookList.find((b) => b.number === selectedBook)
                        ?.russianName
                    }
                  </Text>
                  <Picker
                    selectedValue={selectedChapter}
                    onValueChange={(value) => {
                      setSelectedChapter(value);
                      setStepPicker(StepPicker.VERSE);
                    }}
                    style={styles.picker}
                  >
                    <Picker.Item label="Выберите главу..." value={null} />
                    {chapterList.map((ch) => (
                      <Picker.Item key={ch} label={`Глава ${ch}`} value={ch} />
                    ))}
                  </Picker>
                  <Button title="Выбрать другую книгу" onPress={goBack} />
                </>
              )}

              {stepPicker === StepPicker.VERSE && (
                <>
                  <Text style={styles.titlePicker}>
                    {
                      bookList.find((b) => b.number === selectedBook)
                        ?.russianName
                    }{" "}
                    {selectedChapter}
                    {selectedVerse ? `:${selectedVerse}` : ""}
                  </Text>

                  <Picker
                    selectedValue={selectedVerse}
                    onValueChange={(value) => setSelectedVerse(value)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Выберите стих..." value={null} />
                    {verseList.map((v) => (
                      <Picker.Item key={v} label={`Стих ${v}`} value={v} />
                    ))}
                  </Picker>
                  {selectedVerse && (
                    <Button title="Выбрать стих" onPress={handleVerseSubmit} />
                  )}
                  <Button title="Выбрать другую главу" onPress={goBack} />
                </>
              )}
            </DataLoaderWrapper>
          </>
        ) : (
          <>
            <Text style={styles.quote}>{form.bibleVerse}</Text>
            <Text style={styles.source}>{form.bibleReference}</Text>
          </>
        )}
      </View>

      {/* кнопки */}
      <View style={styles.buttonRow}>
        {step > 1 && <Button title="Назад" onPress={handleBack} />}
        {step < 6 && <Button title="Далее" onPress={handleNext} />}
        {step === 6 && <Button title="Сохранить" onPress={handleSave} />}
      </View>
    </View>
  );
}
