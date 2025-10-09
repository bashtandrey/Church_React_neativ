import React, { useState, useEffect, useCallback, useMemo } from "react";
import { View, TextInput, Text, ScrollView,Alert } from "react-native";
import DataLoaderWrapper from "@/components/DataLoaderWrapper";
import VerseCard from "./VerseCard";
import styles from "./SetDayVerseStyles";
import {
  getListBibleVerseDay,
  setDailyVerse,
  deleteDailyVerse,
} from "@/api/bibleAPI";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n/";

const VerseList = ({ onClose, reLoad }) => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [listDay, setListDay] = useState([]);
  const { t } = useTranslation("setDayVerse");

  // загрузка списка
  const loadList = useCallback(() => {
    setLoading(true);
    getListBibleVerseDay()
      .then(setListDay)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadList();
  }, [loadList]);

  // установка стиха
  const handleSetVerse = (item) => {
    setDailyVerse(item.id);
    onClose();
    reLoad();
  };

  const handleDelete = (id) => {
    Alert.alert(
      t("deleteTitle", { defaultValue: "Удалить стих" }),
      t("deleteConfirm", {
        defaultValue: "Вы уверены, что хотите удалить этот стих?",
      }),
      [
        { text: t("cancel", { defaultValue: "Отмена" }), style: "cancel" },
        {
          text: t("delete", { defaultValue: "Удалить" }),
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDailyVerse(id);
              onClose();
              reLoad();
            } catch (err) {
              console.error("Ошибка удаления стиха:", err);
            }
          },
        },
      ]
    );
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return listDay;
    const q = search.toLowerCase();
    return listDay.filter(
      (v) =>
        v.ref.toLowerCase().includes(q) ||
        v.verses.some((t) => t.toLowerCase().includes(q))
    );
  }, [listDay, search]);

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Поиск по книге, ссылке или тексту"
        value={search}
        onChangeText={setSearch}
      />
      <Text style={{ color: "#6b7280", marginBottom: 8 }}>
        Найдено: {filtered.length}
      </Text>

      <DataLoaderWrapper loading={loading} data={filtered}>
        <ScrollView>
          {filtered.length > 0 ? (
            filtered.map((v, i) => (
              <VerseCard
                key={i}
                verse={v}
                onDelete={handleDelete}
                onSet={handleSetVerse}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>Нет стихов</Text>
          )}
        </ScrollView>
      </DataLoaderWrapper>
    </View>
  );
};

export default VerseList;
