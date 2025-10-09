import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, Pressable } from "react-native";
import styles from "./PrayerCardStyles";
import DataLoaderWrapper from "@/components/DataLoaderWrapper";
import { useReviewerGuard } from "@/hooks/useReviewerGuard";
import { getWeeklyPrayer } from "@/api/prayerCardAPI";
import SetPrayerCard from "@/components/prayerCard/SetPrayerCard";
import { useUser } from "@/context/UserContext";
import { FontAwesome } from "@expo/vector-icons";

export default function PrayerCard({ refreshKey }) {
  // 🔹 принимаем refreshKey
  const [prayerCard, setPrayerCard] = useState([]);
  const [loadingPrayerCard, setLoadingPrayerCard] = useState(false);
  const [showPrayerCardModal, setShowPrayerCardModal] = useState(false);
  const guard = useReviewerGuard();
  const { isPrayerCardEditor } = useUser();

  const updatePrayerCard = () => {
    setLoadingPrayerCard(true);
    getWeeklyPrayer()
      .then((res) => setPrayerCard(res))
      .finally(() => setLoadingPrayerCard(false));
  };
  console.log(prayerCard)

  // Первичная загрузка
  useEffect(() => {
    
    updatePrayerCard();
  }, []);

  // 🔹 Перезагрузка при изменении refreshKey
  useEffect(() => {
    if (refreshKey > 0) {
      updatePrayerCard();
    }
  }, [refreshKey]);

  return (
    <View style={styles.verseContainer}>
      <Text style={styles.greeting}>{prayerCard.greeting}</Text>
      {isPrayerCardEditor && (
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => guard(() => setShowPrayerCardModal(true))}
        >
          <FontAwesome name="pencil" size={20} color="rgba(3, 86, 9, 0.7)" />
        </TouchableOpacity>
      )}

      <View style={styles.card}>
        <DataLoaderWrapper
          loading={loadingPrayerCard}
          data={prayerCard}
          onRetry={updatePrayerCard}
        >
          <Text style={styles.text}>{prayerCard.header}</Text>
          {prayerCard.familyList?.map((family, index) => (
            <Text key={index} style={styles.family}>
              • {family}
            </Text>
          ))}
          <Text style={styles.blessing}>{prayerCard.blessingMessage}</Text>
          <View style={{ marginTop: 10 }}>
            {Array.isArray(prayerCard.bibleVerse) ? (
              prayerCard.bibleVerse.map((line, idx) => (
                <Text key={idx} style={styles.quote}>
                  {line}
                </Text>
              ))
            ) : (
              <Text style={styles.quote}>{prayerCard.bibleVerse}</Text>
            )}
            <Text style={styles.source}>{prayerCard.bibleReference}</Text>
          </View>
        </DataLoaderWrapper>
      </View>

      <Modal visible={showPrayerCardModal} animationType="slide">
        <View style={{ flex: 1, paddingTop: 40 }}>
          <SetPrayerCard
            prayerCard={prayerCard}
            onRetry={updatePrayerCard}
            onClose={() => setShowPrayerCardModal(false)}
          />
          <Pressable
            onPress={() => setShowPrayerCardModal(false)}
            style={{
              padding: 10,
              backgroundColor: "#eee",
              alignItems: "center",
            }}
          >
            <Text>Закрыть</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}
