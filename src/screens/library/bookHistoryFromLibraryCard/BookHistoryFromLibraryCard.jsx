import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Layout from "@/components/Layout";
import styles from "./BookHistoryFromLibraryCardScreenStyles";
import { getBookHistoryFromLibraryCard } from "@/api/libraryAPI";
import { useTranslation } from "react-i18next";

const BookHistoryFromLibraryCardScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { cardId } = route.params;
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState(null);
  const { t } = useTranslation("bookHistoryScreen");

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await getBookHistoryFromLibraryCard(cardId);
        setHistory(data || null);
      } catch (err) {
        console.error("Error loading card history:", err);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, [cardId]);

  return (
    <Layout>
      <View style={styles.container}>
        {/* 🔹 Карточка читателя */}
        {history && (
          <View style={styles.readerHeader}>
            <Ionicons name="person-circle-outline" size={30} color="#118AB2" />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.readerName}>
                {history.firstName} {history.lastName}
              </Text>
              <Text style={styles.readerSub}>ID: {history.id}</Text>
            </View>
          </View>
        )}

        {/* 🔹 История книг */}
        <Text style={styles.sectionTitle}>{t("historyTitle")}</Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#118AB2"
            style={{ marginTop: 20 }}
          />
        ) : !history?.bookList?.length ? (
          <Text style={styles.emptyText}>{t("noHistory")}</Text>
        ) : (
          <FlatList
            data={history.bookList}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => {
              const notReturned = !item.returnDate;
              return (
                <View
                  style={[
                    styles.historyItem,
                    notReturned && styles.activeBookItem,
                  ]}
                >
                  <Ionicons
                    name="book-outline"
                    size={24}
                    color={notReturned ? "#FF3B30" : "#FF9500"}
                  />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text
                      style={[
                        styles.bookName,
                        notReturned && styles.activeBookName,
                      ]}
                    >
                      {item.nameBook}
                    </Text>
                    <Text style={styles.historyDate}>
                      📅 {t("issued")}: {item.issueDate}
                    </Text>
                    {item.returnDate ? (
                      <Text style={styles.historyDate}>
                        🔙 {t("returned")}: {item.returnDate}
                      </Text>
                    ) : (
                      <Text style={[styles.historyDate, styles.notReturned]}>
                        ⚠️ {t("notReturned")}
                      </Text>
                    )}
                  </View>
                </View>
              );
            }}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          />
        )}

        {/* 🔹 Кнопка закрыть */}
        <Pressable
          style={[styles.btn, styles.closeBtn]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.btnText}>{t("close")}</Text>
        </Pressable>
      </View>
    </Layout>
  );
};

export default BookHistoryFromLibraryCardScreen;