import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import Layout from "@/components/Layout";
import styles, { COLORS } from "./DonateScreenStyles";
import Toast from "react-native-toast-message";
import ModalTrigger from "@/components/common/ModalTrigger";
import { Ionicons } from "@expo/vector-icons";
import { useReviewerGuard } from "@/hooks/useReviewerGuard";
import {
  fetchAllDonateProgram,
  saveDonationProgram,
  deleteDonationProgram,
} from "@/api/donationAPI";
import DataLoaderWrapper from "@/components/DataLoaderWrapper";
import { useTranslation } from "react-i18next";
import DonateProgramCard from "@/components/donation/DonateProgramCard";
import SaveDonationProgramModal from "@/components/donation/modal/SaveDonationProgramModal";
import { useUser } from "@/context/UserContext";

const DonateScreens = ({ navigation }) => {
  const { isDonationEditor } = useUser();
  const { t } = useTranslation("donateScreen");
  const [donatePrograms, setDonatePrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const guard = useReviewerGuard();

  const loadData = useCallback(() => {
    setLoading(true);
    return fetchAllDonateProgram()
      .then((res) => setDonatePrograms(Array.isArray(res) ? res : []))
      .catch((error) => {
        Toast.show({
          type: "error",
          text1: t("errorTitle"),
          text2: error?.message || t("errorLoad"),
          position: "top",
        });
      })
      .finally(() => setLoading(false));
  }, [t]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredPrograms = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return donatePrograms;
    return donatePrograms.filter((p) =>
      p.programName.toLowerCase().includes(q)
    );
  }, [donatePrograms, search]);

  const handleSaveSubmit = async (data) => {
    console.log(data);
    const response = await saveDonationProgram(data);
    if (response) {
      loadData();
      Toast.show({
        type: "success",
        text1: t("success"),
        text2: data.idProgram ? t("updated") : t("created"),
      });
    }
  };

  const handleDelete = (program) => {
    Alert.alert(
      t("confirmDelete"),
      `${t("deleteMessage")} "${program.programName}"?`,
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("delete"),
          style: "destructive",
          onPress: async () => {
            await deleteDonationProgram(program.programId);
            loadData();
            Toast.show({ type: "success", text1: t("deleted") });
          },
        },
      ]
    );
  };

  return (
    <Layout>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>{t("title")}</Text>

          {isDonationEditor && (
            <ModalTrigger
              opener={(open) => (
                <Pressable
                  onPress={() => guard(open)}
                  style={({ pressed }) => [
                    { padding: 6 },
                    pressed && { opacity: 0.6 },
                  ]}
                >
                  <Ionicons
                    name="add-circle"
                    size={28}
                    color={COLORS.primary}
                  />
                </Pressable>
              )}
            >
              {({ close }) => (
                <SaveDonationProgramModal
                  visible
                  onClose={close}
                  onSubmit={handleSaveSubmit}
                />
              )}
            </ModalTrigger>
          )}
        </View>

        {/* SEARCH */}
        <View style={styles.controls}>
          <View style={styles.searchBox}>
            <Ionicons
              name="search-outline"
              size={18}
              color={COLORS.muted}
              style={{ marginRight: 6 }}
            />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder={t("searchPlaceholder")}
              placeholderTextColor={COLORS.muted}
              style={styles.searchInput}
              returnKeyType="search"
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch("")} hitSlop={8}>
                <Ionicons name="close-circle" size={18} color={COLORS.muted} />
              </Pressable>
            )}
          </View>

          <Text style={styles.counterText}>
            {filteredPrograms.length} / {donatePrograms.length}
          </Text>
        </View>

        {/* LIST */}
        <ScrollView contentContainerStyle={{ paddingVertical: 12 }}>
          <DataLoaderWrapper
            loading={loading}
            data={donatePrograms}
            onRetry={loadData}
          >
            {filteredPrograms.map((program) => (
              <ModalTrigger
                key={program.programId}
                opener={(open) => (
                  <DonateProgramCard
                    key={program.programId}
                    program={program}
                    onPress={() =>
                      navigation.navigate("DonationEntryScreens", {
                        programId: program.programId,
                        programName: program.programName,
                      })
                    }
                    onEdit={() => guard(open)}
                    onDelete={handleDelete}
                  />
                )}
              >
                {({ close }) => (
                  <SaveDonationProgramModal
                    visible
                    onClose={close}
                    program={program}
                    onSubmit={handleSaveSubmit}
                  />
                )}
              </ModalTrigger>
            ))}
          </DataLoaderWrapper>
        </ScrollView>
      </View>
    </Layout>
  );
};

export default DonateScreens;
