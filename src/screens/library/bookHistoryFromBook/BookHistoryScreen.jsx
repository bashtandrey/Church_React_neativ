import { useRoute } from "@react-navigation/native";
import { View, Text } from "react-native";

const BookHistoryScreen = () => {
  const route = useRoute();
  const { bookId } = route.params;

  return (
    <View>
      <Text>История книги #{bookId}</Text>
      {/* Здесь можешь загрузить историю по bookId */}
    </View>
  );
};

export default BookHistoryScreen;