import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./BookCardStyle";

// Разрешаем анимацию для Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const BookCard = ({ bookdata, showActions = false, reLoad }) => {
  const [expanded, setExpanded] = useState(false);
  const isIssued = bookdata.issued;
  const holder = bookdata.holder;

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <Pressable
      onPress={toggleExpand}
      style={[styles.card, isIssued && styles.cardIssued]}
    >
      {/* 🔹 Верхняя часть (свернутая) */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.serial}>№ {bookdata.serial}</Text>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {bookdata.nameBook}
          </Text>
        </View>

        <View
          style={[
            styles.badge,
            isIssued ? styles.badgeIssued : styles.badgeAvailable,
          ]}
        >
          <Ionicons
            name={isIssued ? "hand-right-outline" : "library-outline"}
            size={16}
            color={isIssued ? "#FF9500" : "#34C759"}
            style={{ marginRight: 4 }}
          />
          <Text style={styles.badgeText}>
            {isIssued ? "На руках" : "В библиотеке"}
          </Text>
        </View>
      </View>

      {/* 🔽 Показать стрелку вниз только если есть детали */}
      <View style={{ alignItems: "center" }}>
        <Ionicons
          name={expanded ? "chevron-up-outline" : "chevron-down-outline"}
          size={20}
          color="#666"
        />
      </View>

      {/* 🔹 Разворачиваемая часть */}
      {expanded && (
        <View style={styles.infoBlock}>
          <Text style={styles.textSmall}>
            Издательство:{" "}
            <Text style={styles.textBold}>
              {bookdata.publishingHouse || "—"}
            </Text>
          </Text>
          <Text style={styles.textSmall}>
            Год:{" "}
            <Text style={styles.textBold}>
              {bookdata.publishingYear || "—"}
            </Text>
          </Text>

          {bookdata.description ? (
            <Text style={styles.textDescription}>{bookdata.description}</Text>
          ) : null}

          {isIssued && holder && (
            <Text style={styles.holderText}>
              📘 У кого:{" "}
              <Text style={styles.textBold}>
                {holder.firstName} {holder.lastName}
              </Text>
            </Text>
          )}
        </View>
      )}
    </Pressable>
  );
};

export default BookCard;