import { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import styles from "./PrayerCardStyles";
import DataLoaderWrapper from "@/components/DataLoaderWrapper";
import { useReviewerGuard } from "@/hooks/useReviewerGuard";
import { getWeeklyPrayer } from "@/api/prayerCardAPI";
import SetPrayerCard from "@/components/prayerCard/SetPrayerCard";
import { useUser } from "@/context/UserContext";
import { FontAwesome } from "@expo/vector-icons";
import ModalTrigger from "@/components/common/ModalTrigger";
import { useTranslation } from "react-i18next";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-toast-message";

export default function PrayerCard({ refreshKey }) {
  const [prayerCard, setPrayerCard] = useState([]);
  const [loadingPrayerCard, setLoadingPrayerCard] = useState(false);
  const guard = useReviewerGuard();
  const { isPrayerCardEditor } = useUser();
  const { t, i18n } = useTranslation("prayerCard");

  const updatePrayerCard = () => {
    setLoadingPrayerCard(true);
    getWeeklyPrayer()
      .then((res) => setPrayerCard(res))
      .finally(() => setLoadingPrayerCard(false));
  };

  useEffect(() => {
    updatePrayerCard();
  }, []);

  useEffect(() => {
    if (refreshKey > 0) {
      updatePrayerCard();
    }
  }, [refreshKey]);

  // 👇 копирование всей карточки
  const handleCopyToClipboard = async () => {
    if (!prayerCard) return;

    const parts = [];

    if (prayerCard.greeting) parts.push(prayerCard.greeting);
    if (prayerCard.header) parts.push(prayerCard.header);

    if (Array.isArray(prayerCard.familyList) && prayerCard.familyList.length) {
      parts.push(
        "Семьи:\n" + prayerCard.familyList.map((f) => `• ${f}`).join("\n")
      );
    }

    if (prayerCard.blessingMessage) {
      parts.push(prayerCard.blessingMessage);
    }

    if (prayerCard.bibleVerse) {
      if (Array.isArray(prayerCard.bibleVerse)) {
        parts.push(prayerCard.bibleVerse.join("\n"));
      } else {
        parts.push(prayerCard.bibleVerse);
      }
    }

    if (prayerCard.bibleReference) {
      parts.push(prayerCard.bibleReference);
    }

    const textToCopy = parts.join("\n\n");

    try {
      await Clipboard.setStringAsync(textToCopy);
      Toast.show({
        type: "success",
        text1: t("copySuccessTitle"),
        text2: t("copySuccessMessage"),
        position: "top",
      });
    } catch (e) {
      console.error("Clipboard error:", e);
      Toast.show({
        type: "error",
        text1: t("copyErrorTitle"),
        text2: t("copyErrorMessage"),
        position: "top",
      });
    }
  };

  return (
    <View style={styles.verseContainer}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{t("title")}</Text>

        {isPrayerCardEditor && (
          <View style={styles.iconRow}>
            {/* копия */}
            <Pressable
              onPress={handleCopyToClipboard}
              style={({ pressed }) => [
                styles.iconButton,
                styles.copyButton,
                pressed && styles.pressed,
              ]}
              android_ripple={{ color: "#e5e7eb", radius: 24 }}
            >
              <FontAwesome name="copy" size={20} color="rgba(3, 86, 9, 0.7)" />
            </Pressable>

            {/* редактирование */}
            <ModalTrigger
              opener={(open) => (
                <Pressable
                  onPress={() => guard(open)}
                  style={({ pressed }) => [
                    styles.iconButton,
                    pressed && styles.pressed,
                  ]}
                  android_ripple={{ color: "#e5e7eb", radius: 24 }}
                >
                  <FontAwesome
                    name="pencil"
                    size={20}
                    color="rgba(3, 86, 9, 0.7)"
                  />
                </Pressable>
              )}
            >
              {({ visible, close }) => (
                <SetPrayerCard
                  visible={visible}
                  onClose={close}
                  prayerCard={prayerCard}
                  onRetry={updatePrayerCard}
                />
              )}
            </ModalTrigger>
          </View>
        )}
      </View>
      <View style={styles.card}>
        {/* шапка карточки: титулка + кнопки справа */}

        <DataLoaderWrapper
          loading={loadingPrayerCard}
          data={prayerCard}
          onRetry={updatePrayerCard}
        >
          {/* greeting внутри карточки, адаптируется под контент */}
          <Text style={styles.greeting}>{prayerCard.greeting}</Text>

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
    </View>
  );
}
