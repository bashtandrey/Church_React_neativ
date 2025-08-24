import { useState, useMemo, useEffect } from "react";
import { FlatList, Text, TouchableOpacity } from "react-native";
import moment from "moment";
import VideoCard from "@/components/video/videoCard/VideoCard";
import styles from "./VideoListCardStyles";

const VideoListCard = ({ showActions, contentData, reLoad }) => {
  const [refreshing, setRefreshing] = useState(false);
  const currentYear = moment().format("YYYY");
  const currentMonth = moment().format("MM");

  const [expandedYears, setExpandedYears] = useState({});
  const [expandedMonths, setExpandedMonths] = useState({});

  useEffect(() => {
    setExpandedYears({ [currentYear]: true });
    setExpandedMonths({ [`${currentYear}-${currentMonth}`]: true });
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await reLoad();
    } finally {
      setRefreshing(false);
    }
  };

  const grouped = useMemo(() => {
    const result = {};
    if (!Array.isArray(contentData)) return result;

    contentData.forEach((item) => {
      const date = moment(item.date, "MM/DD/YYYY");
      const year = date.format("YYYY");
      const monthNum = date.format("MM");
      const monthName = date.format("MMMM");

      if (!result[year]) result[year] = {};
      if (!result[year][monthNum]) {
        result[year][monthNum] = {
          name: monthName,
          videos: [],
        };
      }

      result[year][monthNum].videos.push(item);
    });

    return result;
  }, [contentData]);

  const toggleYear = (year) => {
    setExpandedYears((prev) => ({ ...prev, [year]: !prev[year] }));
  };

  const toggleMonth = (year, monthNum) => {
    const key = `${year}-${monthNum}`;
    setExpandedMonths((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const flattened = useMemo(() => {
    const flat = [];

    Object.keys(grouped)
      .sort((a, b) => b - a)
      .forEach((year) => {
        flat.push({ type: "year", year });

        if (!expandedYears[year]) return;

        const months = grouped[year];

        Object.keys(months)
          .sort((a, b) => b - a)
          .forEach((monthNum) => {
            const monthKey = `${year}-${monthNum}`;
            flat.push({
              type: "month",
              year,
              monthNum,
              name: months[monthNum].name,
            });

            if (!expandedMonths[monthKey]) return;

            months[monthNum].videos
              .sort((a, b) =>
                moment(b.date, "MM/DD/YYYY").diff(
                  moment(a.date, "MM/DD/YYYY")
                )
              )
              .forEach((video) => {
                flat.push({ type: "video", video });
              });
          });
      });

    return flat;
  }, [grouped, expandedYears, expandedMonths]);

  const renderItem = ({ item }) => {
    if (item.type === "year") {
      return (
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleYear(item.year)}
        >
          <Text style={styles.sectionHeaderText}>{item.year}</Text>
          <Text style={styles.toggleSymbol}>
            {expandedYears[item.year] ? "−" : "+"}
          </Text>
        </TouchableOpacity>
      );
    }

    if (item.type === "month") {
      const key = `${item.year}-${item.monthNum}`;
      return (
        <TouchableOpacity
          style={styles.monthHeader}
          onPress={() => toggleMonth(item.year, item.monthNum)}
        >
          <Text style={styles.monthHeaderText}>{item.name}</Text>
          <Text style={styles.toggleSymbol}>
            {expandedMonths[key] ? "−" : "+"}
          </Text>
        </TouchableOpacity>
      );
    }

    if (item.type === "video") {
      return (
        <VideoCard
          video={item.video}
          showActions={showActions}
          reLoad={reLoad}
        />
      );
    }

    return null;
  };

  return (
    <FlatList
      data={flattened}
      keyExtractor={(item, index) => {
        if (item.type === "year") return `year-${item.year}`;
        if (item.type === "month")
          return `month-${item.year}-${item.monthNum}`;
        if (item.type === "video") return `video-${item.video.id}`;
        return index.toString();
      }}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      ListEmptyComponent={
        <Text style={styles.emptyText}>Нет видео</Text>
      }
    />
  );
};

export default VideoListCard;