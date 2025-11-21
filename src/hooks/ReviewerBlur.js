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

  const label =
    i18n.language === "ru"
      ? "Просмотр в режиме рецензента"
      : "Reviewer Mode Preview";

  return (
    <View style={styles.wrapper}>
      {/* твой контент (FlatList и т.п.) */}
      {children}

      {/* Оверлей поверх всего: он и прячет, и блокирует скролл/тапы */}
      <View style={styles.overlay} pointerEvents="auto">
        {/* BlurView как эффект, если платформа умеет */}
        <BlurView
          intensity={60}
          tint="light"
          style={StyleSheet.absoluteFill}
        />

        {/* Плотная "молочная" вуаль, чтобы точно ничего не было видно */}
        <View style={styles.matte} />

        {/* Лейбл по центру, клики не нужны */}
        <View style={styles.labelBox} pointerEvents="none">
          <FontAwesome
            name="eye"
            size={18}
            color="#333"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.label}>{label}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: "relative",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  matte: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.95)", // почти полностью белый
  },
  labelBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 1)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});