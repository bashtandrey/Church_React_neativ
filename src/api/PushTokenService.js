// pushTokenService.js
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";
import * as SecureStore from 'expo-secure-store';
import { apiRequest } from "./globalFuntions.js";
import { getToken } from "./tokenStorage.js";

const SENT_CACHE_KEY = "pushToken.sent"; // { token: string, userId: number|null }

async function ensureAndroidChannel() {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync("default", {
    name: "default",
    importance: Notifications.AndroidImportance.MAX,
  });
}

function getProjectId() {
  // Expo SDK 49+: берём из EAS, если есть
  // eslint-disable-next-line no-undef
  return Constants?.easConfig?.projectId || Constants?.expoConfig?.extra?.eas?.projectId;
}

async function readSentCache() {
  const raw = await SecureStore.getItemAsync(SENT_CACHE_KEY);
  return raw ? JSON.parse(raw) : null;
}
async function writeSentCache(token, userId) {
  await SecureStore.setItemAsync(SENT_CACHE_KEY, JSON.stringify({ token, userId }));
}

/**
 * Регистрирует токен и отправляет на сервер.
 * data = { userId?: number|null }
 * - userId может быть null/undefined (первый запуск без авторизации)
 * - не шлёт повторно, если (token, userId) не изменились
 */
export async function registerAndSendPushToken(data = {}) {
  const userId = data?.userId ?? null;
  console.log("registerAndSendPushToken: userId =", userId);
  try {
    if (!Device.isDevice) {
      console.warn("pushTokenService: симулятор не поддерживает push-токены");
      return null;
    }

    await ensureAndroidChannel();

    // Разрешения
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      console.warn("pushTokenService: нет разрешения на уведомления");
      return null;
    }

    // Получаем Expo push token (с projectId, если доступен)
    const projectId = getProjectId();
    const tokenData = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined
    );
    const token = tokenData?.data;
    if (!token) {
      console.warn("pushTokenService: не удалось получить push-токен");
      return null;
    }

    // Не спамим сервер без нужды
    const prev = await readSentCache();
    if (prev && prev.token === token && prev.userId === userId) {
      return token;
    }

    // Заголовки (авторизация если есть)
    const accessToken = await getToken();
    const headers = { "Content-Type": "application/json" };
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

    // userId может быть null — сервер создаст/обновит запись без пользователя
    await apiRequest("/api/v1/notifications/register-token", {
      method: "POST",
      headers,
      body: JSON.stringify({ token, userId }),
    });

    await writeSentCache(token, userId);
    // console.log("📲 Push Token:", token, "👤 userId:", userId);
    return token;
  } catch (error) {
    console.warn("❌ Ошибка при регистрации push-токена:", error?.message || error);
    return null;
  }
}

/** true/false/null — есть ли разрешение на пуши */
export async function getPushPermissionStatus() {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status === "granted";
  } catch (error) {
    console.warn("Ошибка при проверке разрешений на пуши:", error?.message || error);
    return null;
  }
}