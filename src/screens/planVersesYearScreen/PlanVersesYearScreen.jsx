import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import Layout from "@/components/Layout";
import VerseCardPlan from "@/components/bible/verseCardPlan/VerseCardPlan";
import styles from "./PlanVersesYearScreenStyles";
import { getMonthPlan } from "@/api/bibleAPI";
import DailyReadingPlan from "@/components/bible/dailyReadingPlan/DailyReadingPlan";
import SetDayPlan from "@/components/bible/setDayPlan/SetDayPlan";
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
const parseLocalDate = (dateStr) => {
  const parts = dateStr.split("-");
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // месяцы 0-11
  const day = parseInt(parts[2], 10);
  return new Date(year, month, day);
};

// Получаем количество дней в месяце
const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

const PlanVersesYearScreen = () => {
  const { t } = useTranslation("planYearVerse");
  const months = i18n.language === "ru" ? monthShortRu : monthShortEN;
  const referens = i18n.language === "ru" ? "descriptionRus" : "descriptionEng";
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showVerseModal, setShowVerseModal] = useState(false);
  const handleOpenVerseModal = (day) => {
    setSelectedDay(day);
    setShowVerseModal(true);
  };
  const [reloadFlag, setReloadFlag] = useState(false);
  const triggerReload = () => setReloadFlag((prev) => !prev);

  const loadMonthPlan = (monthIndex) => {
    setLoading(true);
    const year = new Date().getFullYear();
    getMonthPlan(monthIndex + 1)
      .then((res) => {
        const grouped = res.reduce((acc, item) => {
          const date = parseLocalDate(item.readingDate);
          const day = date.getDate();

          if (!acc[day]) {
            acc[day] = [];
          }
          acc[day].push(item?.[referens]);
          return acc;
        }, {});

        const daysInMonth = getDaysInMonth(year, monthIndex);
        const result = [];
        for (let day = 1; day <= daysInMonth; day++) {
          result.push({
            day,
            versInfo: grouped[day] ? grouped[day].join("; ") : "",
          });
        }

        setVerses(result);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMonthPlan(selectedMonth);
  }, [selectedMonth]);

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

  return (
    <Layout>
      <ScrollView style={styles.container}>
        <View>
          <Text style={styles.title}>{t("title")}</Text>
        </View>
        <DailyReadingPlan reloadFlag={reloadFlag} />
        {/* Сетка месяцев */}
        <View style={styles.monthGrid}>
          {months.map((month, index) => renderMonth(month, index))}
        </View>

        {/* Контейнер плана на месяц */}
        <View style={styles.planContainer}>
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
        </View>
      </ScrollView>
      {showVerseModal && (
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
      )}
    </Layout>
  );
};

export default PlanVersesYearScreen;
