import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import Layout from "@/components/Layout";
import { MaterialIcons } from "@expo/vector-icons";
import DataLoaderWrapper from "@/components/DataLoaderWrapper";
import { donationLink } from "@/api/donationAPI";
import i18n from "@/i18n/";

const LinkDonateScreen = () => {
  const [contentData, setContentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const langButton = i18n.language === "ru" ? "Перейти к пожертвованию" : "Go to donation";
  const lang = i18n.language === "ru" ? "verseRU" : "verseEN";


  const loadData = () => {
    setLoading(true);
    donationLink()
      .then((res) => setContentData(res))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    loadData();
  }, []);
  return (
    <Layout>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <DataLoaderWrapper
          loading={loading}
          data={contentData}
          onRetry={loadData}
        >
          <View></View>
          <Text
            style={{
              fontSize: 20,
              fontStyle: "italic",
              color: "#2e7d32",
              textAlign: "center",
              marginBottom: 6,
            }}
          >
            {contentData?.verses?.[lang].verses}
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: "#555",
              marginBottom: 20,
            }}
          >
            {contentData?.verses?.[lang].info}
          </Text>
          <TouchableOpacity
            onPress={
              contentData?.link ? () => Linking.openURL(contentData.link) : null
            }
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#4CAF50",
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 8,
            }}
          >
            <MaterialIcons name="volunteer-activism" size={24} color="white" />
            <Text style={{ color: "white", fontSize: 16, marginLeft: 8 }}>
              {langButton}
            </Text>
          </TouchableOpacity>
        </DataLoaderWrapper>
      </View>
    </Layout>
  );
};

export default LinkDonateScreen;
