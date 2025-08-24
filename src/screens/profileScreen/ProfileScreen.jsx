import React, { useState } from "react";
import { View, Text, StyleSheet, Button, ScrollView } from "react-native";
import { useUser } from "@/context/UserContext";
import Toast from "react-native-toast-message";
import { resendEmail } from "@/api/userAPI";
import { useNavigation } from "@react-navigation/native";
import Layout from "@/components/Layout";
import styles from "./ProfileScreenStyles";

import EmailActionModal from "@/components/users/userCard/actionUser/emailActionModal/EmailActionModal";
import ChangePasswordModal from "@/components/users/userCard/actionUser/changePasswordModal/ChangePasswordModal";
import { useTranslation } from "react-i18next";

const ProfileScreen = () => {
  const { t } = useTranslation("profileScreen");

  const navigation = useNavigation();
  const { user, hasGUEST, logOut } = useUser();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const handleEmailButton = () => {
    if (user.emailVerified) {
      setShowEmailModal(true);
    } else {
      resendEmail(user.email)
        .then(() => Toast.show({ type: "success", text1: "Letter sent!" }))
        .catch(() =>
          Toast.show({ type: "error", text1: "Error sending email" })
        );
    }
  };

  const emailColor = user.emailVerified ? "#28a745" : "#ffc107";

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>{t("header")}</Text>

        <Text style={styles.label}>{t("id")}</Text>
        <Text style={styles.value}>{user.id}</Text>

        <Text style={styles.label}>{t("login")}</Text>
        <Text style={styles.value}>{user.login}</Text>

        <Text style={styles.label}>{t("firstName")}</Text>
        <Text style={styles.value}>{user.firstName}</Text>

        <Text style={styles.label}>{t("lastName")}</Text>
        <Text style={styles.value}>{user.lastName}</Text>

        <Text style={styles.label}>{t("email")}</Text>
        <Text style={[styles.value, { color: emailColor }]}>{user.email}</Text>
        {!user.emailVerified && (
          <Text style={[styles.value, { color: emailColor }]}>
            ⚠️ {t("confirmEmail")}
          </Text>
        )}
        <Text style={styles.label}>{t("roles")}</Text>

        {user.roles.map((role) => (
          <View key={role}>
            <Text style={styles.value}>• {role}</Text>
            {hasGUEST && (
              <Text style={styles.value}>{t("selectedRoles")}</Text>
            )}
          </View>
        ))}

        <View style={styles.buttonGroup}>
          <Button
            title={
              user.emailVerified
                ? "✉️ " + t("changeEmail")
                : "📨 " + t("resendVerification")
            }
            onPress={handleEmailButton}
            disabled={user.superUser}
            color={user.emailVerified ? "#007bff" : "#ffb700"}
          />
          <Button
            title={"🔒 " + t("changePassword")}
            onPress={() => setShowPasswordModal(true)}
          />
        </View>

        {/* Модалки (пока закомментированы) */}
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
          }}
        />
      </ScrollView>
    </Layout>
  );
};

export default ProfileScreen;
