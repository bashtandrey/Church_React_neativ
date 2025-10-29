import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Layout from "@/components/Layout";
import styles from "./EnterBookScreenStyles";
import {
  getAllBookWithoutLibraryCard, // список книг, доступных к выдаче
  fetchAllLibraryCard,          // список библиотечных карт
  issueBook,                    // API: выдать книгу карте
} from "@/api/libraryAPI";
import { useTranslation } from "react-i18next";

const EnterBookScreen = () => {
  const { t } = useTranslation("enterBookScreen");
  const route = useRoute();
  const navigation = useNavigation();
  const { book, card } = route.params || {};

  // Режим запуска
  // - если пришла книга  -> выбираем карту
  // - если пришла карточка -> выбираем книгу
  // - если ничего -> сначала книгу, затем карту
  const initialMode = useMemo(() => {
    if (book) return "pickCard";
    if (card) return "pickBook";
    return "pickBookFirst";
  }, [book, card]);

  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);   // текущий список для выбора (книг или карт)
  const [query, setQuery] = useState("");

  const [selectedBook, setSelectedBook] = useState(book || null);
  const [selectedCard, setSelectedCard] = useState(card || null);

  // Показать ли поиск + список сейчас
  const showPicker = useMemo(() => {
    if (initialMode === "pickBook") return !selectedBook;
    if (initialMode === "pickCard") return !selectedCard;
    // pickBookFirst: пока не выбраны обе — показываем
    return !(selectedBook && selectedCard);
  }, [initialMode, selectedBook, selectedCard]);

  // Какой тип списка нужен сейчас
  const needListType = useMemo(() => {
    if (initialMode === "pickBook") return !selectedBook ? "books" : null;
    if (initialMode === "pickCard") return !selectedCard ? "cards" : null;
    // pickBookFirst
    if (!selectedBook) return "books";
    if (!selectedCard) return "cards";
    return null;
  }, [initialMode, selectedBook, selectedCard]);

  // Загрузка нужного списка
  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!needListType) {
        if (active) setList([]); // чтобы не мигал старый список
        return;
      }
      setLoading(true);
      try {
        if (needListType === "books") {
          const books = await getAllBookWithoutLibraryCard();
          if (active) setList(books || []);
        } else {
          const cards = await fetchAllLibraryCard();
          if (active) setList(cards || []);
        }
      } catch (err) {
        console.error("Ошибка загрузки:", err);
        if (active) setList([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [needListType]);

  // Фильтрация по запросу
  const filtered = useMemo(() => {
    if (!query) return list;
    const q = query.toLowerCase().trim();
    if (needListType === "cards") {
      return list.filter(
        (c) =>
          (c.firstName || "").toLowerCase().includes(q) ||
          (c.lastName || "").toLowerCase().includes(q) ||
          (c.login || "").toLowerCase().includes(q)
      );
    } else if (needListType === "books") {
      return list.filter(
        (b) =>
          (b.nameBook || "").toLowerCase().includes(q) ||
          String(b.serial || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [list, query, needListType]);

  const canSave = !!(selectedBook && selectedCard);

  // Выбор элемента из списка
  const handlePick = (item) => {
    if (needListType === "cards") {
      setSelectedCard(item);
    } else if (needListType === "books") {
      setSelectedBook(item);
    }
    setQuery(""); // очистить строку поиска после выбора
  };

  // Универсальный сброс текущего выбираемого элемента (чтобы список вернулся)
  const clearPick = async () => {
  try {
    setLoading(true);

    // если очищаем карту → обнуляем и перезапрашиваем карты
    if (selectedCard) {
      setSelectedCard(null);
      const cards = await fetchAllLibraryCard();
      setList(cards || []);
      return;
    }

    // если очищаем книгу → обнуляем и перезапрашиваем книги
    if (selectedBook) {
      setSelectedBook(null);
      const books = await getAllBookWithoutLibraryCard();
      setList(books || []);
      return;
    }

  } catch (err) {
    console.error("Ошибка при повторной загрузке:", err);
  } finally {
    setLoading(false);
  }
};


  const handleSave = async () => {
    if (!canSave) return;
    try {
      setLoading(true);
      const res =  await issueBook({
        bookId: selectedBook.id,
        cardId: selectedCard.id,
      });
      if (res.success === true || res.status === 200) {
        Alert.alert(t("success"), t("issueSaved"));
        if (initialMode === "pickCard") navigation.navigate("BookScreen");
        else if (initialMode === "pickBook") navigation.navigate("LibraryCardScreen");
        else {
          // pickBookFirst — можно вернуть на список книг
          navigation.navigate("BookScreen");
        }
      } else {
        Alert.alert(t("error"), res?.error || t("failedToSave"));
      }
    } catch (err) {
      console.error(err);
      Alert.alert(t("error"), t("failedToSave"));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (initialMode === "pickCard") navigation.navigate("BookScreen");
    else if (initialMode === "pickBook") navigation.navigate("LibraryCardScreen");
    else navigation.navigate("BookScreen"); // pickBookFirst
  };

  // Рендер мини-элемента списка книг
  const BookMini = ({ item, selected }) => (
    <Pressable
      onPress={() => handlePick(item)}
      style={[styles.miniCard, selected && styles.miniSelected]}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.miniTitle}>{item.nameBook}</Text>
        <Text style={styles.miniSub}>№ {item.serial}</Text>
      </View>
      <Ionicons name="enter-outline" size={18} />
    </Pressable>
  );

  // Рендер мини-элемента списка карт
  const CardMini = ({ item, selected }) => (
    <Pressable
      onPress={() => handlePick(item)}
      style={[styles.miniCard, selected && styles.miniSelected]}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.miniTitle}>
          {item.firstName} {item.lastName}
        </Text>
        {item.login && <Text style={styles.miniSub}>{item.login}</Text>}
      </View>
      <Ionicons name="person-add-outline" size={18} />
    </Pressable>
  );

  return (
    <Layout>
      <View style={styles.container}>
        {/* Верх — карточка книги */}
        <View style={[styles.topCard, selectedBook && styles.topCardActive]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.topLabel}>{t("book")}</Text>
            {selectedBook ? (
              <>
                <Text style={styles.topTitle}>{selectedBook.nameBook}</Text>
                <Text style={styles.topSub}>№ {selectedBook.serial}</Text>
              </>
            ) : (
              <Text style={styles.topPlaceholder}>{t("bookNotSelected")}</Text>
            )}
          </View>
          {/* крестик показываем, если книгу можно менять:
              - не была зафиксирована из route.params (book отсутствует)
              - и она выбрана */}
          {!book && selectedBook && (
            <Pressable onPress={clearPick} style={styles.clearBtn}>
              <Ionicons name="close" size={18} color="#E63946" />
            </Pressable>
          )}
        </View>

        {/* Верх — карточка библиотечной карты */}
        <View style={[styles.topCard, selectedCard && styles.topCardActive]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.topLabel}>{t("card")}</Text>
            {selectedCard ? (
              <>
                <Text style={styles.topTitle}>
                  {selectedCard.firstName} {selectedCard.lastName}
                </Text>
                {selectedCard.login && (
                  <Text style={styles.topSub}>{selectedCard.login}</Text>
                )}
              </>
            ) : (
              <Text style={styles.topPlaceholder}>{t("cardNotSelected")}</Text>
            )}
          </View>
          {/* крестик показываем, если карту можно менять:
              - не была зафиксирована из route.params (card отсутствует)
              - и она выбрана */}
          {!card && selectedCard && (
            <Pressable onPress={clearPick} style={styles.clearBtn}>
              <Ionicons name="close" size={18} color="#E63946" />
            </Pressable>
          )}
        </View>

        {/* Поиск + список — только пока идёт выбор */}
        {showPicker && (
          <>
            <View style={styles.searchRow}>
              <Ionicons name="search-outline" size={18} color="#888" />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder={
                  needListType === "cards"
                    ? t("searchCards")
                    : t("searchBooks")
                }
                style={styles.searchInput}
                placeholderTextColor="#999"
              />
              {query ? (
                <Pressable onPress={() => setQuery("")}>
                  <Ionicons name="close-circle" size={18} color="#bbb" />
                </Pressable>
              ) : null}
            </View>

            <View style={styles.listBox}>
              {loading ? (
                <ActivityIndicator />
              ) : filtered.length === 0 ? (
                <Text style={styles.emptyText}>{t("nothingFound")}</Text>
              ) : (
                <FlatList
                  data={filtered}
                  keyExtractor={(it) => String(it.id)}
                  renderItem={({ item }) =>
                    needListType === "cards" ? (
                      <CardMini
                        item={item}
                        selected={selectedCard?.id === item.id}
                      />
                    ) : (
                      <BookMini
                        item={item}
                        selected={selectedBook?.id === item.id}
                      />
                    )
                  }
                  ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                />
              )}
            </View>
          </>
        )}

        {/* Низ — кнопки */}
        <View style={styles.footer}>
          <Pressable
            style={[styles.btn, styles.btnCancel]}
            onPress={handleCancel}
            disabled={loading}
          >
            <Text style={styles.btnText}>{t("cancel")}</Text>
          </Pressable>

          <Pressable
            style={[styles.btn, canSave ? styles.btnSave : styles.btnDisabled]}
            onPress={canSave ? handleSave : undefined}
            disabled={!canSave || loading}
          >
            <Text style={styles.btnText}>{t("save")}</Text>
          </Pressable>
        </View>
      </View>
    </Layout>
  );
};

export default EnterBookScreen;