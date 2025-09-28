// VerseDayCard.jsx
import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import styles from "./VerseDayCardStyles";
import { FontAwesome } from "@expo/vector-icons";
import DataLoaderWrapper from "@/components/DataLoaderWrapper";
import { useUser } from "@/context/UserContext";
import { useReviewerGuard } from "@/hooks/useReviewerGuard";
import i18n from "@/i18n/";
import { getVerseOfTheDay } from "@/api/bibleAPI";
import SetDayVerse from "@/components/bible/setDayVerse/SetDayVerse";
import { useTranslation } from "react-i18next";

const VerseCard = ({ refreshKey }) => {   // 🔹 добавляем проп
  const [verseDayData, setVerseDayData] = useState([]);
  const [loadingVerseDay, setLoadingVerseDay] = useState(false);
  const [showSetVerseModal, setShowSetVerseModal] = useState(false);
  const { isVerseOfDayEditor } = useUser();
  const guard = useReviewerGuard();
  const title = i18n.language === "ru" ? "Стих Дня" : "Verse of the Day";
  const langVerse = i18n.language === "ru" ? "verseRu" : "verseEn";

  const { t } = useTranslation("common");

  const verseDay = () => {
    setLoadingVerseDay(true);
    getVerseOfTheDay()
      .then((res) => setVerseDayData(res))
      .finally(() => setLoadingVerseDay(false));
  };

  // 🔹 Первичная загрузка
  useEffect(() => {
    verseDay();
  }, []);

  // 🔹 Перезагрузка при изменении refreshKey
  useEffect(() => {
    if (refreshKey > 0) {
      verseDay();
    }
  }, [refreshKey]);

  return (
    <>
      <View style={styles.verseContainer}>
        {isVerseOfDayEditor && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => guard(() => setShowSetVerseModal(true))}
          >
            <FontAwesome name="pencil" size={20} color="rgba(3, 86, 9, 0.7)" />
          </TouchableOpacity>
        )}
        <Text style={styles.sectionTitle}>{title}</Text>
        <DataLoaderWrapper
          loading={loadingVerseDay}
          data={verseDayData}
          onRetry={verseDay}
        >
          <View style={styles.card}>
            <Text style={styles.verse}>
              {verseDayData?.[langVerse]?.verses}
            </Text>
            <Text style={styles.reference}>
              {verseDayData?.[langVerse]?.info}
            </Text>
          </View>
        </DataLoaderWrapper>
      </View>

      <Modal visible={showSetVerseModal} animationType="slide">
        <View style={{ flex: 1, paddingTop: 40 }}>
          <SetDayVerse
            onClose={() => setShowSetVerseModal(false)}
            reLoad={verseDay}
          />
          <Pressable
            onPress={() => setShowSetVerseModal(false)}
            style={{
              padding: 10,
              backgroundColor: "#eee",
              alignItems: "center",
            }}
          >
            <Text>{t("buttonClose")}</Text>
          </Pressable>
        </View>
      </Modal>
    </>
  );
};
export default VerseCard;