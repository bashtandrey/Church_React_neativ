import { useMemo, useState } from "react";
import { Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { WebView } from "react-native-webview";
import moment from "moment";

import Toast from "react-native-toast-message";
import { saveVideo } from "@/api/videoAPI";
import { extractYouTubeId } from "@/components/video/ExtractYouTubeId";
import styles from "./VideoSaveFormStyles";

const VideoSaveForm = ({ onClose, reLoad, video }) => {
  const isEditMode = !!video;

  const [id] = useState(video?.id || null);
  const [title, setTitle] = useState(video?.title || "");
  const [url, setUrl] = useState(video?.url || "");
  const [date, setDate] = useState(
    video?.date ? moment(video.date, "MM/DD/YYYY").toDate() : new Date()
  );
  const [showPicker, setShowPicker] = useState(false);

  const videoId = useMemo(() => extractYouTubeId(url), [url]);
  const youTubeURL = useMemo(() => {
    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}`;
  }, [videoId]);

  const isValidYouTubeUrl = !!videoId && url.trim().length > 5;
  const canShowTitleInput = isValidYouTubeUrl;
  const canShowDate = canShowTitleInput && title.trim() !== "";
  const canShowCreate = canShowDate;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = () => {
    if (isSubmitting) return;

    if (!title.trim() || !url.trim()) {
      Toast.show({
        type: "error",
        text1: "Ошибка!",
        text2: "Title и URL обязательны",
        position: "top",
      });
      return;
    }
    setIsSubmitting(true);

    saveVideo({
      id,
      title,
      url,
      date: moment(date).format("MM/DD/YYYY"),
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "Success!",
          text2: isEditMode ? "Video Updated" : "Video Added",
          position: "top",
        });
        onClose?.();
        reLoad?.();
        setIsSubmitting(false);
      },
      onError: (err) =>
        Toast.show({
          type: "error",
          text1: "Error!",
          text2: err || "Error saving video",
          position: "top",
        }),
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {isEditMode ? "Update Video" : "Add Video"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="YouTube URL"
        placeholderTextColor="#001f3f"
        value={url}
        onChangeText={setUrl}
        autoCapitalize="none"
      />

      {isValidYouTubeUrl && youTubeURL && (
        <WebView
          style={styles.preview}
          javaScriptEnabled
          originWhitelist={["*"]}
          source={{ 
            uri: youTubeURL,
            headers: {
              Referer: "https://server.churchriveroflife.com/",
            }, 
          }}
          onError={(e) => console.log("Ошибка загрузки:", e.nativeEvent)}
        />
      )}

      {canShowTitleInput && (
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
      )}

      {canShowDate && (
        <>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowPicker(true)}
          >
            <Text style={styles.dateText}>
              {moment(date).format("MM/DD/YYYY")}
            </Text>
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(e, selectedDate) => {
                setShowPicker(false);
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}
        </>
      )}

      {canShowCreate && (
        <TouchableOpacity
          style={[styles.button, isSubmitting && { opacity: 0.5 }]}
          onPress={handleCreate}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>
            {isEditMode ? "Save" : "Create"}
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default VideoSaveForm;
