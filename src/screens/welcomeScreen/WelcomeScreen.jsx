import React, { useState } from "react";
import { Text, FlatList, RefreshControl, View } from "react-native";
import Layout from "@/components/Layout";
import DailyReadingPlan from "@/components/bible/dailyReadingPlan/DailyReadingPlan";
import PrayerCard from "@/components/prayerCard/PrayerCard";
import VerseDayCard from "@/components/bible/verseDayCard/VerseDayCard";
import styles from "./WelcomeScreenStyles";
import i18n from "@/i18n/";

const WelcomeScreen = () => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const title = i18n.language === "ru" ? "Добро пожаловать!" : "Welcome!";

  // Элементы списка
  const data = [
    { key: "title", render: () => (
        <Text style={styles.title}>
          {title}
          {"\n Church River of Life!"}
        </Text>
      )
    },
    { key: "verse", render: () => <VerseDayCard /> },
    { key: "dailyPlan", render: () => <DailyReadingPlan /> },
    { key: "prayer", render: () => <PrayerCard /> },
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