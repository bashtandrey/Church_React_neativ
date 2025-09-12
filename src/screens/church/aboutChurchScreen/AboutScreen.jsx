import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Button,
} from "react-native";
import Layout from "@/components/Layout";
import rolImage from "@/assets/ROL.jpg";
import Icon from "react-native-vector-icons/FontAwesome";
import * as Application from "expo-application";
import { fetchAll } from "@/api/aboutAPI";
const AboutScreen = () => {
  const [contentData, setContentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleOpenURL = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };
  const loadData = () => {
    setLoading(false);
    fetchAll()
    .then((res) => setContentData(res))
    .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);
  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.section}>
          <Text style={styles.title}>Church «River of Life»</Text>
        </View>

        <View style={styles.row}>
          <Image source={rolImage} style={styles.image} />
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Расписание служений</Text>
          {loading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="#007AFF" />
            </View>
          ) : contentData && contentData.length > 0 ? (
            contentData.map((item) => (
              <View style={styles.serviceItem} key={item.id}>
                <Text style={styles.serviceText}>{item.nameService}</Text>
                <Text style={styles.badge}>{item.timeService}</Text>
              </View>
            ))
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 16, marginBottom: 16, color: "gray" }}>
                Нет связи с сервером
              </Text>
              <Button title="Обновить" onPress={loadData} />
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Контакты</Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Адрес: </Text>
            308 W Mount Vernon St., Nixa, MO, United States, 65714
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Email: </Text>
            admin@riveroflifemo.org
          </Text>

          <View style={styles.iconsRow}>
            <TouchableOpacity
              onPress={() =>
                handleOpenURL("https://www.facebook.com/riveroflifemo")
              }
              style={styles.iconButton}
            >
              <Icon name="facebook" size={28} color="#3b5998" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                handleOpenURL("https://www.youtube.com/@riveroflife417")
              }
              style={styles.iconButton}
            >
              <Icon name="youtube-play" size={28} color="#FF0000" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                handleOpenURL(
                  "https://www.google.com/maps/place/308+W+Mount+Vernon+St,+Nixa,+MO+65714"
                )
              }
              style={styles.iconButton}
            >
              <Icon name="map-marker" size={28} color="#d9534f" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.section}>
        <Text style={styles.text}>
          Текущая версия приложения:
          <Text style={styles.bold}>
            {Application.nativeApplicationVersion}
          </Text>
        </Text>
        <Text style={styles.text}>
          Доступна для обновления:
          <Text style={styles.bold}>
            {Application.nativeApplicationVersion}
          </Text>
        </Text>
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  section: {
    marginBottom: 25,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  row: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 180,
    marginTop: 15,
    borderRadius: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  bold: {
    fontWeight: "bold",
  },
  serviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  serviceText: {
    fontSize: 16,
  },
  badge: {
    backgroundColor: "#003366",
    color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  iconsRow: {
    flexDirection: "row",
    marginTop: 10,
  },
  iconButton: {
    marginRight: 15,
  },
});

export default AboutScreen;
