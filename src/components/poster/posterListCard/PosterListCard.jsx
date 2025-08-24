import React from "react";
import { useState } from "react";
import { FlatList, Text } from "react-native";
import PosterCard from "../posterCard/PosterCard";
import styles from "./PosterListCardStyles";

const PosterListCard = ({ showActions, contentData, reLoad }) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await reLoad();
    } finally {
      setRefreshing(false);
    }
  };

  const renderItem = ({ item }) => (
    <PosterCard post={item} showActions={showActions} reLoad={reLoad} />
  );

  return (
    <FlatList
      data={Array.isArray(contentData) ? contentData : []}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      ListEmptyComponent={<Text style={styles.emptyText}>Нет постов</Text>}
    />
  );
};

export default PosterListCard;
