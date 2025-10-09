import React, { useMemo, useState } from "react";
import { View, Text, Pressable } from "react-native";
import EntryCard from "./EntryCard";
import styles, { COLORS } from "@/screens/church/donateScreens/DonationEntryStyles";
import { useTranslation } from "react-i18next";

const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
};

const EntryListByMembers = ({ entries }) => {
  const [selected, setSelected] = useState(null);
  const { t } = useTranslation("donateScreen");

  // 🔹 группировка по memberId
  const grouped = useMemo(() => {
    const map = {};
    entries.forEach((e) => {
      const key = e.memberId || "NO_MEMBER";
      if (!map[key]) {
        map[key] = { memberName: e.memberName || t("noMembers"), list: [] };
      }
      map[key].list.push(e);
    });

    // считаем сумму только INCOME
    Object.values(map).forEach((group) => {
      group.incomeTotal = group.list
        .filter((e) => e.type === "INCOME")
        .reduce((sum, e) => sum + Number(e.amount || 0), 0);
    });

    return map;
  }, [entries, t]);

  if (selected) {
    const group = grouped[selected];

    // 🔹 внутри группы — сортировка и группировка по датам
    const groupedByDate = group.list.reduce((acc, e) => {
      const dateKey = formatDate(e.createdAt);
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(e);
      return acc;
    }, {});
    const sortedDates = Object.keys(groupedByDate).sort(
      (a, b) => new Date(b) - new Date(a)
    );

    return (
      <View>
        <Text style={styles.subTitle}>
          {group.memberName}{" "}
          <Text style={{ color: COLORS.success }}>
            +{group.incomeTotal.toFixed(2)} $
          </Text>
        </Text>

        {sortedDates.map((date) => (
          <View key={date} style={{ marginBottom: 12 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: COLORS.primary,
                marginLeft: 12,
                marginVertical: 6,
              }}
            >
              {date}
            </Text>
            {groupedByDate[date].map((e) => (
              <EntryCard key={e.id} entry={e} />
            ))}
          </View>
        ))}

        <Pressable onPress={() => setSelected(null)} style={styles.backBtn}>
          <Text style={styles.backBtnText}>{t("back")}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View>
      {Object.entries(grouped).map(([id, group]) => (
        <Pressable
          key={id}
          onPress={() => setSelected(id)}
          style={styles.memberRow}
        >
          <Text style={styles.memberName}>{group.memberName}</Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {/* 🔹 количество записей */}
            <Text style={styles.memberCount}>
              {group.list.length} {t("records")}
            </Text>
            {/* 🔹 сумма приходов */}
            <Text style={{ color: COLORS.success, fontWeight: "600" }}>
              +{group.incomeTotal.toFixed(2)} $
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
};

export default EntryListByMembers;