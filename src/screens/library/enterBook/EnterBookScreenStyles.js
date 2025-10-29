import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
    flex: 1,
  },

  // верхние карточки
  topCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  topCardActive: {
    backgroundColor: "#F9FBFF",
    borderColor: "#CFE4FF",
  },
  topLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 2,
  },
  topTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222",
  },
  topSub: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  topPlaceholder: {
    fontSize: 14,
    color: "#999",
  },
  clearBtn: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: "rgba(230,57,70,0.08)",
  },

  // поиск
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#222",
  },

  // список
  listBox: {
    flex: 1,
  },
  emptyText: {
    textAlign: "center",
    color: "#777",
    marginTop: 20,
  },

  // мини-карточки списка
  miniCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  miniSelected: {
    borderColor: "#118AB2",
    backgroundColor: "#F2FAFD",
  },
  miniTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
  },
  miniSub: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },

  // футер
  footer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  btnSave: { backgroundColor: "#118AB2" },
  btnCancel: { backgroundColor: "#8E8E93" },
  btnDisabled: { backgroundColor: "#cbd5e1" },
  btnLight: { backgroundColor: "#e2e8f0" },
  btnText: { color: "#fff", fontWeight: "700" },
  btnTextDark: { color: "#1f2937", fontWeight: "700" },
});