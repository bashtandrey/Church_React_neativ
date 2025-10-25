import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Pressable,
  Alert,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import EventsChurchCard from "@/components/eventsChurch/EventsChurchCard";
import Toast from "react-native-toast-message";
import {
  eachDayOfInterval,
  parse,
  isWithinInterval,
  isSameMonth,
} from "date-fns";
import Layout from "@/components/Layout";
import { Ionicons } from "@expo/vector-icons";
import { useReviewerGuard } from "@/hooks/useReviewerGuard";
import styles from "./EventsChurchScreenStyles";
import { useTranslation } from "react-i18next";
import { useUser } from "@/context/UserContext";
import {
  fetchAllEvents,
  saveEventChurch,
  deleteEvent,
} from "@/api/eventsChurchAPI";
import ModalTrigger from "@/components/common/ModalTrigger";
import SaveEvenetChurchModal from "@/components/eventsChurch/modal/SaveEvenetChurchModal";
import DataLoaderWrapper from "@/components/DataLoaderWrapper";

const EventsChurchScreen = () => {
  const { t, i18n } = useTranslation("eventsChurch");
  const guard = useReviewerGuard();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { isMember, isEventsChurchEditor } = useUser();

  const handleCreateSubmit = async ({ data }) => {
    const response = await saveEventChurch(data);
    if (response?.ok) {
      loadData();
      Toast.show({ type: "success", text1: "Готово", text2: t("eventSave") });
    }
  };

  const onDeleteEvent = (event) => {
    Alert.alert(event.title, t("deleteConfirm"), [
      { text: "Отмена", style: "cancel" },
      {
        text: "Удалить",
        style: "destructive",
        onPress: async () => {
          try {
            const resp = await deleteEvent(event.id);
            if (!resp?.ok) throw new Error("Не удалось удалить");
            loadData();
            Toast.show({
              type: "info",
              text1: "Event deleted",
              position: "top",
            });
          } catch (e) {
            Toast.show({
              type: "error",
              text1: "Event deletion failed",
              text2: e.message,
              position: "top",
            });
          }
        },
      },
    ]);
  };

  // синхронизация календаря с i18n
  useEffect(() => {
    const cal = t("calendar", { returnObjects: true });
    LocaleConfig.locales[i18n.language.startsWith("ru") ? "ru" : "en"] = cal;
    LocaleConfig.defaultLocale = i18n.language.startsWith("ru") ? "ru" : "en";
  }, [i18n.language, t]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchAllEvents();
      setEvents(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isMember) {
      loadData();
    }
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // отмеченные даты
  const markedDates = useMemo(() => {
    let dates = {};

    events.forEach((e) => {
      if (e?.startEventDate && e?.endEventDate) {
        try {
          const interval = eachDayOfInterval({
            start: parse(e.startEventDate, "MM/dd/yyyy", new Date()),
            end: parse(e.endEventDate, "MM/dd/yyyy", new Date()),
          });
          interval.forEach((day) => {
            const key = day.toISOString().split("T")[0];
            dates[key] = {
              ...(dates[key] || {}),
              marked: true,
              dotColor: "blue",
            };
          });
        } catch (err) {
          console.warn("Invalid event date:", e, err);
        }
      }
    });

    if (selectedDate) {
      dates[selectedDate] = {
        ...(dates[selectedDate] || {}),
        selected: true,
        selectedColor: "#007bff",
        marked: true,
        dotColor: "blue",
      };
    }

    return dates;
  }, [events, selectedDate]);

  // список для отображения
  const eventsForList = useMemo(() => {
    if (selectedDate) {
      return events.filter((e) => {
        if (!e.startEventDate || !e.endEventDate) return false;
        return isWithinInterval(parse(selectedDate, "yyyy-MM-dd", new Date()), {
          start: parse(e.startEventDate, "MM/dd/yyyy", new Date()),
          end: parse(e.endEventDate, "MM/dd/yyyy", new Date()),
        });
      });
    } else {
      return events.filter((e) => {
        if (!e.startEventDate) return false;
        return isSameMonth(
          parse(e.startEventDate, "MM/dd/yyyy", new Date()),
          currentMonth
        );
      });
    }
  }, [events, selectedDate, currentMonth]);

  return (
    <Layout title={t("title")}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* кнопка создания */}
        {isEventsChurchEditor && (
          <ModalTrigger
            opener={(open) => (
              <View style={styles.headerContainer}>
                <Pressable
                  style={styles.createButton}
                  onPress={() => guard(open)}
                >
                  <Ionicons
                    name="add-circle-outline"
                    size={24}
                    color="#007AFF"
                  />
                  <Text style={styles.createText}>{t("createButton")}</Text>
                </Pressable>
              </View>
            )}
          >
            {({ close }) => (
              <SaveEvenetChurchModal
                visible
                onClose={close}
                onSubmit={handleCreateSubmit}
              />
            )}
          </ModalTrigger>
        )}
        {isMember ? (
          <DataLoaderWrapper loading={loading} data={events} onRetry={loadData}>

            <Calendar
              onDayPress={(day) => setSelectedDate(day.dateString)}
              onMonthChange={(month) => {
                setCurrentMonth(new Date(month.dateString));
                setSelectedDate(null);
              }}
              markedDates={markedDates}
              theme={{
                todayTextColor: "#007bff",
                selectedDayBackgroundColor: "#007bff",
              }}
            />

            {/* список */}
            <Text style={{ fontSize: 16, marginTop: 10, fontWeight: "600" }}>
              {selectedDate
                ? `${t("title")} - ${selectedDate}`
                : `${t("title")} (${currentMonth.toLocaleDateString(
                    i18n.language,
                    {
                      month: "long",
                      year: "numeric",
                    }
                  )})`}
            </Text>

            {eventsForList.length > 0 ? (
              eventsForList.map((item) => (
                <ModalTrigger
                  key={item.id}
                  opener={(open) => (
                    <EventsChurchCard
                      event={item}
                      onEdit={() => guard(open)} // при нажатии "редактировать" открываем модалку
                      onDelete={() => onDeleteEvent(item)}
                      isEditor={isEventsChurchEditor}
                    />
                  )}
                >
                  {({ close }) => (
                    <SaveEvenetChurchModal
                      visible
                      onClose={close}
                      event={item} // передаём сюда event
                      onSubmit={handleCreateSubmit}
                    />
                  )}
                </ModalTrigger>
              ))
            ) : (
              <Text style={{ marginTop: 10 }}>{t("noEvents")}</Text>
            )}
          </DataLoaderWrapper>
        ) : (
          <View style={styles.container2}>
            <Text style={styles.text}>
              {t("notAuthenticated")}
            </Text>
          </View>
        )}
      </ScrollView>
    </Layout>
  );
};

export default EventsChurchScreen;
