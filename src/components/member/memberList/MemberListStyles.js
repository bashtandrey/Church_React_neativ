import { StyleSheet } from "react-native";
import { COLORS } from "@/screens/admin/userScreen/UserScreenStyles";

const styles = StyleSheet.create({
  listContainer: {
    paddingTop: 8,
  },
  emptyWrap: {
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.muted,
    textAlign: "center",
  },
});

export default styles;