import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { getDailyPlan } from "@/api/bibleAPI";
import DataLoaderWrapper from "@/components/DataLoaderWrapper";
import styles from "./DailyReadingPlanStyles";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

const DailyReadingPlan = ({ reloadFlag }) => {
  const { t } = useTranslation("dailyReadingPlan");
  const [readingPlan, setReadingPlan] = useState([]);
  const [loadingPlan, setLoadingPlan] = useState(false);

  const loadReadingPlan = () => {
    setLoadingPlan(true);
    getDailyPlan()
      .then((res) => setReadingPlan(res))
      .finally(() => setLoadingPlan(false));
  };

  useEffect(() => {
    loadReadingPlan();
  }, [reloadFlag]);
  return (
    <View style={styles.verseContainer}>
      <Text style={styles.readingTitle}>
        {t("title")}
        {i18n.language == "ru" && readingPlan.dateRU}
        {i18n.language == "en" && readingPlan.dateEN}
        {i18n.language == "ua" && readingPlan.dateUA}
      </Text>
      <View style={styles.readingSection}>
        <DataLoaderWrapper
          loading={loadingPlan}
          data={readingPlan}
          onRetry={loadReadingPlan}
        >
          {i18n.language == "ru" && (
            <Text style={styles.readingPlan}>{readingPlan.descriptionRus}</Text>
          )}
          {i18n.language == "en" && (
            <Text style={styles.readingPlan}>{readingPlan.descriptionEng}</Text>
          )}
          {i18n.language == "ua" && (
            <Text style={styles.readingPlan}>{readingPlan.descriptionUA}</Text>
          )}
          <Text style={styles.readingNote}>{t("readingNote")}</Text>
        </DataLoaderWrapper>
      </View>
    </View>
  );
};

export default DailyReadingPlan;
