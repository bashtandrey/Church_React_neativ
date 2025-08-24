import { Alert } from "react-native";
import { useCallback } from "react";
import { useUser } from "@/context/UserContext";

export function useReviewerGuard() {
  const { isReviewer } = useUser();

  const guard = useCallback(
    (callback) => {
      if (isReviewer) {
        Alert.alert("Access Denied", "This action is not available in reviewer mode");
        return;
      }
      callback?.();
    },
    [isReviewer]
  );

  return guard;
}