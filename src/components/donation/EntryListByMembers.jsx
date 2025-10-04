import React, { useMemo, useState } from "react";
import { View, Text, Pressable } from "react-native";
import EntryCard from "./EntryCard";
import styles from "@/screens/church/donateScreens/DonationEntryStyles";
import { useTranslation } from "react-i18next";

const EntryListByMembers = ({ entries }) => {
  const [selected, setSelected] = useState(null);
  const { t } = useTranslation("donateScreen");

  // группировка по memberId
  const grouped = useMemo(() => {
    const map = {};
    entries.forEach((e) => {
      const key = e.memberId || "NO_MEMBER";
      if (!map[key]) map[key] = { memberName: e.memberName || t("noMembers"), list: [] };
      map[key].list.push(e);
    });
    return map;
  }, [entries]);

  if (selected) {
    const group = grouped[selected];
    return (
      <View>
        <Text style={styles.subTitle}>{group.memberName}</Text>
        {group.list.map((e) => (
          <EntryCard key={e.id} entry={e} />
        ))}
        <Pressable onPress={() => setSelected(null)} style={styles.backBtn}>
          <Text style={styles.backBtnText}>{t("back")}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View>
      {Object.entries(grouped).map(([id, group]) => (
        <Pressable key={id} onPress={() => setSelected(id)} style={styles.memberRow}>
          <Text style={styles.memberName}>{group.memberName}</Text>
          <Text style={styles.memberCount}>{group.list.length} {t("records")}</Text>
        </Pressable>
      ))}
    </View>
  );
};

export default EntryListByMembers;
