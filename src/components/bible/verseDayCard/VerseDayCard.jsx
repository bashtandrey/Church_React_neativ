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

const VerseCard = () => {
  const [verseDayData, setVerseDayData] = useState(null);
  const [loadingVerseDay, setLoadingVerseDay] = useState(false);
  const [showSetVerseModal, setShowSetVerseModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const { isVerseOfDayEditor } = useUser();
  const guard = useReviewerGuard();
  const { t } = useTranslation("common");

  const title = i18n.language === "ru" ? "Стих Дня" : "Verse of the Day";
  const langVerse = i18n.language === "ru" ? "verseRu" : "verseEn";

  const verseDay = async () => {
    setLoadingVerseDay(true);
    try {
      const res = await getVerseOfTheDay();
      // ⚡️ создаём новый объект, чтобы гарантировать rerender
      setVerseDayData({ ...res });
    } catch (e) {
      console.log("Ошибка загрузки стиха дня", e);
    } finally {
      setLoadingVerseDay(false);
    }
  };

  // 🔹 Первичная загрузка
  useEffect(() => {
    verseDay();
  }, []);

  // 🔹 Принудительная перезагрузка при refreshKey
  useEffect(() => {
    verseDay();
  }, [refreshKey]);

  // 🔹 коллбек для обновления
  const handleReload = () => {
    setShowSetVerseModal(false);
    setTimeout(() => setRefreshKey((k) => k + 1), 400);
  };

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
          {verseDayData && (
            <View style={styles.card}>
              {Array.isArray(verseDayData?.[langVerse]?.verses) ? (
                verseDayData[langVerse].verses.map((line, i) => (
                  <Text key={i} style={styles.verse}>
                    {line}
                  </Text>
                ))
              ) : (
                <Text style={styles.verse}>
                  {verseDayData?.[langVerse]?.verses}
                </Text>
              )}
              <Text style={styles.reference}>
                {verseDayData?.[langVerse]?.info}
              </Text>
            </View>
          )}
        </DataLoaderWrapper>
      </View>

      <Modal visible={showSetVerseModal} animationType="slide">
        <View style={{ flex: 1, paddingTop: 40 }}>
          <SetDayVerse
            onClose={() => setShowSetVerseModal(false)}
            reLoad={handleReload} // 🔁 теперь точно вызовет перерисовку
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