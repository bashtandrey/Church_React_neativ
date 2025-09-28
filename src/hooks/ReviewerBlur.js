import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { BlurView } from "expo-blur";
import { useUser } from "@/context/UserContext";
import i18n from "@/i18n/";
import { FontAwesome } from "@expo/vector-icons";

export default function ReviewerBlur({ children }) {
  const { isReviewer } = useUser();

  if (!isReviewer) {
    return children;
  }

  // Локализация
  const label =
    i18n.language === "ru"
      ? "Просмотр в режиме рецензента"
      : "Reviewer Mode Preview";

  return (
    <View style={styles.wrapper}>
      {children}
      <BlurView intensity={60} style={StyleSheet.absoluteFill} tint="light" />
      <View style={styles.overlay}>
        <View style={styles.labelBox}>
          <FontAwesome name="eye" size={18} color="#333" style={{ marginRight: 8 }} />
          <Text style={styles.label}>{label}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center", // по центру по вертикали
    alignItems: "center", // по центру по горизонтали
    pointerEvents: "none", // не блокирует скролл/нажатия
  },
  labelBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3, // тень для Android
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});
