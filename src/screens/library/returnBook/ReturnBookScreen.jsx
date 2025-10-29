import React, { useState } from "react";
import { View, Text, Pressable, Alert, ActivityIndicator } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Layout from "@/components/Layout";
import styles from "./ReturnBookScreenStyles";
import { returnBook } from "@/api/libraryAPI";
import { useTranslation } from "react-i18next";

const ReturnBookScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { book } = route.params;
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("returnBookScreen");

  const handleReturn = async () => {
    try {
      setLoading(true);
      const res = await returnBook({ bookId: book.id });
      if (res.success) {
        Alert.alert(t("success"), t("bookReturned"));
        navigation.navigate("BookScreen");
      } else {
        Alert.alert(t("error"), res.error || t("bookReturnFailed"));
      }
    } catch (err) {
      Alert.alert(t("error"), err.message || t("networkError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <View style={styles.container}>
        {/* 🔹 Карточка читателя */}
        <View style={[styles.card, styles.readerCard]}>
          <Ionicons name="person-circle-outline" size={28} color="#118AB2" />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.label}>{t("reader")}</Text>
            <Text style={styles.title}>
              {book.holder?.firstName} {book.holder?.lastName}
            </Text>
          </View>
        </View>

        {/* 🔹 Карточка книги */}
        <View style={[styles.card, styles.bookCard]}>
          <Ionicons name="book-outline" size={26} color="#FF9500" />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.label}>{t("book")}</Text>
            <Text style={styles.title}>{book.nameBook}</Text>
            <Text style={styles.sub}>№ {book.serial}</Text>
          </View>
        </View>

        {/* 🔹 Кнопки */}
        <View style={styles.footer}>
          <Pressable
            style={[styles.btn, styles.cancelBtn]}
            onPress={() => navigation.navigate("BookScreen")}
          >
            <Text style={styles.btnText}>{t("cancel")}</Text>
          </Pressable>

          <Pressable
            style={[styles.btn, styles.confirmBtn]}
            onPress={handleReturn}
            disabled={loading}
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

export default ReturnBookScreen;