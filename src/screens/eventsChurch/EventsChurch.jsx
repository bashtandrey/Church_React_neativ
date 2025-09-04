import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import styles from "./EventsChurchStyles";

import Layout from "@/components/Layout";
// import styles from "./PlanVersesYearScreenStyles";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
const monthShortEN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const monthShortRu = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];
// Парсим строку даты YYYY-MM-DD в локальную дату без смещений
// const parseLocalDate = (dateStr) => {
//   const parts = dateStr.split("-");
//   const year = parseInt(parts[0], 10);
//   const month = parseInt(parts[1], 10) - 1; // месяцы 0-11
//   const day = parseInt(parts[2], 10);
//   return new Date(year, month, day);
// };

// Получаем количество дней в месяце
// const getDaysInMonth = (year, month) => {
//   return new Date(year, month + 1, 0).getDate();
// };
const renderMonth = (month, index) => (
  <TouchableOpacity
    key={index}
    onPress={() => setSelectedMonth(index)}
    style={[
      styles.monthButton,
      selectedMonth === index && styles.monthButtonSelected,
    ]}
  >
    <Text
      style={[
        styles.monthText,
        selectedMonth === index && styles.monthTextSelected,
      ]}
    >
      {month}
    </Text>
  </TouchableOpacity>
);
const EventsChurch = () => {
  const { t } = useTranslation("eventsChurch");
  const months = i18n.language === "ru" ? monthShortRu : monthShortEN;
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  // const [showVerseModal, setShowVerseModal] = useState(false);


  return (
    <Layout>
      <ScrollView style={styles.container}>
        <View>
          <Text style={styles.title}>{t("title")}</Text>
        </View>
        {/* <DailyReadingPlan reloadFlag={reloadFlag} /> */}
        {/* Сетка месяцев */}
        <View style={styles.monthGrid}>
          {months.map((month, index) => renderMonth(month, index))}
        </View>

        {/* Контейнер плана на месяц */}
        {/* <View style={styles.planContainer}>
          <Text style={styles.planTitle}>
            {t("planTitle")} {months[selectedMonth]}
          </Text>
          {loading ? (
            <Text>Loading...</Text>
          ) : (
            <FlatList
              data={verses}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <VerseCardPlan
                  day={item.day}
                  versInfo={item.versInfo}
                  onAction={handleOpenVerseModal}
                />
              )}
              scrollEnabled={false}
            />
          )}
        </View> */}
      </ScrollView>
      {/* {showVerseModal && (
        <Modal visible={showVerseModal} animationType="slide">
          <View style={{ flex: 1, paddingTop: 40 }}>
            <SetDayPlan day={selectedDay} month={selectedMonth + 1} />
            <Pressable
              onPress={() => {
                setShowVerseModal(false);
                loadMonthPlan(selectedMonth);
                triggerReload();
              }}
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
      )} */}
    </Layout>
  );
};

export default EventsChurch;
