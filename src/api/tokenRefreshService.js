// src/api/tokenRefreshService.js
import Constants from "expo-constants";
import {
  saveToken,
  saveUser,
  saveRefreshToken,
  getRefreshToken,
} from "./tokenStorage";

const API_URL = Constants.expoConfig.extra.API_URL;
const apiAuth = "/api/v1/auth/";

export async function refreshAccessToken() {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token");
  }

  const res = await fetch(API_URL + apiAuth + "refresh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    let msg = "Refresh failed";
    try {
      const body = await res.json();
      msg = body?.message || body?.error || msg;
    } catch {
      // игнорируем, оставляем дефолтное сообщение
    }
    throw new Error(msg);
  }

  const data = await res.json();

  if (data.accessToken) {
    await saveToken(data.accessToken);
  }
  if (data.refreshToken) {
    await saveRefreshToken(data.refreshToken);
  }
  await saveUser(data);

  return data;
}