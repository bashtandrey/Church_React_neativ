import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import { WebView } from "react-native-webview";
import { extractYouTubeId } from "@/components/video/ExtractYouTubeId";
import VideoActions from "./actionVideo/VideoActions";
import styles from "./VideoCardStyles";

const VideoCard = ({ video, showActions, reLoad }) => {

  const videoId = extractYouTubeId(video.url);
  if (!videoId) return null;
  const openYouTube = () => {
    Linking.openURL(video.url).catch((err) =>
      console.error("Ошибка открытия ссылки:", err)
    );
  };

  return (
    <View style={styles.card}>
      {showActions && <VideoActions video={video} reLoad={reLoad} />}
      <Text style={styles.title}>{video.title}</Text>
      <WebView
        style={styles.preview}
        javaScriptEnabled
        source={{ uri: `https://www.youtube.com/embed/${videoId}` }}
        scrollEnabled={false}
      />
      <Text style={styles.date}>{video.date}</Text>
      <TouchableOpacity style={styles.openButton} onPress={openYouTube}>
        <Text style={styles.openButtonText}>Перейти на YouTube</Text>
      </TouchableOpacity>
    </View>
  );
};

export default VideoCard;
