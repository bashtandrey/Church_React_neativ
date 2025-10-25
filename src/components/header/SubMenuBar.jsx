import React, { useMemo, useRef, useState } from "react";
import { View, Pressable, ScrollView, Platform } from "react-native";
import {
  MaterialIcons,
  FontAwesome,
  FontAwesome5,
  Foundation,
  Ionicons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useUser } from "@/context/UserContext";
import styles, { COLORS } from "./subMenuStyles";

const libMap = {
  FontAwesome,
  FontAwesome5,
  MaterialIcons,
  Foundation,
  Ionicons,
};

const MENUS = {
  church: [
    {
      icon: "bullhorn",
      screen: "Announcements",
      lib: "FontAwesome",
      color: "#FFD166",
    }, // жёлтый
    {
      icon: "youtube-play",
      screen: "YouTube",
      lib: "FontAwesome",
      color: "#FF4444",
    }, // красный
    {
      icon: "volunteer-activism",
      screen: "LinkDonate",
      lib: "MaterialIcons",
      color: "#06D6A0",
    }, // зелёный
    {
      icon: "bible",
      screen: "PlanVersesYear",
      lib: "FontAwesome5",
      color: "#118AB2",
    }, // синий
    {
      icon: "calendar",
      screen: "EventsChurchScreen",
      lib: "FontAwesome",
      color: "#EF476F",
    }, // розовый
    {
      icon: "announcement",
      screen: "AboutChurch",
      lib: "MaterialIcons",
      color: "#FFA500",
    }, // оранжевый
  ],
  library: [
    {
      icon: "book-outline",
      screen: "BookScreen",
      lib: "Ionicons",
      color: "#FFD166",
    }, // жёлтый
    {
      icon: "person-outline",
      screen: "LibraryPersonScreen",
      lib: "Ionicons",
      color: "#FF4444",
    }, // красный
    {
      icon: "enter-outline",
      screen: "LibraryEnterScreen",
      lib: "Ionicons",
      color: "#06D6A0",
    }, // зелёный
    {
      icon: "exit-outline",
      screen: "LibraryExitScreen",
      lib: "Ionicons",
      color: "#118AB2",
    }, // синий
    {
      icon: "settings-outline",
      screen: "LibrarySettingsScreen",
      lib: "Ionicons",
      color: "#EF476F",
    }, // розовый
  ],
};

const SubMenuBar = ({
  selectedMenu,
  navigation,
  allow,
  hiddenScreens = [],
  disabledScreens = [],
}) => {
  const rawItems = MENUS[selectedMenu] || [];
  const hiddenSet = useMemo(() => new Set(hiddenScreens), [hiddenScreens]);
  const disabledSet = useMemo(
    () => new Set(disabledScreens),
    [disabledScreens]
  );

  const { hasRole } = useUser();

  const items = useMemo(() => {
    return rawItems
      .filter((it) => {
        if (it.roles && !it.roles.some((r) => hasRole(r))) {
          return false;
        }
        return true;
      })
      .map((it) => {
        if (typeof allow === "function") {
          const res = allow(it);
          if (res === "hidden" || res === false)
            return { ...it, state: "hidden" };
          if (res === "disabled") return { ...it, state: "disabled" };
          return { ...it, state: "enabled" };
        }
        if (it.hidden) return { ...it, state: "hidden" };
        if (it.disabled) return { ...it, state: "disabled" };
        if (hiddenSet.has(it.screen)) return { ...it, state: "hidden" };
        if (disabledSet.has(it.screen)) return { ...it, state: "disabled" };
        return { ...it, state: "enabled" };
      })
      .filter((it) => it.state !== "hidden");
  }, [rawItems, allow, hiddenSet, disabledSet, hasRole]);

  const scrollRef = useRef(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  const onContentSizeChange = () => setShowRightFade(true);
  const onScroll = (e) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const atStart = contentOffset.x <= 1;
    const atEnd =
      contentOffset.x + layoutMeasurement.width >= contentSize.width - 1;
    setShowLeftFade(!atStart);
    setShowRightFade(!atEnd);
  };

  const shadowStyle = useMemo(
    () => (Platform.OS === "ios" ? styles.shadowIOS : styles.shadowAndroid),
    []
  );

  if (!selectedMenu) return null;

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
              android_ripple={
                !disabled ? { borderless: true, radius: 26 } : undefined
              }
              hitSlop={8}
              accessibilityRole="button"
              accessibilityState={{ disabled }}
              accessibilityLabel={it.screen}
            >
              <Icon
                name={it.icon}
                size={20}
                color={
                  disabled ? COLORS.disabledIcon : it.color || COLORS.white
                }
              />
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
