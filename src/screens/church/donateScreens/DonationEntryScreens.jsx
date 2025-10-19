import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useRoute } from "@react-navigation/native";
import { View, Text, Pressable, ScrollView } from "react-native";
import Layout from "@/components/Layout";
import { Ionicons } from "@expo/vector-icons";
import EntryListTable from "@/components/donation/EntryListTable";
import EntryListByMembers from "@/components/donation/EntryListByMembers";
import styles, { COLORS } from "./DonationEntryStyles";
import { useTranslation } from "react-i18next";
import DataLoaderWrapper from "@/components/DataLoaderWrapper";
import { getDonationEntryFromProgram } from "@/api/donationAPI";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "@/context/UserContext";

const DonationEntryScreens = () => {
  const { isDonationEditor } = useUser();
  const route = useRoute();
  const { programId, programName } = route.params;
  const [entries, setEntries] = useState([]);
  const [mode, setMode] = useState("table"); // table | members
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const { t } = useTranslation("donateScreen");

  const loadData = useCallback(() => {
    setLoading(true);
    return getDonationEntryFromProgram(programId)
      .then((res) => setEntries(res))
      .catch((error) => {
        Toast.show({
          type: "error",
          text1: t("errorTitle"),
          text2: error?.message || t("errorLoad"),
          position: "top",
        });
      })
      .finally(() => setLoading(false));
  }, [t, programId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const sortedEntries = useMemo(
    () =>
      [...entries].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      ),
    [entries]
  );

  // 🔹 Считаем общую сумму
  const total = useMemo(() => {
    return entries.reduce((sum, e) => {
      if (e.type === "INCOME") return sum + Number(e.amount || 0);
      if (e.type === "OUTCOME") return sum - Number(e.amount || 0);
      return sum;
    }, 0);
  }, [entries]);

  return (
    <Layout>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{programName}</Text>
          <Text
            style={[
              styles.total,
              total > 0
                ? { color: COLORS.success }
                : total < 0
                ? { color: COLORS.danger }
                : { color: COLORS.muted },
            ]}
          >
            {t("total")}: {total.toFixed(2)} $
          </Text>
        </View>

        {isDonationEditor && (
          <View style={styles.actions}>
            <Pressable
              onPress={() => {
                navigation.navigate("AddDonationEntryScreen", {
                  type: "INCOME",
                  programId,
                  loadData,
                });
              }}
              style={styles.btn}
            >
              <Ionicons name="add-circle" size={22} color={COLORS.success} />
              <Text style={styles.btnText}>{t("income")}</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                navigation.navigate("AddDonationEntryScreen", {
                  type: "OUTCOME",
                  programId,
                  loadData,
                });
              }}
              style={styles.btn}
            >
              <Ionicons name="remove-circle" size={22} color={COLORS.danger} />
              <Text style={styles.btnText}>{t("outcome")}</Text>
            </Pressable>
          </View>
        )}
      </View>

      <DataLoaderWrapper loading={loading} data={entries} onRetry={loadData}>
        {/* TABS */}
        <View style={styles.tabs}>
          <Pressable
            style={[styles.tab, mode === "table" && styles.tabActive]}
            onPress={() => setMode("table")}
          >
            <Text
              style={mode === "table" ? styles.tabTextActive : styles.tabText}
            >
              {t("table")}
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, mode === "members" && styles.tabActive]}
            onPress={() => setMode("members")}
          >
            <Text
              style={mode === "members" ? styles.tabTextActive : styles.tabText}
            >
              {t("byMembers")}
            </Text>
          </Pressable>
        </View>

        {/* CONTENT */}
        <ScrollView style={{ flex: 1 }}>
          {mode === "table" ? (
            <EntryListTable entries={sortedEntries} />
          ) : (
            <EntryListByMembers entries={entries} />
          )}
        </ScrollView>
      </DataLoaderWrapper>
    </Layout>
  );
};

export default DonationEntryScreens;
