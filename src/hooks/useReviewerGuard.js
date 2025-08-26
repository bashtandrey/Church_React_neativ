import { Alert } from "react-native";
import { useCallback } from "react";
import { useUser } from "@/context/UserContext";
import Toast from "react-native-toast-message";

export function useReviewerGuard() {
  const { isReviewer } = useUser();

  const guard = useCallback(
    (callback) => {
      if (isReviewer) {
        Toast.show({
          type: "error",
          text1: "Access Denied",
          text2: "This action is not available in reviewer mode",
        });
        return;
      }
      callback?.();
    },
    [isReviewer]
  );

  return guard;
}