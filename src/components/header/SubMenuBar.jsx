import React, { useMemo, useRef, useState } from "react";
import { View, Pressable, ScrollView, Platform, NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { MaterialIcons, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import styles, { COLORS } from "./subMenuStyles";

const libMap = {
  FontAwesome,
  FontAwesome5,
  MaterialIcons,
};

const MENUS = {
  church: [
    { icon: "bullhorn", screen: "Announcements", lib: "FontAwesome" },
    { icon: "youtube-play", screen: "YouTube", lib: "FontAwesome" },
    { icon: "donate", screen: "LinkDonate", lib: "FontAwesome5" },
    { icon: "bible", screen: "PlanVersesYear", lib: "FontAwesome5" },
    { icon: "announcement", screen: "AboutChurch", lib: "MaterialIcons" },
  ],
  admin: [
    { icon: "group", screen: "Admin", lib: "MaterialIcons" },
    { icon: "people-alt", screen: "Member", lib: "MaterialIcons" },
    { icon: "groups", screen: "Group", lib: "MaterialIcons" }

  ],
};

const EDGE_FADE_WIDTH = 24;

const SubMenuBar = ({ selectedMenu, navigation }) => {
  if (!selectedMenu) return null;

  const items = MENUS[selectedMenu] || [];
  const scrollRef = useRef(null);

  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  const onContentSizeChange = (wContent, _h) => {
    // Показать правый градиент, если контент шире контейнера (оценим позже в onLayoutScroll)
    // Здесь только включим по умолчанию — точнее посчитаем в onScroll.
    setShowRightFade(true);
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const atStart = contentOffset.x <= 1;
    const atEnd = contentOffset.x + layoutMeasurement.width >= contentSize.width - 1;

    setShowLeftFade(!atStart);
    setShowRightFade(!atEnd);
  };

  const shadowStyle = useMemo(
    () => (Platform.OS === "ios" ? styles.shadowIOS : styles.shadowAndroid),
    []
  );

  return (
    <View style={[styles.wrap, shadowStyle]}>
      {/* Левый градиент */}
      {showLeftFade && (
        <LinearGradient
          pointerEvents="none"
          colors={[COLORS.fade, "transparent"]}
          style={[styles.edgeFade, { left: 0 }]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        />
      )}

      {/* Правый градиент */}
      {showRightFade && (
        <LinearGradient
          pointerEvents="none"
          colors={["transparent", COLORS.fade]}
          style={[styles.edgeFade, { right: 0 }]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        />
      )}

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onContentSizeChange={onContentSizeChange}
        onScroll={onScroll}
        scrollEventThrottle={16}
        bounces
      >
        {items.map((it, idx) => {
          const Icon = libMap[it.lib] ?? FontAwesome5;
          return (
            <Pressable
              key={`${it.screen}-${idx}`}
              onPress={() => navigation.navigate(it.screen)}
              style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
              android_ripple={{ borderless: true, radius: 26 }}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={it.screen}
            >
              <Icon name={it.icon} size={20} color={COLORS.white} />
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default SubMenuBar;