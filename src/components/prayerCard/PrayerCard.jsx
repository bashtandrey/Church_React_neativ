import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, Pressable } from "react-native";
import styles from "./PrayerCardStyles";
import DataLoaderWrapper from "@/components/DataLoaderWrapper";
import { useReviewerGuard } from "@/hooks/useReviewerGuard";
import { getWeeklyPrayer } from "@/api/prayerCardAPI";
import SetPrayerCard from "@/components/prayerCard/SetPrayerCard";
import { useUser } from "@/context/UserContext";
import { FontAwesome } from "@expo/vector-icons";

export default function PrayerCard() {
  const [prayerCard, setPrayerCard] = useState([]);
  const [loadingPrayerCard, setloadingPrayerCard] = useState(false);

  const [showPrayerCardModal, setShowPrayerCardModall] = useState(false);
  const guard = useReviewerGuard();
  const { isPrayerCardEditor } = useUser();

  const updatePrayerCard = () => {
    setloadingPrayerCard(true);
    getWeeklyPrayer()
      .then((res) => setPrayerCard(res))
      .finally(() => setloadingPrayerCard(false));
  };
  useEffect(() => {
    updatePrayerCard();
  }, []);

  return (
    <View style={styles.verseContainer}>
      <Text style={styles.greeting}>{prayerCard.greeting}</Text>
      {isPrayerCardEditor && (
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => guard(() => setShowPrayerCardModall(true))}
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
            <Text key={index} 
            style={styles.family}
            >
              • {family}
            </Text>
          ))}
          <Text style={styles.blessing}>{prayerCard.blessingMessage}</Text>
          <Text style={styles.quote}>{prayerCard.bibleVerse}</Text>
          <Text style={styles.source}>{prayerCard.bibleReference}</Text>
        </DataLoaderWrapper>
      </View>

      <Modal visible={showPrayerCardModal} animationType="slide">
        <View style={{ flex: 1, paddingTop: 40 }}>
          <SetPrayerCard
            prayerCard={prayerCard}
            onRetry={() => updatePrayerCard()}
            onClose={() => setShowPrayerCardModall(false)}
          />
          <Pressable
            onPress={() => setShowPrayerCardModall(false)}
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
