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
import { fetchAllMemberGroup } from "@/api/authAPI";
export default function RequestMember({ onClose, reLoad, newUserId }) {
  const { t } = useTranslation("requestMember");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadErr, setLoadErr] = useState(null);
  const [groups, setGroups] = useState([]);
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
    onClose?.();
    reLoad?.();
  };
  const handleMemberYes = () => setStep(2);

  // ШАГ 2 — известна ли группа?
  const handleGroupKnownNo = async () => {
    // await requestGroupAssignment(newUserId);
    Toast.show({
      type: "info",
      text1: t("toasts.requestSentTitle", "Запрос отправлен"),
      text2: t("toasts.requestSentBody", "Мы свяжемся для уточнения группы."),
      position: "top",
    });
    onClose?.();
    reLoad?.();
  };
  const handleGroupKnownYes = () => setStep(3);

  // ШАГ 3 — загрузка групп при входе на шаг
  useEffect(() => {
    if (step !== 3) return;

    let canceled = false;
    (async () => {
      setLoading(true);
      setLoadErr(null);
      try {
        const data = await fetchAllMemberGroup();
        const arr = Object.values(data || {}).map((g) => ({
          id: g.id,
          groupName: g.groupName,
          leader: g.leader || "",
        }));
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

  const handleSaveGroup = async () => {
    if (!selectedGroupId || !selectedGenderId) return;
    await assignUserToGroup(newUserId, selectedGroupId, selectedGenderId);
    Toast.show({
      type: "success",
      text1: t("toasts.groupSavedTitle", "Группа назначена"),
      text2: t("toasts.groupSavedBody", "Назначение сохранено"),
      position: "top",
    });
    // возвращаем наружу id пола и id группы
    onClose?.(newUserId ?? null, {
      groupId: selectedGroupId,
      genderId: selectedGenderId,
    });
    reLoad?.();
  };

  // ===== Рендер =====
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
              {t(
                "questionGroupKnown",
                "Известно ли, к какой группе относится пользователь?"
              )}
            </Text>
            <View style={styles.buttonsRow}>
              <TouchableOpacity
                style={styles.button}
                onPress={handleGroupKnownYes}
              >
                <Text style={styles.buttonText}>{t("buttons.yes", "Да")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={handleGroupKnownNo}
              >
                <Text style={styles.buttonText}>{t("buttons.no", "Нет")}</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.info}>
              {t(
                "hintGroupKnown",
                "Если «Нет», мы отправим запрос и закроем окно."
              )}
            </Text>
          </>
        )}

        {step === 3 && (
          <>
            <Text style={styles.question}>
              {t(
                "questionGroupChoose",
                "Выберите группу и укажите пол пользователя"
              )}
            </Text>

            {loading && <ActivityIndicator style={{ marginVertical: 12 }} />}

            {loadErr && (
              <Text style={[styles.info, { color: "#d32f2f" }]}>{loadErr}</Text>
            )}

            {!loading && !loadErr && (
              <>
                {/* список групп */}
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
                  style={{ maxHeight: 260 }}
                />

                <View style={styles.buttonsRow}>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      !selectedGroupId && styles.buttonSecondary,
                    ]}
                    disabled={!selectedGroupId}
                    onPress={handleSaveGroup}
                  >
                    <Text style={styles.buttonText}>
                      {t("buttons.save", "Сохранить")}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, styles.buttonSecondary]}
                    onPress={() =>
                      onClose?.(newUserId ?? null, {
                        groupId: null,
                        genderId: null,
                      })
                    }
                  >
                    <Text style={styles.buttonText}>
                      {t("buttons.cancel", "Отмена")}
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
