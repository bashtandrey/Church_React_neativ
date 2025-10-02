import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useUser } from "@/context/UserContext";
import Toast from "react-native-toast-message";
import { resendEmail } from "@/api/userAPI";
import { useNavigation } from "@react-navigation/native";
import Layout from "@/components/Layout";
import styles, { COLORS } from "./ProfileScreenStyles";
import EmailActionModal from "@/components/users/userCard/actionUser/emailActionModal/EmailActionModal";
import ChangePasswordModal from "@/components/users/userCard/actionUser/changePasswordModal/ChangePasswordModal";
import { useTranslation } from "react-i18next";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import i18n from "@/i18n/";
import SaveMemberModal from "@/components/member/modals/SaveMemberModal";
import ModalTrigger from "@/components/common/ModalTrigger";
import { saveMember } from "@/api/membersAPI";
const Badge = ({ ok, textOk, textWarn }) => {
  return (
    <View style={[styles.badge, ok ? styles.badgeOk : styles.badgeWarn]}>
      <Ionicons
        name={ok ? "checkmark-circle" : "alert-circle"}
        size={16}
        color={ok ? COLORS.badgeOkText : COLORS.badgeWarnText}
        style={{ marginRight: 6 }}
      />
      <Text
        style={[
          styles.badgeText,
          { color: ok ? COLORS.badgeOkText : COLORS.badgeWarnText },
        ]}
      >
        {ok ? textOk : textWarn}
      </Text>
    </View>
  );
};

const Chip = ({ children }) => (
  <View style={styles.chip}>
    <Text style={styles.chipText}>{children}</Text>
  </View>
);

const SectionCard = ({ title, icon, children, right }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.cardHeaderLeft}>
        {icon}
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      {right}
    </View>
    <View style={styles.cardBody}>{children}</View>
  </View>
);

const PrimaryButton = ({ title, onPress, disabled, variant = "primary" }) => {
  const style =
    variant === "warn"
      ? [styles.btn, styles.btnWarn, disabled && styles.btnDisabled]
      : [styles.btn, styles.btnPrimary, disabled && styles.btnDisabled];

  const textStyle =
    variant === "warn" ? [styles.btnText, styles.btnTextDark] : styles.btnText;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={style}
      activeOpacity={0.8}
    >
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

const Row = ({ label, value, valueStyle }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={[styles.value, valueStyle]}>{value ?? "—"}</Text>
  </View>
);

const ProfileScreen = () => {
  const { t } = useTranslation("profileScreen");
  const navigation = useNavigation();
  const { user, hasGUEST, logOut } = useUser();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const emailOk = !!user?.emailVerified;
  const emailColor = emailOk ? COLORS.good : COLORS.warn;

  const handleEmailButton = () => {
    if (emailOk) {
      setShowEmailModal(true);
    } else {
      resendEmail(user.email)
        .then(() => Toast.show({ type: "success", text1: "Letter sent!" }))
        .catch(() =>
          Toast.show({ type: "error", text1: "Error sending email" })
        );
    }
  };

  const handleSaveSubmit = async ({ data }) => {
    const response = await saveMember(data);
    if (response?.ok) {
      logOut();
      Toast.show({
        type: "success",
        text1: "Готово",
        text2: "Член отредактирован",
      });
    }
  };

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>{t("header")}</Text>

        {/* Основная информация */}
        <SectionCard
          title={t("profileInfo")}
          icon={
            <Feather
              name="user"
              size={18}
              color={COLORS.title}
              style={{ marginRight: 8 }}
            />
          }
          right={
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Badge
                ok={emailOk}
                textOk={t("emailVerified")}
                textWarn={t("emailNotVerified")}
              />

              {/* Если есть memberDTO → кнопка редактирования */}
              {user.memberDTO?.id && (
                <ModalTrigger
                  opener={(open) => (
                    <TouchableOpacity
                      onPress={open}
                      style={styles.editBtn}
                    >
                      <Feather name="edit-2" size={16} color={COLORS.primary} />
                      <Text style={styles.editBtnText}>{t("edit")}</Text>
                    </TouchableOpacity>
                  )}
                >
                  {({ close }) => (
                    <SaveMemberModal
                      visible
                      onClose={close}
                      member={user.memberDTO}
                      onSubmit={(data) => handleSaveSubmit(data)}
                    />
                  )}
                </ModalTrigger>
              )}
            </View>
          }
        >
          {user.memberDTO?.id ? (
            <Row
              label={t("idUserMember")}
              value={`${user.id} / ${user.memberDTO.id}`}
            />
          ) : (
            <Row label={t("idUser")} value={String(user.id)} />
          )}

          <Row label={t("login")} value={user.login} />

          {/* Если есть memberDTO, используем его имя/фамилию */}
          <Row
            label={t("firstName")}
            value={user.memberDTO?.firstName || user.firstName}
          />
          <Row
            label={t("lastName")}
            value={user.memberDTO?.lastName || user.lastName}
          />

          <Row
            label={t("email")}
            value={user.email}
            valueStyle={{ color: emailColor }}
          />

          {user.memberDTO?.phone && (
            <Row label={t("phone")} value={user.memberDTO.phone} />
          )}
          {user.memberDTO?.birthday && (
            <Row label={t("birthday")} value={user.memberDTO.birthday} />
          )}
          {user.memberDTO?.gender && (
            <Row label={t("gender")} value={user.memberDTO.gender} />
          )}

          {!emailOk && (
            <Text style={[styles.note, { color: emailColor }]}>
              ⚠️ {t("confirmEmail")}
            </Text>
          )}
        </SectionCard>

        {/* Группа – только если не GUEST и есть данные группы */}
        {user?.mapGroup && (
          <SectionCard
            title={t("group") || "Группа"}
            icon={
              <Ionicons
                name="people-circle-outline"
                size={18}
                color={COLORS.title}
                style={{ marginRight: 8 }}
              />
            }
            right={
              user.mapGroup.isLeaderGroup && (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("ManageGroup", {
                      leaderId: user.mapGroup.leaderId,
                    })
                  }
                  style={styles.manageBtn}
                >
                  <Text style={styles.manageBtnText}>
                    {t("buttonGotoGroup")}
                  </Text>
                </TouchableOpacity>
              )
            }
          >
            <Row
              label={t("groupName") || "Название группы"}
              value={user.mapGroup.name}
            />
            <Row
              label={t("groupLeader") || "Лидер группы"}
              value={user.mapGroup.leaderName}
            />
            <Row
              label={t("groupLeaderPhone") || "Телефон лидера"}
              value={user.mapGroup.leaderPhone}
            />
          </SectionCard>
        )}

        {/* Роли */}
        <SectionCard
          title={t("roles")}
          icon={
            <MaterialCommunityIcons
              name="shield-account"
              size={18}
              color={COLORS.title}
              style={{ marginRight: 8 }}
            />
          }
        >
          <View style={styles.chipsWrap}>
            {user.roles.map((role, index) => (
              <Chip key={`${role.code}-${index}`}>
                {i18n.language === "ru" ? role.russianName : role.englishName}
              </Chip>
            ))}
          </View>

          {hasGUEST && <Text style={styles.note}>{t("selectedRoles")}</Text>}
        </SectionCard>

        {/* Кнопки */}
        <View style={styles.buttonGroup}>
          <PrimaryButton
            title={
              emailOk
                ? `✉️ ${t("changeEmail")}`
                : `📨 ${t("resendVerification")}`
            }
            onPress={handleEmailButton}
            disabled={user.superUser}
            variant={emailOk ? "primary" : "warn"}
          />
          <PrimaryButton
            title={`🔒 ${t("changePassword")}`}
            onPress={() => setShowPasswordModal(true)}
            variant="primary"
          />
        </View>

        {/* Модалки */}
        <EmailActionModal
          user={user}
          visible={showEmailModal}
          onClose={() => {
            setShowEmailModal(false);
            navigation.navigate("Welcome");
            logOut();
          }}
          editRoleUser={true}
        />

        <ChangePasswordModal
          user={user}
          visible={showPasswordModal}
          editRoleUser={true}
          onClose={() => {
            setShowPasswordModal(false);
            navigation.navigate("Welcome");
            logOut();
          }}
        />
      </ScrollView>
    </Layout>
  );
};

export default ProfileScreen;
