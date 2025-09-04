import { StyleSheet } from "react-native";

const COLORS = {
  bg: "#f5f9ff",
  primary: "#007bff",
  border: "#dbe6ff",
  text: "#0a2e5c",
  error: "#d32f2f",
  badgeBg: "#eaf2ff",
  muted: "#6b7a90",
};

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 40,
    backgroundColor: COLORS.bg,
  },

  formCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },

  titleBadge: {
    alignSelf: "center",
    backgroundColor: COLORS.badgeBg,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    letterSpacing: 0.3,
    textAlign: "center",
  },

  question: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 16,
  },

  buttonsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },

  button: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonSecondary: {
    backgroundColor: "#a8c1ff",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  info: {
    marginTop: 12,
    textAlign: "center",
    color: COLORS.muted,
    fontSize: 13,
  },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    color: COLORS.text,
  },
    listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#dbe6ff",
    borderRadius: 10,
    padding: 10,
  },
  listItemSelected: {
    borderColor: "#007bff",
  },
  listItemRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#a8c1ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  listItemRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  listItemRadioDotOn: {
    backgroundColor: "#007bff",
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0a2e5c",
  },
  listSubtitle: {
    fontSize: 13,
    color: "#6b7a90",
    marginTop: 2,
  },
  listSeparator: {
    height: 8,
  },

  genderRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
    marginBottom: 8,
    justifyContent: "center",
  },
  genderPill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#a8c1ff",
    backgroundColor: "#fff",
  },
  genderPillOn: {
    borderColor: "#007bff",
    backgroundColor: "#eaf2ff",
  },
  genderPillText: {
    color: "#0a2e5c",
    fontWeight: "600",
  },
  genderPillTextOn: {
    color: "#0a2e5c",
  },
});
