import React, { useState } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./LibraryCardStyle";
import { useNavigation } from "@react-navigation/native";

const LibraryCard = ({ libraryCard, reLoad }) => {
  const navigation = useNavigation();
  const [busy, setBusy] = useState(false);
  const hasBook = !!libraryCard.haveBook;

  const handleIssue = async () => {
    try {
      setBusy(true);
      navigation.navigate("EnterBook", { card: libraryCard });
      reLoad?.();
    } finally {
      setBusy(false);
    }
  };

  const handleReturn = async () => {
    try {
      setBusy(true);
      navigation.navigate("ReturnBookFromReader", { cardId: libraryCard.id });
      reLoad?.();
    } finally {
      setBusy(false);
    }
  };

  const handleHistory = () => {
    navigation.navigate("BookHistoryFromLibraryCard", { cardId: libraryCard.id });
  };

  return (
    <View style={[styles.card, hasBook && styles.cardIssued]}>
      {/* 🔹 Заголовок */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.serial}>№ {libraryCard.id}</Text>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {libraryCard.firstName} {libraryCard.lastName}
          </Text>
        </View>

        {/* 🔹 Бейдж — только если книга на руках */}
        {hasBook && (
          <View style={[styles.badge, styles.badgeIssued]}>
            <Ionicons
              name="book-outline"
              size={16}
              color="#FF9500"
              style={{ marginRight: 4 }}
            />
          </View>
        )}
      </View>

      {/* 🔹 Кнопки */}
      <View style={styles.actionRow}>
        {hasBook ? (
          <Pressable style={styles.actionBtn} onPress={handleReturn}>
            {busy ? (
              <ActivityIndicator size="small" color="#06D6A0" />
            ) : (
              <Ionicons name="exit-outline" size={20} color="#06D6A0" />
            )}
          </Pressable>
        ) : (
          <Pressable style={styles.actionBtn} onPress={handleIssue}>
            {busy ? (
              <ActivityIndicator size="small" color="#118AB2" />
            ) : (
              <Ionicons name="enter-outline" size={20} color="#118AB2" />
            )}
          </Pressable>
        )}

        <Pressable style={styles.actionBtn} onPress={handleHistory}>
          <Ionicons name="time-outline" size={20} color="#8E8E93" />
        </Pressable>
      </View>
    </View>
  );
};

export default LibraryCard;