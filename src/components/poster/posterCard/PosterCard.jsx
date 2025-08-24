import { View, Text, Image, TouchableOpacity, Linking } from "react-native";
import styles from "./PosterCardStyles";
import ActionPost from "../actionPost/ActionPost";
import { Ionicons } from "@expo/vector-icons"; // или любой другой набор иконок

const PosterCard = ({ post, showActions, reLoad }) => {
  return (
    <View style={styles.card}>
      {post.title && (
        <View style={styles.header}>
          <Text style={styles.title}>{post.title}</Text>
        </View>
      )}

      <View style={styles.imageWrapper}>
        <Image source={{ uri: post.imageUrl }} style={styles.image} />
        {showActions && (
          <>
            <Text style={styles.idText}>ID: {post.id}</Text>
            <ActionPost
              post={post}
              styleDelete={styles.iconDelete}
              styleEDit={styles.iconEdit}
              onLoad={reLoad}
            />
          </>
        )}
      </View>

      {post.description && (
        <View style={styles.body}>
          <Text style={styles.description}>{post.description}</Text>
        </View>
      )}

      {post.eventDate && (
        <View style={styles.footer}>
          <Text style={styles.eventDate}>Event Date: {post.eventDate}</Text>
        </View>
      )}
      {post.link && (
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => Linking.openURL(post.link)}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Ionicons name="open" size={20} color="#007AFF" />
            <Text
              style={{ marginLeft: 6, color: "#007AFF", fontWeight: "500" }}
            >
              Перейти
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default PosterCard;
