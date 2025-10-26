import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  LayoutAnimation,
  Platform,
  UIManager,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./BookCardStyle";
import { useUser } from "@/context/UserContext";
import { useTranslation } from "react-i18next";
import ModalTrigger from "@/components/common/ModalTrigger";
import SaveBookModal from "@/components/library/book/modal/saveBookModal/SaveBookModal";
import { deleteBook } from "@/api/libraryAPI";
import { useNavigation } from "@react-navigation/native";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const BookCard = ({ bookdata, reLoad }) => {
  const [expanded, setExpanded] = useState(false);
  const isIssued = bookdata.issued;
  const holder = bookdata.holder;
  const { isLibrarryEditor, isLibrarryAdmin } = useUser();
  const { t } = useTranslation("bookScreen");
  const navigation = useNavigation();

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const handelDelete = (bookData) => {
    Alert.alert(
      t("bookCard.alert.delete.title"), // Заголовок
      t("bookCard.alert.delete.message", { name: bookData.nameBook }), // Сообщение
      [
        {
          text: t("bookCard.alert.delete.cancel"),
          style: "cancel",
        },
        {
          text: t("bookCard.alert.delete.confirm"),
          onPress: () => {
            deleteBook(bookData.id);
            reLoad();
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <Pressable
      onPress={toggleExpand}
      style={[styles.card, isIssued && styles.cardIssued]}
    >
      {/* 🔹 Заголовок */}
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
            {isIssued
              ? t("bookCard.status.issued")
              : t("bookCard.status.available")}
          </Text>
        </View>
      </View>

      {/* 🔹 Индикатор разворота */}
      {(isLibrarryEditor || isLibrarryAdmin) && (
        <>
          <View style={{ alignItems: "center" }}>
            <Ionicons
              name={expanded ? "chevron-up-outline" : "chevron-down-outline"}
              size={20}
              color="#666"
            />
          </View>

          {expanded && (
            <View style={styles.infoBlock}>
              <Text style={styles.textSmall}>
                {t("bookCard.field.publishingHouse")}:{" "}
                <Text style={styles.textBold}>
                  {bookdata.publishingHouse || "—"}
                </Text>
              </Text>

              <Text style={styles.textSmall}>
                {t("bookCard.field.year")}:{" "}
                <Text style={styles.textBold}>
                  {bookdata.publishingYear || "—"}
                </Text>
              </Text>

              {bookdata.description ? (
                <Text style={styles.textDescription}>
                  {bookdata.description}
                </Text>
              ) : null}

              {isIssued && holder && (
                <Text style={styles.holderText}>
                  📘 {t("bookCard.field.holder")}:{" "}
                  <Text style={styles.textBold}>
                    {holder.firstName} {holder.lastName}
                  </Text>
                </Text>
              )}

              {/* 🔹 Кнопки действий */}
              <View style={styles.actionRow}>
                {isLibrarryEditor && (
                  <>
                    {isIssued ? (
                      <Pressable
                        style={styles.actionBtn}
                        onPress={() =>
                          navigation.navigate("ReturnBook", {
                            book: bookdata,
                          })
                        }
                      >
                        <Ionicons
                          name="exit-outline"
                          size={20}
                          color="#06D6A0"
                        />
                      </Pressable>
                    ) : (
                      <Pressable
                        style={styles.actionBtn}
                        onPress={() =>
                          navigation.navigate("EnterBook", {
                            book: bookdata,
                          })
                        }
                      >
                        <Ionicons
                          name="enter-outline"
                          size={20}
                          color="#118AB2"
                        />
                      </Pressable>
                    )}
                    <Pressable
                      style={styles.actionBtn}
                      onPress={() =>
                        navigation.navigate("BookHistory", {
                          bookId: bookdata.id,
                        })
                      }
                    >
                      <Ionicons name="time-outline" size={20} color="#8E8E93" />
                    </Pressable>
                  </>
                )}
                {isLibrarryAdmin && (
                  <>
                    <ModalTrigger
                      opener={(open) => (
                        <Pressable style={styles.actionBtn} onPress={open}>
                          <Ionicons
                            name="create-outline"
                            size={20}
                            color="#007AFF"
                          />
                        </Pressable>
                      )}
                    >
                      {({ close }) => (
                        <SaveBookModal
                          visible
                          book={bookdata}
                          onClose={close}
                          reLoad={reLoad}
                        />
                      )}
                    </ModalTrigger>
                    <Pressable
                      style={styles.actionBtn}
                      onPress={() => handelDelete(bookdata)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color="#FF3B30"
                      />
                    </Pressable>
                  </>
                )}
              </View>
            </View>
          )}
        </>
      )}
    </Pressable>
  );
};

export default BookCard;
