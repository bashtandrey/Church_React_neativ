import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import Layout from "@/components/Layout";
// import styles from "./EventsChurchStyles";
// import i18n from "@/i18n/";
// import Toast from "react-native-toast-message";
// import { fetchUsers } from "@/api/userAPI";
// import { useUser } from "@/context/UserContext";
// import { useReviewerGuard } from "@/hooks/useReviewerGuard";
// import { useTranslation } from "react-i18next";
import { Calendar } from "react-native-calendars";
// import dayjs from "dayjs";
// import { getEventsByDate, getEventsByRange, monthRange } from "@/api/eventsAPI";
// const EventCard = ({ item }) => (
//   <View
//     style={{
//       padding: 12,
//       borderRadius: 12,
//       backgroundColor: "#fff",
//       marginBottom: 10,
//     }}
//   >
//     <Text style={{ fontWeight: "600", fontSize: 16 }}>{item.title}</Text>
//     {item.description ? (
//       <Text style={{ marginTop: 4, color: "#555" }}>{item.description}</Text>
//     ) : null}
//     <Text style={{ marginTop: 8, fontSize: 12, color: "#888" }}>
//       {dayjs(item.eventDate).format("DD MMM YYYY")}
//     </Text>
//   </View>
// );

const EventsChurch = () => {
//   const { isMember } = useUser();
//   const guard = useReviewerGuard();
//   const { t } = useTranslation("eventsChurch");
//   const today = dayjs().format("YYYY-MM-DD");

//   const [selected, setSelected] = useState(today);

//   const [dayEvents, setDayEvents] = useState([]);
//   const [loadingDay, setLoadingDay] = useState(false);

//   const [marked, setMarked] = useState({});
//   const [loadingMonth, setLoadingMonth] = useState(false);

//   const markDates = (datesSet, selectedDate) => {
//     const m = {};
//     // точки на дни, где есть события
//     datesSet.forEach((d) => {
//       m[d] = { ...(m[d] || {}), marked: true, dots: [{ key: "e" }] };
//     });
//     // выделение выбранного дня
//     m[selectedDate] = {
//       ...(m[selectedDate] || {}),
//       selected: true,
//       selectedColor: "#2e7d32",
//     };
//     return m;
//   };

//   const loadDay = async (dateISO) => {
//     setLoadingDay(true);
//     try {
//       const data = await getEventsByDate(dateISO);
//       setDayEvents(Array.isArray(data) ? data : []);
//     } catch {
//       setDayEvents([]);
//     } finally {
//       setLoadingDay(false);
//     }
//   };

//   const loadMonth = async (anchorISO) => {
//     setLoadingMonth(true);
//     try {
//       const { from, to } = monthRange(anchorISO);
//       const monthData = await getEventsByRange(from, to);
//       const datesWithEvents = new Set(
//         (Array.isArray(monthData) ? monthData : []).map((e) => e.eventDate)
//       );
//       setMarked(markDates(datesWithEvents, selected));
//     } catch {
//       setMarked(markDates(new Set(), selected));
//     } finally {
//       setLoadingMonth(false);
//     }
//   };

//   useEffect(() => {
//     // начальная загрузка: выбранный день + метки месяца
//     loadDay(selected);
//     loadMonth(selected);
//   }, []);
//   const onDayPress = (d) => {
//     const iso = d.dateString; // 'YYYY-MM-DD'
//     setSelected(iso);
//     loadDay(iso);
//     // обновим выделение (не трогаем остальное)
//     setMarked((prev) => ({
//       ...(prev || {}),
//       [iso]: {
//         ...(prev?.[iso] || {}),
//         selected: true,
//         selectedColor: "#2e7d32",
//       },
//       ...(selected !== iso && prev?.[selected]
//         ? { [selected]: { ...prev[selected], selected: false } }
//         : {}),
//     }));
//   };
//   const onMonthChange = (d) => {
//     // d: {year, month} // берём 1-е число месяца
//     const iso = dayjs(
//       `${d.year}-${String(d.month).padStart(2, "0")}-01`
//     ).format("YYYY-MM-DD");
//     loadMonth(iso);
//   };

return (
    <Layout>
      <View style={{ flex: 1, padding: 12, backgroundColor: "#f6f7f9" }}>
        {/* <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 8 }}> */}
          {/* {t("title", "События церкви")} */}
        {/* </Text> */}

        <Calendar
        //   current={selected}
        //   onDayPress={onDayPress}
        //   onMonthChange={onMonthChange}
        //   markedDates={marked}
        //   markingType="multi-dot"
        //   theme={{
            // arrowColor: "#2e7d32",
            // todayTextColor: "#2e7d32",
            // selectedDayBackgroundColor: "#2e7d32",
            // selectedDayTextColor: "#fff",
        //   }}
        />

        {/* <View style={{ marginTop: 12, flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: "600" }}>
              {t("eventsOn", { defaultValue: "События на", date: dayjs(selected).format("DD MMMM YYYY") })}{" "}
              {dayjs(selected).format("DD MMMM YYYY")}
            </Text>
            {loadingDay ? <ActivityIndicator style={{ marginLeft: 8 }} /> : null}
          </View>

          {loadingMonth && (
            <Text style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>
              {t("updatingMonth", "Обновляю метки месяца…")}
            </Text>
          )}

          <FlatList
            data={dayEvents}
            keyExtractor={(x) => String(x.id)}
            renderItem={({ item }) => <EventCard item={item} />}
            ListEmptyComponent={
              !loadingDay ? (
                <View style={{ padding: 16, alignItems: "center" }}>
                  <Text style={{ color: "#777" }}>{t("noEvents", "Событий нет")}</Text>
                </View>
              ) : null
            }
            contentContainerStyle={{ paddingBottom: 24 }}
          />
        </View> */}
      </View>
    </Layout>
  );
};

export default EventsChurch;