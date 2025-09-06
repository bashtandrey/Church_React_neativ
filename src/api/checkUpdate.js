// import React from "react";
import { Platform } from "react-native";
import * as Application from "expo-application";
import { apiRequest } from "./globalFuntions.js";
const api ="/api/v1/appVersion";
const isVersionLess = (v1, v2) => {
  const toNumbers = (v) => v.split(".").map(Number);
  const [a1, a2, a3] = toNumbers(v1);
  const [b1, b2, b3] = toNumbers(v2);
  if (a1 !== b1) return a1 < b1;
  if (a2 !== b2) return a2 < b2;
  return a3 < b3;
};

export async function checkForAppUpdate(navigation = null) {
  try {
    const platform = Platform.OS === "ios" ? "IOS" : "ANDROID";
    const urlRequest = `${api}/version?platform=${platform}`;
    const response = await apiRequest(urlRequest, {
      method: "POST",
    });
    const data = await response.json();
    const currentVersion = Application.nativeApplicationVersion;
    const latestVersion = data.latestVersion;
    const storeUrl = data.storeUrl;
    if (navigation && isVersionLess(currentVersion, latestVersion)) {
      console.log("Есть новая версия:", latestVersion);
      navigation.navigate("AboutApp");
    }

    return {
      currentVersion,
      latestVersion,
      storeUrl,
      isUpdateAvailable: isVersionLess(currentVersion, latestVersion),
    };
  } catch (error) {
    console.log("checkUpdate: Ошибка обновления:", error);
    return {
      currentVersion: null,
      latestVersion: null,
      storeUrl: null,
      isUpdateAvailable: false,
    };
  }
}