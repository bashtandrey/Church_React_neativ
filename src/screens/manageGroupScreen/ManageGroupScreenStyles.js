import { StyleSheet } from "react-native";

export const COLORS = {
  bg: "#EAF4FF",
  cardBg: "#FFFFFF",
  border: "#D6E9FF",
  title: "#1C3D6E",
  text: "#2E4A6B",
  muted: "#5E7BA6",
  primary: "#3B82F6",
  shadow: "rgba(0,0,0,0.08)",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    padding: 14,
  },
  header: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 12,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  leaderCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    color: COLORS.title,
  },
  birthdayRow: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    borderRadius: 8,
    marginBottom: 4,
  },
  birthdayText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
  },
  memberCard: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 6,
  },
  memberName: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
  },
  memberPhone: {
    fontSize: 13,
    color: COLORS.muted,
  },
  memberBirthday: {
    fontSize: 13,
    color: COLORS.text,
  },
  phoneButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignSelf: "flex-start",
  },
  phoneButtonText: {
    color: "white",
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
  },
  phoneButtonSmall: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignSelf: "flex-start",
    marginBottom: 6,
  },
  phoneButtonTextSmall: {
    color: "white",
    marginLeft: 5,
    fontSize: 12,
    fontWeight: "600",
  },
  copyIconBtn: {
    marginLeft: 8,
    padding: 4,
  },
});

export default styles;
