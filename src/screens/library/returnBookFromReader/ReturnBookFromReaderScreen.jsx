import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Alert,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Layout from "@/components/Layout";
import styles from "./ReturnBookFromReaderScreenStyles";
import { returnBook, getAllBookFromLibraryCard } from "@/api/libraryAPI";
import { useTranslation } from "react-i18next";

const ReturnBookFromReaderScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { cardId } = route.params;
  const [loading, setLoading] = useState(true);
  const [cardData, setCardData] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const { t } = useTranslation("returnBookScreen");

  const loadData = async () => {
    try {
      const data = await getAllBookFromLibraryCard(cardId);
      setCardData(data);
    } catch (err) {
      console.error("Error loading data:", err);
      Alert.alert(t("error"), t("networkError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReturn = async () => {
    if (!selectedBook) return;
    try {
      setLoading(true);
      const res = await returnBook({ bookId: selectedBook.id });
      if (res.success) {
        Alert.alert(t("success"), t("bookReturned"));
        navigation.navigate("LibraryCardScreen");
      } else {
        Alert.alert(t("error"), res.error || t("bookReturnFailed"));
      }
    } catch (err) {
      Alert.alert(t("error"), err.message || t("networkError"));
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <Layout>
        <View style={[styles.container, { justifyContent: "center" }]}>
          <ActivityIndicator size="large" color="#118AB2" />
        </View>
      </Layout>
    );

  if (!cardData)
    return (
      <Layout>
        <View style={styles.container}>
          <Text style={styles.emptyText}>{t("noData")}</Text>
        </View>
      </Layout>
    );

  return (
    <Layout>
      <View style={styles.container}>
        {/* 🔹 Карточка читателя */}
        <View style={[styles.card, styles.readerCard]}>
          <Ionicons name="person-circle-outline" size={28} color="#118AB2" />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.label}>{t("reader")}</Text>
            <Text style={styles.title}>
              {cardData.firstName} {cardData.lastName}
            </Text>
          </View>
        </View>

        {/* 🔹 Карточка выбранной книги или список */}
        {selectedBook ? (
          // Если книга выбрана — показать только её
          <View style={[styles.card, styles.bookCard]}>
            <Ionicons name="book-outline" size={26} color="#FF9500" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.label}>{t("book")}</Text>
              <Text style={styles.title}>{selectedBook.nameBook}</Text>
              <Text style={styles.sub}>№ {selectedBook.serial}</Text>
            </View>
            <Pressable
              onPress={() => setSelectedBook(null)}
              style={styles.clearBtn}
            >
              <Ionicons name="close" size={20} color="#E63946" />
            </Pressable>
          </View>
        ) : (
          // Если нет выбранной — показать список всех невозвращённых
          <FlatList
            data={cardData.bookList}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <Pressable
                style={styles.bookItem}
                onPress={() => setSelectedBook(item)}
              >
                <Ionicons name="book-outline" size={22} color="#FF9500" />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.bookName}>{item.nameBook}</Text>
                  <Text style={styles.bookSerial}>№ {item.serial}</Text>
                </View>
                <Ionicons
                  name="chevron-forward-outline"
                  size={20}
                  color="#888"
                />
              </Pressable>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            ListEmptyComponent={
              <Text style={styles.emptyText}>{t("noActiveBooks")}</Text>
            }
          />
        )}

        {/* 🔹 Кнопки */}
        <View style={styles.footer}>
          <Pressable
            style={[styles.btn, styles.cancelBtn]}
            onPress={() => navigation.navigate("LibraryCardScreen")}
          >
            <Text style={styles.btnText}>{t("cancel")}</Text>
          </Pressable>

          <Pressable
            style={[
              styles.btn,
              selectedBook ? styles.confirmBtn : styles.btnDisabled,
            ]}
            onPress={selectedBook ? handleReturn : undefined}
            disabled={!selectedBook || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>{t("confirm")}</Text>
            )}
          </Pressable>
        </View>
      </View>
    </Layout>
  );
};

export default ReturnBookFromReaderScreen;