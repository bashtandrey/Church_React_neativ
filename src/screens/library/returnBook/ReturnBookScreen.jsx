import { useRoute } from "@react-navigation/native";
import { View, Text } from "react-native";
import Layout from "@/components/Layout";

const ReturnBookScreen = () => {
  const route = useRoute();
  const { book } = route.params;

  return (
    <Layout>
      <View>
        <Text>ReturnBookScreen  #{book.id}</Text>
        {/* Здесь можешь загрузить историю по bookId */}
      </View>
    </Layout>
  );
};

export default ReturnBookScreen;
