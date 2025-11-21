import React, { useMemo } from "react";
import { View, Text } from "react-native";
import EntryCard from "./EntryCard.jsx";
import styles, { COLORS } from "@/screens/church/donateScreens/DonationEntryStyles";

// хелпер для форматирования в YYYY-MM-DD
const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toISOString().slice(0, 10); // "2025-10-03"
};

const EntryListTable = ({ entries,onRetry }) => {
  // 🔹 Группировка по дате
  const grouped = useMemo(() => {
    return entries.reduce((acc, e) => {
      const dateKey = formatDate(e.createdAt);
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(e);
      return acc;
    }, {});
  }, [entries]);

  // 🔹 Сортировка дат по убыванию (сначала новые)
  const sortedDates = useMemo(() => {
    return Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));
  }, [grouped]);

  return (
    <View>
      {sortedDates.map((date) => (
        <View key={date} style={{ marginBottom: 12 }}>
          {/* Заголовок даты */}
          <Text style={{ 
            fontSize: 16, 
            fontWeight: "700", 
            color: COLORS.primary, 
            marginLeft: 12, 
            marginVertical: 6 
          }}>
            {date}
          </Text>

          {/* Записи за эту дату */}
          {grouped[date].map((e) => (
            <EntryCard key={e.id} entry={e} onRetry={onRetry}/>
          ))}
        </View>
      ))}
    </View>
  );
};

export default EntryListTable;
