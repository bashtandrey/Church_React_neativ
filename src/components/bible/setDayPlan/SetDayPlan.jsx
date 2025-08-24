import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Button,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";
import DataLoaderWrapper from "@/components/DataLoaderWrapper";
import {
  fetchAllBooks,
  fetchAllBookChapter,
  getListDayPlan,
  setDailyPlan,
  deleteDailyPlan,
} from "@/api/bibleAPI";
import styles from "./SetDayPlanStyles";

const Step = {
  BOOK: "BOOK",
  CHAPTER: "CHAPTER",
};

const SetDayPlan = ({ month, day }) => {
  const [step, setStep] = useState(Step.BOOK);
  const [bookList, setBookList] = useState([]);
  const [chapterList, setChapterList] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [versesForDay, setVersesForDay] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  // load books
  useEffect(() => {
    fetchAllBooks().then(setBookList);
  }, []);

  // load chapters when book selected
  useEffect(() => {
    if (selectedBook) {
      fetchAllBookChapter(selectedBook).then(setChapterList);
    }
  }, [selectedBook]);

  const loadVerses = () => {
    setLoading(true);
    getListDayPlan(month, day)
      .then(setVersesForDay)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadVerses();
  }, [month, day]);

  const handleDelete = (verseId) => {
    Alert.alert("Delete verse", "Are you sure you want to remove this verse?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteDailyPlan(verseId).then(loadVerses);
        },
      },
    ]);
  };

  const handlePickerChange = (value) => {
    if (!value) return;

    if (step === Step.BOOK) {
      setSelectedBook(value);
      setStep(Step.CHAPTER);
    } else if (step === Step.CHAPTER) {
      setSelectedChapter(value);
      Alert.alert(
        "Confirm verse",
        `Add chapter ${value} from ${
          bookList.find((b) => b.number === selectedBook)?.englishName
        }?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Add",
            onPress: () => {
              setDailyPlan(month, day, selectedBook, value)
                .then(() => {
                  setShowPicker(false);
                  setSelectedBook(null);
                  setSelectedChapter(null);
                  setStep(Step.BOOK);
                  loadVerses();
                })
                .catch((err) => console.error(err));
            },
          },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>
          Verses for {month}/{day}
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            if (!showPicker) {
              setStep(Step.BOOK);
              setSelectedBook(null);
              setSelectedChapter(null);
            }
            setShowPicker((prev) => !prev);
          }}
        >
          <Ionicons
            name={showPicker ? "remove-circle-outline" : "add-circle-outline"}
            size={28}
            color={showPicker ? "#ef4444" : "#10b981"}
          />
          <Text style={styles.addButtonText}>
            {showPicker ? "Cancel" : "Add"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Picker */}
      {showPicker && (
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={step === Step.BOOK ? selectedBook : selectedChapter}
            onValueChange={handlePickerChange}
          >
            <Picker.Item
              label={
                step === Step.BOOK ? "Select book..." : "Select chapter..."
              }
              value={null}
            />
            {step === Step.BOOK
              ? bookList.map((book) => (
                  <Picker.Item
                    key={book.number}
                    label={`${book.russianName} (${book.englishName})`}
                    value={book.number}
                  />
                ))
              : chapterList.map((ch) => (
                  <Picker.Item key={ch} label={`Chapter ${ch}`} value={ch} />
                ))}
          </Picker>

          {step === Step.CHAPTER && (
            <Button title="Back" onPress={() => setStep(Step.BOOK)} />
          )}
        </View>
      )}

      {/* Verses List */}
      <DataLoaderWrapper loading={loading} data={versesForDay}>
        <ScrollView>
          {versesForDay.length > 0 ? (
            versesForDay.map((v) => (
              <View key={v.id} style={styles.verseRow}>
                <Text style={styles.verseText}>
                  {v.englishName} (
                  <Text style={{ color: "#3b82f6" }}>{v.rusianName}</Text>){" "}
                  {v.chapter}
                </Text>
                <TouchableOpacity onPress={() => handleDelete(v.id)}>
                  <Ionicons name="trash-outline" size={22} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No verses added yet</Text>
          )}
        </ScrollView>
      </DataLoaderWrapper>
    </View>
  );
};

export default SetDayPlan;
