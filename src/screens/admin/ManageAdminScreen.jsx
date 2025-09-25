import React, { useState,useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Layout from "@/components/Layout";

import UserScreen from "./userScreen/UserScreen";
import MemberScreen from "./memberScreen/MemberScreen";
import MemberGroupScreen from "./memberGroupScreen/MemberGroupScreen";
import { useUser } from "@/context/UserContext";

const COLORS = {
  bg: "#fff",
  text: "#2E4A6B",
  muted: "#9CA3AF",
  primary: "#3B82F6",
  line: "#E5E7EB",
};

export default function ManageAdminScreen() {
  const [activeTab, setActiveTab] = useState(); 
  const { isUserAdmin, isMemberAdmin } = useUser();
  useEffect(() => {
    // set a sensible default tab based on permissions
    if (!activeTab) {
      if (isUserAdmin) {
        setActiveTab("user");
        return;
      }
      if (isMemberAdmin) {
        setActiveTab("member");
        return;
      }
    }

    // if permissions change, ensure the active tab remains allowed
    if (activeTab === "user" && !isUserAdmin) {
      if (isMemberAdmin) setActiveTab("member");
      else setActiveTab(undefined);
    } else if (
      (activeTab === "member" || activeTab === "memberGroup") &&
      !isMemberAdmin
    ) {
      if (isUserAdmin) setActiveTab("user");
      else setActiveTab(undefined);
    }
  }, [isUserAdmin, isMemberAdmin, activeTab]);
  

  const renderContent = () => {
    switch (activeTab) {
      case "user":
        return <UserScreen />;
      case "member":
        return <MemberScreen />;
      case "memberGroup":
        return <MemberGroupScreen />;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <View style={styles.container}>
        {/* Tabs */}
        <View style={styles.tabBar}>
          {isUserAdmin && (
            <Pressable
              style={[styles.tab, activeTab === "user" && styles.tabActive]}
              onPress={() => setActiveTab("user")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "user" && styles.tabTextActive,
                ]}
              >
                User
              </Text>
            </Pressable>
          )}
          {isMemberAdmin && (
            <>
              <Pressable
                style={[styles.tab, activeTab === "member" && styles.tabActive]}
                onPress={() => setActiveTab("member")}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "member" && styles.tabTextActive,
                  ]}
                >
                  Member
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.tab,
                  activeTab === "memberGroup" && styles.tabActive,
                ]}
                onPress={() => setActiveTab("memberGroup")}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "memberGroup" && styles.tabTextActive,
                  ]}
                >
                  Member Group
                </Text>
              </Pressable>
            </>
          )}
        </View>

        {/* Content */}
        <View style={styles.body}>{renderContent()}</View>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: COLORS.line,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  tabActive: {
    borderBottomWidth: 3,
    borderColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.muted,
    fontWeight: "600",
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  body: { flex: 1, padding: 12 },
});
