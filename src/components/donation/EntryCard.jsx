import React from "react";
import { View, Text } from "react-native";
import styles, { COLORS } from "@/screens/church/donateScreens/DonationEntryStyles";
import { useTranslation } from "react-i18next";

const EntryCard = ({ entry }) => {
  const isIncome = entry.type === "INCOME";
  const { t } = useTranslation("donateScreen");

  return (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <Text style={styles.cardTitle}>
          {isIncome ? t("income") : t("outcome")}
        </Text>
        <Text style={[styles.amount, { color: isIncome ? COLORS.success : COLORS.danger }]}>
          {isIncome ? "+" : "-"} {entry.amount} $
        </Text>
      </View>

      {entry.memberName && <Text style={styles.muted}>{entry.memberName}</Text>}
      {entry.description && <Text style={styles.muted}>{entry.description}</Text>}

      <Text style={styles.date}>{new Date(entry.createdAt).toLocaleString()}</Text>
    </View>
  );
};

export default EntryCard;
