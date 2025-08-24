import { useState } from "react";
import { FlatList } from "react-native";
import UserCard from "@/components/users/userCard/UserCard";
import styles from "./UserListCardStyles";

const UserListCard = ({ contentData, reLoad }) => {
  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await reLoad();
    } finally {
      setRefreshing(false);
    }
  };

  const renderItem = ({ item }) => <UserCard user={item} reLoad={reLoad} />;

  return (
    <FlatList
      data={contentData}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
      refreshing={refreshing}
      onRefresh={handleRefresh}
    />
  );
};

export default UserListCard;