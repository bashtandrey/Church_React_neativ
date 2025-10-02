import React, { useEffect, useState, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRoute } from "@react-navigation/native";
import { getMemberGroup } from "@/api/memberGroupAPI";
import styles, { COLORS } from "./ManageGroupScreenStyles";
import { format, parse, startOfDay, getMonth, getDate } from "date-fns";
import Layout from "@/components/Layout";
import DataLoaderWrapper from "@/components/DataLoaderWrapper";
import { FontAwesome, Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";

// 🔎 сравнение только дня и месяца
const isBirthdayToday = (date, today) => {
  return getMonth(date) === getMonth(today) && getDate(date) === getDate(today);
};

const ManageGroupScreen = () => {
  const route = useRoute();
  const { leaderId } = route.params;
  const { t } = useTranslation("manageGroupScreen");

  const [loading, setLoading] = useState(false);
  const [group, setGroup] = useState(null);

  const loadData = () => {
    setLoading(true);
    getMemberGroup(leaderId)
      .then((res) => setGroup(res))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const today = startOfDay(new Date());

  // 📋 копировать телефон
  const handleCopy = async (phone) => {
    if (phone && typeof phone === "string" && phone.trim().length >= 5) {
      await Clipboard.setStringAsync(phone);
      Toast.show({
        type: "success",
        text1: t("copied"),
        text2: phone,
      });
    } else {
      Toast.show({
        type: "error",
        text1: t("copyError"),
      });
    }
  };

  // 🎂 ДР в этом месяце
  const birthdaysThisMonth = useMemo(() => {
    if (!group?.members) return [];
    const filtered = group.members.filter((m) => {
      if (!m.birthday) return false;
      try {
        const d = startOfDay(parse(m.birthday, "MM/dd/yyyy", new Date()));
        return d.getMonth() === today.getMonth();
      } catch {
        return false;
      }
    });

    return filtered.sort((a, b) => {
      const da = startOfDay(parse(a.birthday, "MM/dd/yyyy", new Date()));
      const db = startOfDay(parse(b.birthday, "MM/dd/yyyy", new Date()));
      const isAToday = isBirthdayToday(da, today);
      const isBToday = isBirthdayToday(db, today);

      if (isAToday && !isBToday) return -1;
      if (!isAToday && isBToday) return 1;
      return da.getDate() - db.getDate();
    });
  }, [group]);

  // 👥 Участники
  const sortedMembers = useMemo(() => {
    if (!group?.members) return [];
    const withParsed = group.members.map((m) => {
      let d = null;
      let isToday = false;
      if (m.birthday) {
        try {
          d = startOfDay(parse(m.birthday, "MM/dd/yyyy", new Date()));
          isToday = isBirthdayToday(d, today);
        } catch {
          d = null;
        }
      }
      return { ...m, birthdayDate: d, isToday };
    });

    return withParsed.sort((a, b) => {
      if (a.isToday && !b.isToday) return -1;
      if (!a.isToday && b.isToday) return 1;
      const aKey = `${a.lastName} ${a.firstName}`.toLowerCase();
      const bKey = `${b.lastName} ${b.firstName}`.toLowerCase();
      return aKey.localeCompare(bKey);
    });
  }, [group]);

  return (
    <Layout>
      <ScrollView style={styles.container}>
        <DataLoaderWrapper loading={loading} data={group} onRetry={loadData}>
          {group && (
            <>
              {/* Заголовок */}
              <Text style={styles.header}>{group.name}</Text>

              {/* Лидер */}
              <View style={styles.leaderCard}>
                <Text style={styles.cardTitle}>{t("leaderTitle")}</Text>

                <View style={styles.memberRow}>
                  <Feather name="user" size={16} color={COLORS.primary} />
                  <Text style={styles.memberName}>
                    {group.leader?.lastName} {group.leader?.firstName}
                  </Text>
                </View>

                {group.leader?.phone && (
                  <View style={styles.memberRow}>
                    <Feather name="phone" size={14} color={COLORS.primary} />
                    <Text style={styles.memberPhone}>{group.leader.phone}</Text>
                  </View>
                )}
              </View>

              {/* Дни рождения */}
              {birthdaysThisMonth.length > 0 && (
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>{t("birthdaysTitle")}</Text>
                  {birthdaysThisMonth.map((m) => {
                    const d = startOfDay(
                      parse(m.birthday, "MM/dd/yyyy", new Date())
                    );
                    const isToday = isBirthdayToday(d, today);
                    return (
                      <View
                        key={m.id}
                        style={[
                          styles.birthdayRow,
                          isToday && { backgroundColor: "#DCF8EA" },
                        ]}
                      >
                        <Text style={styles.birthdayText}>
                          {m.firstName} {m.lastName} — {format(d, "dd MMMM")}
                          {isToday ? ` ${t("todayMark")}` : ""}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              )}

              {/* Участники */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>
                  {t("membersTitle", { count: group.members?.length || 0 })}
                </Text>
                {sortedMembers.map((m) => (
                  <View
                    key={m.id}
                    style={[
                      styles.memberCard,
                      m.isToday && { backgroundColor: "#DCF8EA" },
                    ]}
                  >
                    <View style={styles.memberRow}>
                      <Feather name="user" size={16} color={COLORS.primary} />
                      <Text style={styles.memberName}>
                        {m.lastName} {m.firstName}
                      </Text>
                    </View>

                    {m.phone && (
                      <View style={styles.memberRow}>
                        <Feather name="phone" size={14} color={COLORS.muted} />
                        <Text style={styles.memberPhone}>{m.phone}</Text>
                        <TouchableOpacity
                          onPress={() => handleCopy(m.phone)}
                          style={styles.copyIconBtn}
                        >
                          <Feather
                            name="copy"
                            size={14}
                            color={COLORS.primary}
                          />
                        </TouchableOpacity>
                      </View>
                    )}

                    {m.birthdayDate && (
                      <View style={styles.memberRow}>
                        <FontAwesome
                          name="birthday-cake"
                          size={14}
                          color={COLORS.muted}
                        />
                        <Text style={styles.memberBirthday}>
                          {format(m.birthdayDate, "MM/dd/yyyy")}
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </>
          )}
        </DataLoaderWrapper>
      </ScrollView>
    </Layout>
  );
};

export default ManageGroupScreen;
