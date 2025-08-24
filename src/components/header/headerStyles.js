import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#003366",
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    height: 30,
    width: 30,
    borderRadius: 20,
  },
  navContainer: {
    flexDirection: "row",
  },
  navItem: {
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  authContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  authButton: {
    marginLeft: 10,
  },
});

export default styles;