import React from "react";
import { View, Text, Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import styles from "./EventsChurchCardStyles";

const EventsChurchCard = ({ event, onEdit, onDelete, isEditor }) => {
  // вычисляем красивую дату
  const renderDate = () => {
    if (event.startEventDate && event.endEventDate) {
      if (event.startEventDate === event.endEventDate) {
        return event.startEventDate; // одна дата
      }
      return `${event.startEventDate} - ${event.endEventDate}`; // период
    }
    return event.eventDate || ""; // fallback
  };

  return (
    <View style={styles.card}>
      {/* Заголовок */}
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {event.title}
        </Text>
        {isEditor && (
          <View style={styles.actions}>
            <Pressable
              onPress={() => onEdit?.(event)}
              style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
            >
              <FontAwesome name="pencil" size={18} color="#007bff" />
            </Pressable>
            <Pressable
              onPress={() => onDelete?.(event)}
              style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
            >
              <FontAwesome name="trash" size={18} color="#d9534f" />
            </Pressable>
          </View>
        )}
      </View>

      {/* Дата */}
      <Text style={styles.date}>📅 {renderDate()}</Text>

      {/* Описание */}
      {event.description ? (
        <Text style={styles.description}>{event.description}</Text>
      ) : null}
    </View>
  );
};

export default EventsChurchCard;