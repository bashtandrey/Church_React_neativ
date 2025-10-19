import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";
import styles from "./RequestMemberStyles";
import { fetchAllMemberGroup, assignUserToGroup } from "@/api/authAPI";

export default function RequestMember({ onClose, reLoad, newUserId }) {
  const { t } = useTranslation("requestMember");
  const [step, setStep] = useState(1); // 1: член? -> 2: выбор группы
  const [loading, setLoading] = useState(false);
  const [loadErr, setLoadErr] = useState(null);
  const [groups, setGroups] = useState([]); // [{id, groupName, leader}]
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  // ШАГ 1 — член церкви?
  const handleMemberNo = () => {
    Toast.show({
      type: "info",
      text1: t("toasts.guestTitle", "Информация"),
      text2: t(
        "toasts.guestBody",
        "Пользователь будет зарегистрирован как гость."
      ),
      position: "top",
    });
    onClose?.(newUserId ?? null, { groupId: null });
    reLoad?.();
  };
  const handleMemberYes = () => setStep(2);

  // ШАГ 2 — загрузить группы при входе
  useEffect(() => {
    if (step !== 2) return;
    let canceled = false;
    (async () => {
      setLoading(true);
      setLoadErr(null);
      try {
        console.log("1");
        const data = await fetchAllMemberGroup();
        console.log("2");
        const arr = (Array.isArray(data) ? data : []).map(
          ({ idGroup, nameGroup, leader }) => ({
            id: idGroup,
            groupName: nameGroup,
            leader: leader || "",
          })
        );
        if (!canceled) setGroups(arr);
      } catch (e) {
        if (!canceled) setLoadErr(e?.error || e?.message || "Ошибка загрузки");
      } finally {
        if (!canceled) setLoading(false);
      }
    })();

    return () => {
      canceled = true;
    };
  }, [step]);

  const selectedGroup = groups.find((g) => g.id === selectedGroupId) || null;

  const handleChoose = async () => {
    if (!selectedGroupId || loading) return;
    setLoading(true);
    try {
      await assignUserToGroup(newUserId, selectedGroupId);
      Toast.show({
        type: "success",
        text1: t("toasts.groupSavedTitle", "Группа назначена"),
        text2: t("toasts.groupSavedBody", "Назначение сохранено"),
        position: "top",
      });
      onClose?.(newUserId ?? null, { groupId: selectedGroupId });
      reLoad?.();
    } catch (e) {
      Toast.show({
        type: "error",
        text1: t("errors.title", "Ошибка"),
        text2: e?.error || e?.message || "Не удалось сохранить группу",
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formCard}>
        <View style={styles.titleBadge}>
          <Text style={styles.titleText}>
            {t("title", "Подтверждение статуса")}
          </Text>
        </View>

        {step === 1 && (
          <>
            <Text style={styles.question}>
              {t("questionMember", "Вы являетесь членом церкви?")}
            </Text>
            <View style={styles.buttonsRow}>
              <TouchableOpacity style={styles.button} onPress={handleMemberYes}>
                <Text style={styles.buttonText}>{t("buttons.yes", "Да")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={handleMemberNo}
              >
                <Text style={styles.buttonText}>{t("buttons.no", "Нет")}</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.info}>
              {t("hintMember", "Это можно изменить позже в профиле.")}
            </Text>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.question}>
              {t("questionGroupChoose", "Выберите группу пользователя")}
            </Text>

            {loading && <ActivityIndicator style={{ marginVertical: 12 }} />}

            {loadErr && (
              <Text style={[styles.info, { color: "#d32f2f" }]}>{loadErr}</Text>
            )}

            {!loading && !loadErr && (
              <>
                <FlatList
                  data={groups}
                  keyExtractor={(item) => String(item.id)}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => setSelectedGroupId(item.id)}
                      style={[
                        styles.listItem,
                        selectedGroupId === item.id && styles.listItemSelected,
                      ]}
                    >
                      <View style={styles.listItemRadio}>
                        <View
                          style={[
                            styles.listItemRadioDot,
                            selectedGroupId === item.id &&
                              styles.listItemRadioDotOn,
                          ]}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.listTitle}>{item.groupName}</Text>
                        <Text style={styles.listSubtitle}>
                          {item.leader || "—"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  ItemSeparatorComponent={() => (
                    <View style={styles.listSeparator} />
                  )}
                  ListEmptyComponent={
                    <Text style={styles.info}>
                      {t("emptyGroups", "Группы не найдены")}
                    </Text>
                  }
                  contentContainerStyle={{ paddingBottom: 40 }}
                />

                <View style={styles.buttonsRow}>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      (!selectedGroupId || loading) && styles.buttonSecondary,
                    ]}
                    disabled={!selectedGroupId || loading}
                    onPress={handleChoose}
                  >
                    <Text style={styles.buttonText}>
                      {selectedGroup
                        ? t("buttons.chooseWithName", {
                            name: selectedGroup.groupName,
                            defaultValue: `Выбрать: ${selectedGroup.groupName}`,
                          })
                        : t("buttons.choose", "Выбрать")}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, styles.buttonSecondary]}
                    onPress={() =>
                      onClose?.(newUserId ?? null, { groupId: null })
                    }
                  >
                    <Text style={styles.buttonText}>
                      {t("buttons.unknown", "Группа неизвестна")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </>
        )}
      </View>
    </View>
  );
}
