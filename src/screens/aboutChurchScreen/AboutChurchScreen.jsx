import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import Layout from "@/components/Layout";
import Icon from "react-native-vector-icons/FontAwesome";
import DataLoaderWrapper from "@/components/DataLoaderWrapper";
import { getAboutChurch } from "@/api/aboutChurchAPI";
import { useTranslation } from "react-i18next";

const AboutChurchScreen = () => {
    const { t } = useTranslation("aboutChurch");

  const [contentData, setContentData] = useState({
    schedules: [],
    imageUrl: "",
    contact: {
      address: "",
      email: "",
      phone: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const loadData = () => {
    setLoading(true);
    getAboutChurch()
      .then((res) => {
        setContentData(res);
        setDataLoaded(true);
      })
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
        <DataLoaderWrapper
          loading={loading}
          data={dataLoaded ? contentData : null}
          onRetry={loadData}
        >
          <View style={styles.row}>
            <Image
              source={{ uri: contentData.imageUrl }}
              style={styles.image}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.heading}>{t("schedule")}</Text>
            {contentData.schedules.map((item, index) => (
              <View style={styles.serviceItem} key={index}>
                <Text style={styles.serviceText}>{item.nameService}</Text>
                <Text style={styles.badge}>{item.timeService}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.heading}>{t("contacts")}</Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>{t("address")} </Text>
              {contentData.address}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>{t("email")} </Text>
              {contentData.email}
            </Text>
            {contentData.phone && (
              <Text style={styles.text}>
                <Text style={styles.bold}>{t("phone")} </Text>
                {contentData.phone}
              </Text>
            )}
          </View>
          <View style={styles.iconsRow}>
            <TouchableOpacity
              onPress={() => Linking.openURL(contentData.contact.linkFacebook)}
              style={styles.iconButton}
            >
              <Icon name="facebook" size={28} color="#3b5998" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Linking.openURL(contentData.contact.linkYoutube)}
              style={styles.iconButton}
            >
              <Icon name="youtube-play" size={28} color="#FF0000" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(contentData.contact.linkGoogleMaps)
              }
              style={styles.iconButton}
            >
              <Icon name="map-marker" size={28} color="#d9534f" />
            </TouchableOpacity>
          </View>
        </DataLoaderWrapper>
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

export default AboutChurchScreen;
