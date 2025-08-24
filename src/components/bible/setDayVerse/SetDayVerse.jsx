import React, { useState, useEffect } from "react";
import { View, Text, Button, ScrollView} from "react-native";
import { Picker } from "@react-native-picker/picker";
import styles from "./SetDayVerseStyles";
import {
  fetchAllBooks,
  fetchAllBookChapter,
  fetchAllBookChapterVerses,
  getVerseText,
  setDailyVerse,
} from "@/api/bibleAPI";
import DataLoaderWrapper from "@/components/DataLoaderWrapper";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n/";

const Step = {
  BOOK: "BOOK",
  CHAPTER: "CHAPTER",
  VERSE: "VERSE",
  PREVIEW: "PREVIEW",
};

const SetVerseBible = ({ onClose, reLoad }) => {
  const [step, setStep] = useState(Step.BOOK);
  const [bookList, setBookList] = useState([]);
  const [chapterList, setChapterList] = useState([]);
  const [verseList, setVerseList] = useState([]);

  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [verseText, setVerseText] = useState(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation(["setDayVerse", "common", "biblePicker"]);

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

  const goBack = () => {
    if (step === Step.CHAPTER) setStep(Step.BOOK);
    else if (step === Step.VERSE) setStep(Step.CHAPTER);
    else if (step === Step.PREVIEW) setStep(Step.VERSE);
  };

  const handleVerseSubmit = () => {
    setLoading(true);
    getVerseText(
      t("bibleLanguage", { ns: "biblePicker" }),
      selectedBook,
      selectedChapter,
      selectedVerse
    )
      .then((res) => {
        console.log(res);
        setVerseText(res.verses);
        setStep(Step.PREVIEW);
      })
      .finally(() => setLoading(false));
  };

  const handleSave = () => {
    setLoading(true);
    setDailyVerse(
      selectedBook,
      selectedChapter,
      selectedVerse
    ).finally(() => {
      reLoad();
      onClose();
    });
  };

  return (
    <View style={styles.modalContent}>
      <DataLoaderWrapper loading={loading} data={bookList}>
        <ScrollView>
          {step === Step.BOOK && (
            <>
              <Text style={styles.title}>{t("selectBbook")}</Text>
              <Picker
                selectedValue={selectedBook}
                onValueChange={(value) => {
                  setSelectedBook(value);
                  setStep(Step.CHAPTER);
                }}
                style={styles.picker}
              >
                <Picker.Item label={t("selectBbook") + " ..."} value={null} />
                {bookList.map((book) => (
                  <Picker.Item
                    key={book.number}
                    label={book?.[t("langBook", { ns: "biblePicker" })]}
                    value={book.number}
                  />
                ))}
              </Picker>
            </>
          )}

          {step === Step.CHAPTER && (
            <>
              <Text style={styles.title}>
                {
                  bookList.find((b) => b.number === selectedBook)?.[
                    t("langBook", { ns: "biblePicker" })
                  ]
                }
              </Text>
              <Picker
                selectedValue={selectedChapter}
                onValueChange={(value) => {
                  setSelectedChapter(value);
                  setStep(Step.VERSE);
                }}
                style={styles.picker}
              >
                <Picker.Item
                  label={t("selectedChapter", { ns: "biblePicker" })}
                  value={null}
                />
                {chapterList.map((ch) => (
                  <Picker.Item
                    key={ch}
                    label={t("langChapter", { ns: "biblePicker" }) + ch}
                    value={ch}
                  />
                ))}
              </Picker>
              <Button
                title={t("buttonBack", { ns: "common" })}
                onPress={goBack}
              />
            </>
          )}

          {step === Step.VERSE && (
            <>
              <Text style={styles.title}>
                {
                  bookList.find((b) => b.number === selectedBook)?.[
                    t("langBook", { ns: "biblePicker" })
                  ]
                }{" "}
                {selectedChapter}
              </Text>
              <Picker
                selectedValue={selectedVerse}
                onValueChange={(value) => setSelectedVerse(value)}
                style={styles.picker}
              >
                <Picker.Item
                  label={t("selectedVerse", { ns: "biblePicker" })}
                  value={null}
                />
                {verseList.map((v) => (
                  <Picker.Item
                    key={v}
                    label={t("langVerse", { ns: "biblePicker" }) + v}
                    value={v}
                  />
                ))}
              </Picker>
              <Button
                title={t("buttonShowVerse", { ns: "biblePicker" })}
                onPress={handleVerseSubmit}
              />
              <Button
                title={t("buttonBack", { ns: "biblePicker" })}
                onPress={goBack}
              />
            </>
          )}

          {step === Step.PREVIEW && verseText && (
            <>
              <Text style={styles.title}>
                {
                  bookList.find((b) => b.number === selectedBook)?.[
                    t("langBook", { ns: "biblePicker" })
                  ]
                }{" "}
                {selectedChapter}:{selectedVerse}
              </Text>
              <Text style={styles.verseText}>{verseText}</Text>
              <Button
                title={t("buttonSave", { ns: "biblePicker" })}
                onPress={handleSave}
              />
              <Button
                title={t("buttonBack", { ns: "biblePicker" })}
                onPress={goBack}
              />
            </>
          )}
        </ScrollView>
      </DataLoaderWrapper>
    </View>
  );
};

export default SetVerseBible;
