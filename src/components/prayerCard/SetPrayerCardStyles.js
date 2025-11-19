import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // фон модалки
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },

  // сама "коробка" карточки
  cardWrapper: {
    width: "100%",
    maxWidth: 500,
    maxHeight: "90%", // чтобы на маленьких экранах не залезать за пределы и был скролл
    backgroundColor: "#f3f3f3",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#eee",
  },

  // внутренний контент ScrollView
  scrollInner: {
    paddingBottom: 8,
    flexGrow: 1,
  },

  // прогресс
  progressBarWrap: {
    height: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 6,
    marginBottom: 6,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#10b981",
    borderRadius: 6,
  },
  progressText: {
    textAlign: "center",
    color: "#374151",
    marginBottom: 10,
    fontWeight: "600",
  },

  // заголовок модалки + крестик
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  closeIcon: {
    fontSize: 20,
    color: "#6b7280",
  },

  // текстовые блоки
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#007AFF",
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 22,
  },

  family: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    textAlign: "center",
  },

  blessing: {
    fontSize: 16,
    marginTop: 8,
    marginBottom: 12,
    textAlign: "center",
    lineHeight: 22,
  },

  quote: {
    fontSize: 14,
    fontStyle: "italic",
    marginTop: 12,
    marginBottom: 4,
    textAlign: "center",
    lineHeight: 20,
  },

  quoteLine: {
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 20,
  },

  source: {
    fontSize: 13,
    textAlign: "center",
    color: "#666",
  },

  // контейнер для блока стиха (если будешь использовать отдельно)
  verseContainer: {
    padding: 16,
    marginVertical: 12,
    backgroundColor: "#f0f4ff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  // обёртка для Picker (если будешь обрамлять VersePicker)
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 15,
    overflow: "hidden",
  },
  picker: {
    width: "100%",
    backgroundColor: "#f8f8f8",
  },
  titlePicker: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },

  // инпуты
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 15,
    backgroundColor: "#f9f9f9",
    width: "100%",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },

  // кнопки вниз карточки
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },

  // кнопка "добавить семью"
  addFamilyBtn: {
    marginTop: 10,
    padding: 8,
    backgroundColor: "#eee",
    borderRadius: 6,
  },
  addFamilyText: {
    textAlign: "center",
  },
});

export default styles;
