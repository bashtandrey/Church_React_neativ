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
import styles from "./BookHistoryFromBookScreenStyles";
import { getBookHistoryFromBook } from "@/api/libraryAPI";
import { useTranslation } from "react-i18next";

const BookHistoryFromBookScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { bookId } = route.params;
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState(null);
  const { t } = useTranslation("bookHistoryScreen");

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await getBookHistoryFromBook(bookId);
        setHistory(data || null);
      } catch (err) {
        console.error("Error loading book history:", err);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, [bookId]);

  return (
    <Layout>
      <View style={styles.container}>
        {/* 🔹 Заголовок книги */}
        {history && (
          <View style={styles.bookHeader}>
            <Ionicons name="book-outline" size={28} color="#FF9500" />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.bookTitle}>{history.nameBook}</Text>
              <Text style={styles.bookSerial}>№{history.serial}</Text>
            </View>
          </View>
        )}

        {/* 🔹 История */}
        <Text style={styles.sectionTitle}>{t("historyTitle")}</Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#118AB2"
            style={{ marginTop: 20 }}
          />
        ) : !history?.cardList?.length ? (
          <Text style={styles.emptyText}>{t("noHistory")}</Text>
        ) : (
          <FlatList
            data={history.cardList}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => {
              const notReturned = !item.returnDate;
              return (
                <View
                  style={[
                    styles.historyItem,
                    notReturned && styles.activeReaderItem,
                  ]}
                >
                  <Ionicons
                    name="person-circle-outline"
                    size={26}
                    color={notReturned ? "#FF3B30" : "#118AB2"}
                  />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text
                      style={[
                        styles.readerName,
                        notReturned && styles.activeReaderName,
                      ]}
                    >
                      {item.firstName} {item.lastName}
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

        {/* 🔹 Кнопка закрытия */}
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

export default BookHistoryFromBookScreen;