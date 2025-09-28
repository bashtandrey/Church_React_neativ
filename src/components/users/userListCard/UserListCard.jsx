import { useState, useCallback } from "react";
import { FlatList, RefreshControl, View, Text } from "react-native";
import UserCard from "@/components/users/userCard/UserCard";
import styles from "./UserListCardStyles";
import ReviewerBlur from "@/hooks/ReviewerBlur";
const UserListCard = ({ contentData, reLoad }) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await reLoad();
    } finally {
      setRefreshing(false);
    }
  }, [reLoad]);

  return (
    <ReviewerBlur>
      <FlatList
        data={contentData}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <UserCard user={item} reLoad={reLoad} />}
        contentContainerStyle={[
          styles.listContainer,
          contentData.length === 0 && { flex: 1, justifyContent: "center" },
        ]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>No users</Text>
            <Text style={styles.emptyText}>
              Измени фильтры или создай первого пользователя.
            </Text>
          </View>
        }
        // небольшой отступ снизу, чтобы карточки не прилипали к краю
        ListFooterComponent={<View style={{ height: 12 }} />}
      />
    </ReviewerBlur>
  );
};

export default UserListCard;
