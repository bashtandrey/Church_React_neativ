import React, { useState } from "react";
import {
  View,
  Text,
  RefreshControl,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "./SetDayVerseStyles";
import VerseList from "./VerseList";
import VersePicker from "../versePicker/VersePicker";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n/";
import { addedDailyVerse } from "@/api/bibleAPI";

const SetVerseBible = ({ onClose, reLoad }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showPicker, setShowPicker] = useState(false);
  const [showList, setShowList] = useState(true);

  const { t } = useTranslation("setDayVerse");

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshKey((prev) => prev + 1);
      setRefreshing(false);
    }, 1000);
  };

  const togglePicker = () => {
    setShowPicker((prev) => !prev);
    setShowList((prev) => !prev);
  };
  const handleSave = (data) => {
    addedDailyVerse(data);
    onClose();
    reLoad();
  };

  const data = [
    {
      key: "title",
      render: () => (
        <View style={styles.headerRow}>
          {/* Левая кнопка — закрыть */}
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close-circle-outline" size={28} color="#ef4444" />
          </TouchableOpacity>

          {/* Заголовок */}
          <Text style={styles.title}>{t("title")}</Text>

          {/* Правая кнопка — открыть/закрыть пикер */}
          <TouchableOpacity onPress={togglePicker}>
            <Ionicons
              name={showPicker ? "remove-circle-outline" : "add-circle-outline"}
              size={28}
              color={showPicker ? "#ef4444" : "#10b981"} // красный минус / зелёный плюс
            />
          </TouchableOpacity>
        </View>
      ),
    },
    {
      key: "versePicker",
      render: () =>
        showPicker && (
          <VersePicker
            onClose={togglePicker}
            onAdded={handleSave}
            refreshKey={refreshKey}
          />
        ),
    },
    {
      key: "verseList",
      render: () =>
        showList && (
          <VerseList reLoad={reLoad} onClose={onClose} key={refreshKey} />
        ),
    },
  ];

  return (
    <View style={styles.modalContent}>
      <FlatList
        data={data}
        renderItem={({ item }) => <View>{item.render()}</View>}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

export default SetVerseBible;
