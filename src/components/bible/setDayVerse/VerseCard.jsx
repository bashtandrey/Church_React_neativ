import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "./SetDayVerseStyles";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n/";

const VerseCard = ({ verse, onSet, onDelete, onReload }) => {
  const { t } = useTranslation("setDayVerse");
  const [open, setOpen] = useState(false);

  const verseDTO =
    i18n.language === "ru" ? verse.verseDTOSRus : verse.verseDTOSEng;

  return (
    <View style={styles.verseCard}>
      {/* Заголовок */}
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={styles.verseRef}>{verseDTO.info}</Text>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={20}
          color="#6b7280"
        />
      </TouchableOpacity>

      {/* Текст + иконки */}
      {open && (
        <View style={{ marginTop: 8 }}>
          {verseDTO.verses.map((v, i) => (
            <Text key={i} style={styles.verseText}>
              {v}
            </Text>
          ))}

          <View style={styles.iconRow}>
            {/* ✅ Установить */}
            <TouchableOpacity
              onPress={() => onSet?.(verse)}
              style={styles.iconBtn}
            >
              <Ionicons name="checkmark-circle" size={28} color="#16a34a" />
            </TouchableOpacity>

            {/* 🗑 Удалить */}
            <TouchableOpacity
              onPress={() => onDelete?.(verse.id)}
              style={styles.iconBtn}
            >
              <Ionicons name="trash-outline" size={26} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default VerseCard;
