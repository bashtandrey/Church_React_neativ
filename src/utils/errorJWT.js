// src/utils/errorJWT.js
import { refreshAccessToken } from "@/api/tokenRefreshService";
import { callLogOut } from "@/context/logOutHelper";
import { navigationRef } from "@/navigation/navigationRef";
import { CommonActions } from "@react-navigation/native";

export async function errorJWT(errorData) {
  try {
    console.log("errorJWT: JWT истек или недействителен", errorData);
    // пробуем обновить токен
    await refreshAccessToken();
    return true;
  } catch (e) {
    // refresh не удался — делаем полноценный logout
    if (callLogOut) {
      await callLogOut();
    }

    navigationRef.current?.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Welcome" }],
      })
    );

    return false;
  }
}