import { StyleSheet } from "react-native";

const COLORS = {
  bg: "#f5f9ff",        // еле-голубой фон
  primary: "#007bff",
  border: "#dbe6ff",    // светло-голубая рамка
  text: "#0a2e5c",
  error: "#d32f2f",
  badgeBg: "#eaf2ff",   // фон бейджа
};

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 40,
    backgroundColor: COLORS.bg, // ← был #fff
  },

  // необязательно, но чуть приятнее
  titleBadge: {
    alignSelf: "center",
    backgroundColor: COLORS.badgeBg,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 20,

    // лёгкая тень
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

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: COLORS.border, // был #ccc
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    color: COLORS.text,
  },

  inputError: {
    borderColor: COLORS.error,
    borderWidth: 1,
  },

  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginBottom: 5,
    marginTop: -8,
  },

  button: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    // лёгкая тень
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },

  buttonDisabled: {
    backgroundColor: "#a8c1ff", // приглушённый голубой вместо серого
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  // опционально: карточка под форму (если хочешь белый блок на голубом фоне)
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
});