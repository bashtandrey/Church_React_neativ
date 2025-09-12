import React, { useMemo, useRef, useState } from "react";
import { View, Pressable, ScrollView, Platform } from "react-native";
import { MaterialIcons, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import styles, { COLORS } from "./subMenuStyles";

const libMap = { FontAwesome, FontAwesome5, MaterialIcons };

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
    { icon: "groups", screen: "MemberGroup", lib: "MaterialIcons" },
  ],
};

const SubMenuBar = ({
  selectedMenu,
  navigation,
  // allow?: (item) => 'enabled' | 'disabled' | 'hidden' | true | false
  allow,
  hiddenScreens = [],
  disabledScreens = [],
}) => {
  if (!selectedMenu) return null;

  const rawItems = MENUS[selectedMenu] || [];
  const hiddenSet = useMemo(() => new Set(hiddenScreens), [hiddenScreens]);
  const disabledSet = useMemo(() => new Set(disabledScreens), [disabledScreens]);

  const items = useMemo(() => {
    return rawItems
      .map((it) => {
        if (typeof allow === "function") {
          const res = allow(it);
          if (res === "hidden" || res === false) return { ...it, state: "hidden" };
          if (res === "disabled") return { ...it, state: "disabled" };
          return { ...it, state: "enabled" }; // 'enabled' или true/undefined
        }
        if (hiddenSet.has(it.screen)) return { ...it, state: "hidden" };
        if (disabledSet.has(it.screen)) return { ...it, state: "disabled" };
        return { ...it, state: "enabled" };
      })
      .filter((it) => it.state !== "hidden");
  }, [rawItems, allow, hiddenSet, disabledSet]);

  const scrollRef = useRef(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  const onContentSizeChange = () => setShowRightFade(true);
  const onScroll = (e) => {
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
      {showLeftFade && (
        <LinearGradient
          pointerEvents="none"
          colors={[COLORS.fade, "transparent"]}
          style={[styles.edgeFade, { left: 0 }]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        />
      )}
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
          const Icon = libMap[it.lib] || FontAwesome5;
          const disabled = it.state !== "enabled";

          return (
            <Pressable
              key={`${it.screen}-${idx}`}
              onPress={() => !disabled && navigation.navigate(it.screen)}
              style={({ pressed }) => [
                styles.item,
                pressed && !disabled && styles.itemPressed,
                disabled && styles.itemDisabled,
              ]}
              android_ripple={!disabled ? { borderless: true, radius: 26 } : undefined}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityState={{ disabled }}
              accessibilityLabel={it.screen}
            >
              <Icon name={it.icon} size={20} color={COLORS.white} />
              {disabled && (
                <View style={styles.lockBadge}>
                  <MaterialIcons name="lock" size={12} color={COLORS.white} />
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default SubMenuBar;