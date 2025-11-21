import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  fetchAllBooks,
  fetchAllBookChapter,
  fetchAllBookChapterVerses,
  getVerseText,
} from "@/api/bibleAPI";
import DataLoaderWrapper from "@/components/DataLoaderWrapper";
import styles from "./VersePickerStyles";
import { useTranslation } from "react-i18next";

const Step = {
  BOOK: "BOOK",
  CHAPTER: "CHAPTER",
  VERSE: "VERSE",
  PREVIEW: "PREVIEW",
};

const getBookLabel = (b, lang) => {
  switch (lang) {
    case "ru":
      return b.russianName;
    case "ua":
    case "uk":
      return b.ukrainianName;
    case "en":
    default:
      return b.englishName;
  }
};

const steps = [
  { key: Step.BOOK, label: "Книга" },
  { key: Step.CHAPTER, label: "Глава" },
  { key: Step.VERSE, label: "Стих" },
  { key: Step.PREVIEW, label: "Просмотр" },
];

const VersePicker = ({ onClose, onAdded, lang }) => {
  const [step, setStep] = useState(Step.BOOK);
  const [bookList, setBookList] = useState([]);
  const [chapterList, setChapterList] = useState([]);
  const [verseList, setVerseList] = useState([]);

  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);

  const [verseFrom, setVerseFrom] = useState(null);
  const [verseTo, setVerseTo] = useState(null);

  const [verseText, setVerseText] = useState(null);
  const [verseInfo, setVerseInfo] = useState(null);

  const [loading, setLoading] = useState(false);
  const [selectSecond, setSelectSecond] = useState(false);

  const { i18n, t } = useTranslation("biblePicker");

  // --- загрузка книг ---
  useEffect(() => {
    setLoading(true);
    fetchAllBooks()
      .then(setBookList)
      .finally(() => setLoading(false));
  }, []);

  // --- загрузка глав ---
  useEffect(() => {
    if (selectedBook) {
      fetchAllBookChapter(selectedBook).then(setChapterList);
    } else {
      setChapterList([]);
    }
  }, [selectedBook]);

  // --- загрузка стихов ---
  useEffect(() => {
    if (selectedBook && selectedChapter) {
      fetchAllBookChapterVerses(selectedBook, selectedChapter).then(
        setVerseList
      );
    } else {
      setVerseList([]);
    }
  }, [selectedBook, selectedChapter]);

  // --- навигация назад ---
  const goBack = () => {
    if (step === Step.CHAPTER) {
      setStep(Step.BOOK);
      setSelectedChapter(null);
    } else if (step === Step.VERSE) {
      setStep(Step.CHAPTER);
      setVerseFrom(null);
      setVerseTo(null);
      setSelectSecond(false);
    } else if (step === Step.PREVIEW) {
      setStep(Step.VERSE);
      setVerseText(null);
      setVerseInfo(null);
    } else {
      onClose();
    }
  };

  const canGoBack = step !== Step.BOOK;

  const canGoNext =
    step === Step.BOOK
      ? !!selectedBook
      : step === Step.CHAPTER
      ? !!selectedChapter
      : step === Step.VERSE
      ? !!verseFrom
      : false;

  // --- предпросмотр ---
  const handlePreview = async (first, second) => {
    if (!first) return;

    setLoading(true);
    try {
      const isSingle = !second || Number(second) === Number(first);
      const verseRange = isSingle ? `${first}` : `${first}-${second}`;

      const res = await getVerseText(
        lang || t("bibleLanguage"),
        selectedBook,
        selectedChapter,
        verseRange
      );

      const verses = Array.isArray(res?.verses)
        ? res.verses
        : res?.verses
        ? [res.verses]
        : [];

      setVerseText(verses);
      setVerseInfo(res?.info ?? null);
      setStep(Step.PREVIEW);
    } finally {
      setLoading(false);
    }
  };

  const goNext = () => {
    if (!canGoNext) return;

    if (step === Step.BOOK) {
      setStep(Step.CHAPTER);
    } else if (step === Step.CHAPTER) {
      setStep(Step.VERSE);
    } else if (step === Step.VERSE) {
      // вызываем предпросмотр, дальше step → PREVIEW
      handlePreview(verseFrom, verseTo);
    }
  };

  // --- передача данных родителю ---
  const handleSave = () => {
    if (!verseFrom) return;

    const verseRange =
      verseTo && verseTo !== verseFrom
        ? `${verseFrom}-${verseTo}`
        : `${verseFrom}`;

    const selectedData = {
      book: selectedBook,
      chapter: selectedChapter,
      verse: verseRange,
      text: verseText,
      info: verseInfo,
    };

    if (onAdded) onAdded(selectedData);
    onClose();
  };

  // --- StepIndicator ---
  const StepIndicator = () => (
    <View style={styles.stepContainer}>
      {steps.map((s, idx) => {
        const isActive = steps.findIndex((st) => st.key === step) >= idx;
        return (
          <React.Fragment key={s.key}>
            <View
              style={[
                styles.stepCircle,
                isActive ? styles.stepActive : styles.stepInactive,
              ]}
            >
              <Text style={styles.stepNumber}>{idx + 1}</Text>
            </View>
            {idx < steps.length - 1 && (
              <View
                style={[
                  styles.stepLine,
                  isActive ? styles.stepLineActive : styles.stepLineInactive,
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );

  // --- выбор второго стиха ---
  const askSecondVerse = (v) => {
  setVerseFrom(v);
  Alert.alert(
    t("needSecondVerseTitle"),
    t("needSecondVerseMessage"),
    [
      {
        // вариант "другой стих не нужен"
        text: t("cancel"),
        style: "cancel",
        onPress: () => {
          setSelectSecond(false);
          setVerseTo(null);
          // 🔹 сразу показываем предпросмотр одного стиха
          handlePreview(v, null);
        },
      },
      {
        // вариант "выбрать второй стих"
        text: t("ok"),
        onPress: () => setSelectSecond(true),
      },
    ],
    { cancelable: false }
  );
};

  return (
    <View style={styles.container}>
      <StepIndicator />
      <DataLoaderWrapper loading={loading} data={bookList}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {step === Step.BOOK && (
            <>
              <Text style={styles.title}>{t("selectBook")}</Text>
              <Picker
                selectedValue={selectedBook}
                onValueChange={(v) => {
                  setSelectedBook(v);
                  setSelectedChapter(null);
                  setVerseFrom(null);
                  setVerseTo(null);
                  setSelectSecond(false);
                }}
                style={styles.picker}
              >
                {bookList.map((b) => (
                  <Picker.Item
                    key={b.number}
                    label={getBookLabel(b, i18n.language)}
                    value={b.number}
                  />
                ))}
              </Picker>
            </>
          )}

          {step === Step.CHAPTER && (
            <>
              <Text style={styles.title}>{t("langChapter")}</Text>
              <Picker
                selectedValue={selectedChapter}
                onValueChange={(v) => {
                  setSelectedChapter(v);
                  setVerseFrom(null);
                  setVerseTo(null);
                  setSelectSecond(false);
                }}
                style={styles.picker}
              >
                {chapterList.map((ch) => (
                  <Picker.Item
                    key={ch}
                    label={`${t("langChapter")} ${ch}`}
                    value={ch}
                  />
                ))}
              </Picker>
            </>
          )}

          {step === Step.VERSE && (
            <>
              <Text style={styles.title}>{t("langVerse")}</Text>

              {!verseFrom && (
                <>
                  <Text style={styles.subTitle}>{t("langFrom")}</Text>
                  <Picker
                    selectedValue={verseFrom}
                    onValueChange={(v) => askSecondVerse(v)}
                    style={styles.picker}
                  >
                    {verseList.map((v) => (
                      <Picker.Item
                        key={`from-${v}`}
                        label={`${t("langVerse")} ${v}`}
                        value={v}
                      />
                    ))}
                  </Picker>
                </>
              )}

              {selectSecond && verseFrom && (
                <>
                  <Text style={styles.subTitle}>{t("langTo")}</Text>
                  <Picker
                    selectedValue={verseTo}
                    onValueChange={(v) => {
                      setVerseTo(v);
                    }}
                    style={styles.picker}
                  >
                    {verseList
                      .filter((v) => Number(v) > Number(verseFrom))
                      .map((v) => (
                        <Picker.Item
                          key={`to-${v}`}
                          label={`${t("langVerse")} ${v}`}
                          value={v}
                        />
                      ))}
                  </Picker>
                </>
              )}
            </>
          )}

          {step === Step.PREVIEW && verseText && (
            <View style={styles.previewContainer}>
              <View style={styles.previewCard}>
                <Text style={styles.previewTitle}>{t("langVerse")}</Text>

                <ScrollView contentContainerStyle={styles.verseScroll}>
                  {verseText.map((v, i) => (
                    <Text key={i} style={styles.verseText}>
                      {v}
                    </Text>
                  ))}
                </ScrollView>

                {verseInfo && (
                  <View style={styles.refContainer}>
                    <Ionicons name="book-outline" size={18} color="#3B5BA7" />
                    <Text style={styles.verseRef}>{verseInfo}</Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </ScrollView>
      </DataLoaderWrapper>

      {/* Нижняя панель кнопок */}
      <View style={styles.bottomBar}>
        {/* НАЗАД — видна всегда, но на первом шаге disabled */}
        <TouchableOpacity
          onPress={goBack}
          disabled={!canGoBack}
          style={[
            styles.iconButton,
            !canGoBack && styles.iconButtonDisabled,
          ]}
        >
          <Ionicons
            name="arrow-back-circle"
            size={38}
            color={canGoBack ? "#6B7AFF" : "#B0B0B0"}
          />
        </TouchableOpacity>

        {/* ДАЛЕЕ или СОХРАНИТЬ */}
        {step !== Step.PREVIEW ? (
          <TouchableOpacity
            onPress={goNext}
            disabled={!canGoNext}
            style={[
              styles.iconButton,
              !canGoNext && styles.iconButtonDisabled,
            ]}
          >
            <Ionicons
              name="arrow-forward-circle"
              size={38}
              color={canGoNext ? "#6B7AFF" : "#B0B0B0"}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleSave} style={styles.iconButton}>
            <Ionicons name="save" size={38} color="#4CAF50" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default VersePicker;