import React, { useEffect, useCallback, useState, useMemo } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useNavigation, useRoute } from "@react-navigation/native";
import styles, { COLORS } from "./AddDonationEntryScreenStyles";
import Layout from "@/components/Layout";
import { getMemberList, addIncome, addOutcome } from "@/api/donationAPI";
import Toast from "react-native-toast-message";

export default function AddDonationEntryScreen() {
  const { t } = useTranslation("donateScreen");
  const navigation = useNavigation();
  const route = useRoute();
  const { type, programId, loadData } = route.params;

  const [step, setStep] = useState(0);
  const [members, setMembers] = useState([]);
  const [memberId, setMemberId] = useState(null);
  const [search, setSearch] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  const steps =
    type === "INCOME"
      ? [
          t("form.memberLabel"),
          t("form.descriptionLabel"),
          t("form.amountLabel"),
          t("form.confirmLabel"),
        ]
      : [
          t("form.descriptionLabel"),
          t("form.amountLabel"),
          t("form.confirmLabel"),
        ];

  const loadMembers = useCallback(() => {
    if (type !== "INCOME") return;
    return getMemberList()
      .then((res) => setMembers(res))
      .catch((error) => {
        Toast.show({
          type: "error",
          text1: t("errorTitle"),
          text2: error?.message || t("errorLoad"),
          position: "top",
        });
      });
  }, [t, type]);

  useEffect(() => {
    if (type === "INCOME") {
      loadMembers();
    } else {
      setMembers([]);
    }
    setStep(0);
    setMemberId(null);
    setDescription("");
    setAmount("");
    setSubmitting(false);
    setErr("");
  }, [type, loadMembers]);

  const filteredMembers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return members;
    return members.filter(
      (m) =>
        m.firstName.toLowerCase().includes(q) ||
        m.lastName.toLowerCase().includes(q)
    );
  }, [members, search]);

  const canGoNext = useMemo(() => {
    if (step === 0) {
      if (type === "INCOME") return true;
      if (type === "OUTCOME") return description.trim().length > 0;
    }
    if (step === 1) {
      if (type === "INCOME") {
        return memberId ? true : description.trim().length > 0;
      }
      if (type === "OUTCOME") return parseFloat(amount) > 0;
    }
    if (step === 2) {
      return type === "INCOME" ? parseFloat(amount) > 0 : true;
    }
    return true;
  }, [step, type, memberId, description, amount]);

  const next = () => {
    if (!canGoNext) return;
    if (step < steps.length - 1) setStep((s) => s + 1);
  };

  const back = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const handleSave = async () => {
    try {
      setSubmitting(true);
      if (type === "INCOME") {
        await addIncome(programId, amount, memberId, description);
      } else {
        await addOutcome(programId, amount, description);
      }
      loadData();
      Toast.show({
        type: "success",
        text1: t("success"),
        text2: type === "INCOME" ? t("incomeAdded") : t("outcomeAdded"),
      });
      navigation.goBack();
    } catch (e) {
      setErr(e?.message || t("form.errorSave"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </Pressable>
          <Text style={styles.title}>
            {type === "INCOME" ? t("addIncome") : t("addOutcome")}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* STEPPER */}
        <View style={styles.stepper}>
          {steps.map((_, i) => (
            <View key={`step-${i}`} style={styles.stepDotWrap}>
              <View
                style={[
                  styles.stepDot,
                  i === step && styles.stepDotActive,
                  i < step && styles.stepDotDone,
                ]}
              />
              {i < steps.length - 1 && <View style={styles.stepLine} />}
            </View>
          ))}
        </View>

        <Text style={styles.stepTitle}>{steps[step]}</Text>

        {/* BODY */}
        {type === "INCOME" && step === 0 && (
          <View style={{ flex: 1 }}>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder={t("searchPlaceholder")}
              placeholderTextColor={COLORS.muted}
              style={styles.input}
            />

            {/* 👇 счётчик найденных */}
            <Text style={styles.foundCounter}>
              {t("foundMembers", { count: filteredMembers.length })}
            </Text>

            <ScrollView style={{ flex: 1, marginTop: 8 }}>
              <Pressable
                key="no-member"
                style={[
                  styles.option,
                  memberId === null && styles.optionActive,
                ]}
                onPress={() => setMemberId(null)}
              >
                <Text
                  style={
                    memberId === null
                      ? styles.optionTextActive
                      : styles.optionText
                  }
                >
                  {t("noMembers")}
                </Text>
              </Pressable>
              {filteredMembers.map((m) => (
                <Pressable
                  key={`member-${m.id}`}
                  style={[
                    styles.option,
                    memberId === m.id && styles.optionActive,
                  ]}
                  onPress={() => setMemberId(m.id)}
                >
                  <Text
                    style={
                      memberId === m.id
                        ? styles.optionTextActive
                        : styles.optionText
                    }
                  >
                    {m.lastName} {m.firstName}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        {((type === "INCOME" && step === 1) ||
          (type === "OUTCOME" && step === 0)) && (
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder={t("form.descriptionPlaceholder")}
            placeholderTextColor={COLORS.muted}
            style={styles.input}
          />
        )}

        {((type === "INCOME" && step === 2) ||
          (type === "OUTCOME" && step === 1)) && (
          <View>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              keyboardType="numeric"
              style={styles.input}
            />
            <View style={styles.quickBtns}>
              {[50, 100].map((val) => (
                <Pressable
                  key={`quick-${val}`}
                  onPress={() => setAmount(String(val))}
                  style={styles.quickBtn}
                >
                  <Text style={styles.quickBtnText}>{val}</Text>
                </Pressable>
              ))}
              <Pressable
                key="quick-plus"
                onPress={() =>
                  setAmount((prev) => String((parseFloat(prev) || 0) + 50))
                }
                style={styles.quickBtn}
              >
                <Text style={styles.quickBtnText}>+50</Text>
              </Pressable>
            </View>
          </View>
        )}

        {((type === "INCOME" && step === 3) ||
          (type === "OUTCOME" && step === 2)) && (
          <View style={styles.confirmCard}>
            <Text style={styles.confirmTitle}>
              {type === "INCOME" ? t("income") : t("outcome")}
            </Text>
            <Text style={styles.confirmRow}>
              💵 {t("amount")}:{" "}
              <Text style={{ fontWeight: "700" }}>{amount} $</Text>
            </Text>
            {type === "INCOME" && memberId && (
              <Text style={styles.confirmRow}>
                👤 {t("member")}:{" "}
                {members.find((m) => m.id === memberId)?.lastName}{" "}
                {members.find((m) => m.id === memberId)?.firstName}
              </Text>
            )}
            {description ? (
              <Text style={styles.confirmRow}>
                📝 {t("description")}: {description}
              </Text>
            ) : null}
          </View>
        )}

        {err ? <Text style={styles.error}>{err}</Text> : null}
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Pressable
          onPress={back}
          disabled={step === 0}
          style={[styles.secondaryBtn, step === 0 && styles.disabled]}
        >
          <Text style={styles.secondaryText}>{t("back")}</Text>
        </Pressable>

        {step < steps.length - 1 ? (
          <Pressable
            onPress={next}
            disabled={!canGoNext}
            style={[styles.primaryBtn, !canGoNext && styles.disabled]}
          >
            <Text style={styles.primaryText}>{t("next")}</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={handleSave}
            disabled={submitting}
            style={[styles.primaryBtn, submitting && styles.disabled]}
          >
            <Text style={styles.primaryText}>
              {submitting ? t("saving") : t("save")}
            </Text>
          </Pressable>
        )}
      </View>
    </Layout>
  );
}
