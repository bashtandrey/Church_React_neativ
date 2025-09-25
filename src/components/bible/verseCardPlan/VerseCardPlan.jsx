// VerseCardPlan.js
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import styles from "./VerseCardPlanStyles";
import { useUser } from "@/context/UserContext";
import { useReviewerGuard } from "@/hooks/useReviewerGuard";

const VerseCardPlan = ({ day, versInfo, onAction }) => {
  const { isYearReadingPlanEditor } = useUser();
  const guard = useReviewerGuard();
  const handlePress = () => {
    if (onAction) {
      onAction(day);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.dateCircle}>
        <Text style={styles.dateText}>{day}</Text>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.versInfo}>{versInfo || "—"}</Text>
      </View>
      {isYearReadingPlanEditor && (
        <TouchableOpacity
          onPress={() => guard(() => handlePress())}
          style={styles.iconContainer}
        >
          {versInfo ? (
            <MaterialIcons name="edit" size={24} color="#555" />
          ) : (
            <MaterialIcons name="add" size={24} color="#888" />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VerseCardPlan;
