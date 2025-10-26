import { useRoute } from "@react-navigation/native";
import { View, Text } from "react-native";
import Layout from "@/components/Layout";
import { fetchAllBook } from "@/api/libraryAPI";
import { useTranslation } from "react-i18next";
import DataLoaderWrapper from "@/components/DataLoaderWrapper";
// import styles from "./EnterBookScreenStyles";

const EnterBookScreen = () => {
  const { t } = useTranslation("enterBookScreen");
  const route = useRoute();
  const { book } = route.params;

  return (
    <Layout>
      <View>
        <Text>Frnbjy книги #{book.id}</Text>
      </View>
    </Layout>
  );
};

export default EnterBookScreen;
