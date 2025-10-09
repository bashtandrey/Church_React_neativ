import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles, { COLORS } from "@/screens/church/donateScreens/DonationEntryStyles";
import { useTranslation } from "react-i18next";

const EntryCard = ({ entry }) => {
  const isIncome = entry.type === "INCOME";
  const { t } = useTranslation("donateScreen");
  const [expanded, setExpanded] = useState(false);

  return (
    <Pressable onPress={() => setExpanded((prev) => !prev)} style={styles.card}>
      {/* Верхняя строка — всегда */}
      <View style={styles.cardRow}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Ionicons
            name={isIncome ? "arrow-down-circle" : "arrow-up-circle"}
            size={22}
            color={isIncome ? COLORS.success : COLORS.danger}
          />
          <Text style={styles.cardTitle}>
            {isIncome ? t("income") : t("outcome")}
          </Text>
        </View>
        <Text
          style={[
            styles.amount,
            { color: isIncome ? COLORS.success : COLORS.danger },
          ]}
        >
          {isIncome ? "+" : "-"} {entry.amount} $
        </Text>
      </View>

      {/* Раскрытая часть */}
      {expanded && (
        <View style={{ marginTop: 6 }}>
          {entry.memberName && (
            <Text style={styles.memberName}>{entry.memberName}</Text>
          )}
          {entry.description && (
            <Text style={styles.muted}>{entry.description}</Text>
          )}
          <Text style={styles.date}>
            {new Date(entry.createdAt).toLocaleString()}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

export default EntryCard;