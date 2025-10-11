import React from "react";
import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import styles, {
  COLORS,
} from "@/screens/church/donateScreens/DonateScreenStyles";
import { useTranslation } from "react-i18next";

const DonateProgramCard = ({ program, onPress, onEdit, onDelete }) => {
  const { t } = useTranslation("donateScreen");

  const isPositive = program.programSuma > 0;
  const isNegative = program.programSuma < 0;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.cardHeader}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.cardTitle}>{program.programName}</Text>
          {program.isEnabled && (
            <Pressable
              onPress={() => onEdit(program)}
              hitSlop={8}
              style={{ marginLeft: 8 }}
            >
              <Feather name="edit-2" size={16} color={COLORS.primary} />
            </Pressable>
          )}
        </View>

        <Text
          style={[
            styles.balance,
            isPositive && { color: COLORS.success },
            isNegative && { color: COLORS.danger },
            !isPositive && !isNegative && { color: COLORS.muted },
          ]}
        >
          {program.programSuma.toFixed(2)} $
        </Text>
      </View>

      {program.isEnabled && (
        <View style={styles.cardActions}>
          <Pressable
            onPress={() => onDelete(program)}
            style={({ pressed }) => [
              styles.actionBtn,
              pressed && { opacity: 0.7 },
            ]}
          >
            <Feather name="trash-2" size={16} color={COLORS.danger} />
            <Text style={[styles.actionBtnText, { color: COLORS.danger }]}>
              {t("delete")}
            </Text>
          </Pressable>
        </View>
      )}
    </Pressable>
  );
};

export default DonateProgramCard;
