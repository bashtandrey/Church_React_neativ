import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 3,
  },
  idLogin: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
nameContainer: {
  backgroundColor: "#f0f0f0", // светло-серый фон
  padding: 10,
  borderRadius: 10,
  marginBottom: 10,
},

name: {
  fontSize: 16,
  color: "#333",
  marginBottom: 4,
},

  emailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
emailBadge: {
  paddingHorizontal: 10,
  paddingVertical: 6,
  borderRadius: 20,
  alignSelf: "flex-start",
  marginBottom: 8,
},

emailVerified: {
  backgroundColor: "#c8f7c5", // светло-зелёный
},

emailUnverified: {
  backgroundColor: "#ffe5a1", // светло-жёлтый
},

emailText: {
  fontSize: 14,
  color: "#000",
},
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statusDot: {
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
  },
  rolesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  roleChip: {
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginTop: 4,
  },
  roleText: {
    fontSize: 12,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  iconButton: {
    padding: 6,
  },
});

export default styles;
