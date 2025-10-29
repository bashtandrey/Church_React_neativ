import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  Animated,
  TextInput,
  Pressable,
} from "react-native";
import Layout from "@/components/Layout";
import { fetchAllLibraryCard } from "@/api/libraryAPI";
import { useTranslation } from "react-i18next";
import DataLoaderWrapper from "@/components/DataLoaderWrapper";
import { LinearGradient } from "expo-linear-gradient";
import ModalTrigger from "@/components/common/ModalTrigger";
import { Ionicons } from "@expo/vector-icons";
import styles from "./LibraryCardScreenStyles";
import SaveLibraryCardModal from "@/components/library/modal/saveLibraryCardModal/SaveLibraryCardModal";
import LibraryCard from "@/components/library/libraryCard/LibraryCard";

const LibraryCardScreen = () => {
  const { t } = useTranslation("libraryCardScreen");
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const FILTERS = [
    { key: "all", label: t("all") },
    { key: "haveBook", label: t("haveBook") },
    { key: "withoutBook", label: t("withoutBook") },

  ];

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const loadCards = async () => {
    try {
      const data = await fetchAllLibraryCard();
      setCards(data);
    } catch (err) {
      console.error("Error loading library cards:", err);
    } finally {
      setLoading(false);
      fadeIn();
    }
  };

  useEffect(() => {
    loadCards();
  }, []);

  const filteredCards = cards.filter((card) => {
    const matchesSearch =
      card.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      card.lastName?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" || (filter === "haveBook" && card.haveBook) || (filter === "withoutBook" && !card.haveBook)  ;

    return matchesSearch && matchesFilter;
  });
  const totalCards = filteredCards.length;

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <LibraryCard libraryCard={item} reLoad={loadCards} />
    </View>
  );

  return (
    <Layout>
      <LinearGradient colors={["#f1f5f9", "#ffffff"]} style={styles.container}>
        {/* Заголовок */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>{t("title")}</Text>

          <ModalTrigger
            opener={(open) => (
              <Pressable style={styles.createButton} onPress={open}>
                <Ionicons name="add-circle-outline" size={22} color="#007AFF" />
                <Text style={styles.createText}>{t("createButton")}</Text>
              </Pressable>
            )}
          >
            {({ close }) => (
              <SaveLibraryCardModal
                visible
                onClose={close}
                reLoad={loadCards}
              />
            )}
          </ModalTrigger>
        </View>

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

        <Text style={styles.resultCount}>
          {totalCards > 0
            ? t("foundCount", { count: totalCards })
            : t("noResults")}
        </Text>

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
        <DataLoaderWrapper loading={loading} data={cards} onRetry={loadCards}>
          <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
            <FlatList
              data={filteredCards}
              keyExtractor={(item) => `card-${item.id}`}
              renderItem={renderItem}
              contentContainerStyle={styles.listContainer}
              refreshing={loading}
              onRefresh={loadCards}
              ListEmptyComponent={
                <Text style={styles.emptyText}>{t("noCards")}</Text>
              }
            />
          </Animated.View>
        </DataLoaderWrapper>
      </LinearGradient>
    </Layout>
  );
};
export default LibraryCardScreen;
