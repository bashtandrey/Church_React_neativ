import React from "react";
import { Text, ScrollView } from "react-native";
import Layout from "@/components/Layout";
import DailyReadingPlan from "@/components/bible/dailyReadingPlan/DailyReadingPlan";
import PrayerCard from "@/components/prayerCard/PrayerCard";
import VerseDayCard from "@/components/bible/verseDayCard/VerseDayCard";
import styles from "./WelcomeScreenStyles";
import i18n from "@/i18n/";

const WelcomeScreen = () => {
  const title = i18n.language === "ru" ? "Добро пожаловать!" : "Welcome!";
  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>
          {title}
          {"\n Church River of Life!"}
        </Text>
        <VerseDayCard />
        <DailyReadingPlan />
        <PrayerCard />
      </ScrollView>
    </Layout>
  );
};

export default WelcomeScreen;
