import React from "react";
import { View, Text, ActivityIndicator } from "react-native";

const DataLoaderWrapper = ({
  loading,
  data,
  children,
  errorMessage = "No date",
}) => {
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 16, marginBottom: 16, color: "gray" }}>
          {errorMessage}
        </Text>
      </View>
    );
  }

  return <>{children}</>;
};

export default DataLoaderWrapper;