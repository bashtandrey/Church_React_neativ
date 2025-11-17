import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import { WebView } from "react-native-webview";
import { extractYouTubeId } from "@/components/video/ExtractYouTubeId";
import VideoActions from "./actionVideo/VideoActions";
import styles from "./VideoCardStyles";
import i18n from "@/i18n";
import { useTranslation } from "react-i18next";

const VideoCard = ({ video, showActions, reLoad }) => {
  const { t } = useTranslation("youTubeScreen");
  const videoId = extractYouTubeId(video.url);
  if (!videoId) return null;
  const openYouTube = () => {
    Linking.openURL(video.url).catch((err) =>
      console.error(t("error.opening_link"), err)
    );
  };

  return (
    <View style={styles.card}>
      {showActions && <VideoActions video={video} reLoad={reLoad} />}
      <Text style={styles.title}>{video.title}</Text>
      <WebView
        style={styles.preview}
        javaScriptEnabled
        source={{
          uri: `https://www.youtube.com/embed/${videoId}`,
          headers: {
            Referer: "https://server.churchriveroflife.com/",
          },
        }}
        scrollEnabled={false}
      />
      <Text style={styles.date}>{video.date}</Text>
      <TouchableOpacity style={styles.openButton} onPress={openYouTube}>
        <Text style={styles.openButtonText}>{t("button.open_youtube")}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default VideoCard;
