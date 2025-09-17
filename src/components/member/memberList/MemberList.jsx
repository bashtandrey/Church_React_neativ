import { useState, useCallback, useMemo } from "react";
import { FlatList, RefreshControl, View, Text } from "react-native";
import MemberCard from "@/components/member/memberCard/MemberCard";
import styles from "./MemberListStyles";

const MemberListCard = ({ contentData, reLoad }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const data = useMemo(
    () => (Array.isArray(contentData) ? contentData : []),
    [contentData]
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await reLoad?.();
    } finally {
      setRefreshing(false);
    }
  }, [reLoad]);

  const handleToggle = useCallback((id, next) => {
    setSelectedId(next ? id : null);
  }, []);

  const renderItem = useCallback(
    ({ item }) => (
      <MemberCard
        member={item}
        expanded={selectedId === item.id}
        onToggle={handleToggle}
        loadData={reLoad}
      />
    ),
    [handleToggle, selectedId]
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderItem}
      contentContainerStyle={[
        styles.listContainer,
        data.length === 0 && { flex: 1, justifyContent: "center" },
      ]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListEmptyComponent={
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>No Member</Text>
          <Text style={styles.emptyText}>
            Измени фильтры или создай нового члена.
          </Text>
        </View>
      }
      ListFooterComponent={<View style={{ height: 12 }} />}
      // Небольшие оптимизации списка:
      initialNumToRender={8}
      windowSize={7}
      removeClippedSubviews
    />
  );
};

export default MemberListCard;
