import React, { useState } from "react";
import { Text, FlatList, RefreshControl, View } from "react-native";
import Layout from "@/components/Layout";
import DailyReadingPlan from "@/components/bible/dailyReadingPlan/DailyReadingPlan";
import PrayerCard from "@/components/prayerCard/PrayerCard";
import VerseDayCard from "@/components/bible/verseDayCard/VerseDayCard";
import styles from "./WelcomeScreenStyles";
import { useTranslation } from "react-i18next";
const WelcomeScreen = () => {
    const { t, i18n } = useTranslation("welcomeScreen");
  
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshKey((prev) => prev + 1);
      setRefreshing(false);
    }, 1000);
  };

  const data = [
    {
      key: "title",
      render: () => (
        <Text style={styles.title}>
          {t("title")}
          {"\n Church River of Life!"}
        </Text>
      ),
    },
    { key: "verse", render: () => <VerseDayCard refreshKey={refreshKey} /> },
    { key: "dailyPlan", render: () => <DailyReadingPlan /> },
    { key: "prayer", render: () => <PrayerCard refreshKey={refreshKey} /> },
  ];

  return (
    <Layout>
      <FlatList
        data={data}
        renderItem={({ item }) => <View>{item.render()}</View>}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </Layout>
  );
};

export default WelcomeScreen;
