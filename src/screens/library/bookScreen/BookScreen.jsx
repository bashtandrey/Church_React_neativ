import React, { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import {
  FlatList,
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  Animated,
} from "react-native";
import { fetchAllBook } from "@/api/libraryAPI";
import { useTranslation } from "react-i18next";
import DataLoaderWrapper from "@/components/DataLoaderWrapper";
import { useUser } from "@/context/UserContext";
import BookCard from "@/components/library/book/BookCard";
import ModalTrigger from "@/components/common/ModalTrigger";
import SaveBookModal from "@/components/library/book/modal/saveBookModal/SaveBookModal";
import { Ionicons } from "@expo/vector-icons";
import { useReviewerGuard } from "@/hooks/useReviewerGuard";
import { LinearGradient } from "expo-linear-gradient";
import styles from "./BookScreenStyles";

const BookScreen = () => {
  const { t } = useTranslation("bookScreen");
  const guard = useReviewerGuard();
  const [loading, setLoading] = useState(false);
  const [bookData, setBookData] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const { isMember, isLibrarryAdmin } = useUser();

  const FILTERS = [
    { key: "all", label: t("all") },
    { key: "available", label: t("available") },
    { key: "issued", label: t("issued") },
  ];

  // 🔸 Плавное появление
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const fadeIn = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchAllBook();
      setBookData(res);
    } finally {
      setLoading(false);
      fadeIn();
    }
  };

  useEffect(() => {
    if (isMember) loadData();
  }, []);

  const filteredBooks = bookData.filter((b) => {
    const matchesSearch =
      b.nameBook?.toLowerCase().includes(search.toLowerCase()) ||
      b.serial?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ? true : filter === "available" ? !b.issued : b.issued;

    return matchesSearch && matchesFilter;
  });

  const renderItem = ({ item }) => (
    <BookCard bookdata={item} reLoad={loadData} />
  );

  // 🔸 Счётчик найденных
  const totalBooks = filteredBooks.length;

  return (
    <Layout>
      <LinearGradient colors={["#f1f5f9", "#ffffff"]} style={styles.container}>
        {/* Заголовок */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>{t("title")}</Text>

          {isLibrarryAdmin && (
            <ModalTrigger
              opener={(open) => (
                <Pressable
                  style={styles.createButton}
                  onPress={() => guard(open)}
                >
                  <Ionicons
                    name="add-circle-outline"
                    size={22}
                    color="#007AFF"
                  />
                  <Text style={styles.createText}>{t("createButton")}</Text>
                </Pressable>
              )}
            >
              {({ close }) => (
                <SaveBookModal
                  visible
                  onClose={close}
                  reLoad={loadData}
                />
              )}
            </ModalTrigger>
          )}
        </View>

        {/* Поиск */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={18} color="#555" />
          <TextInput
            style={styles.searchInput}
            placeholder={t("searchPlaceholder")}
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#888"
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={18} color="#999" />
            </Pressable>
          )}
        </View>

        {/* 🔸 Счётчик найденных */}
        <Text style={styles.resultCount}>
          {totalBooks > 0
            ? t("foundCount", { count: totalBooks })
            : t("noResults")}
        </Text>

        {/* Фильтры */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={{ alignItems: "center" }}
        >
          {FILTERS.map((f) => {
            const isActive = filter === f.key;
            return (
              <Pressable
                key={f.key}
                onPress={() => {
                  setFilter(f.key);
                  fadeIn();
                }}
                style={[
                  styles.filterButton,
                  isActive && styles.filterButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    isActive && styles.filterTextActive,
                  ]}
                >
                  {f.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Список */}
        <DataLoaderWrapper loading={loading} data={bookData} onRetry={loadData}>
          <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
            <FlatList
              data={filteredBooks}
              keyExtractor={(item) => `book-${item.id}`}
              renderItem={renderItem}
              contentContainerStyle={styles.listContainer}
              refreshing={loading}
              onRefresh={loadData}
              ListEmptyComponent={
                <Text style={styles.emptyText}>{t("noBooks")}</Text>
              }
            />
          </Animated.View>
        </DataLoaderWrapper>
      </LinearGradient>
    </Layout>
  );
};

export default BookScreen;
