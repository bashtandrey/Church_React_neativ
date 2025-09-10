
import * as Notifications from "expo-notifications";
import { apiRequest } from "./globalFuntions.js";
import { getToken } from "./tokenStorage.js";
import * as Device from "expo-device";
if (!Device.isDevice) {
  console.warn("pushTokenService: Пропуск регистрации push-токена — не физическое устройство");

  // Возвращаем "пустой" токен, чтобы основной код не падал при попытке получить токен на эмуляторе/в web
  Notifications.getExpoPushTokenAsync = async () => ({ data: null });

  // Перехватываем сетевые запросы и пропускаем отправку пустого токена на эндпоинт регистрации
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input, init) => {
    try {
      const url = typeof input === "string" ? input : input?.url || "";
      if (url.includes("/api/v1/notifications/register-token")) {
        if (init?.body) {
          const parsed = JSON.parse(init.body);
          if (!parsed?.token) {
            // имитируем успешный ответ сервера без реальной отправки
            return {
              ok: true,
              status: 204,
              json: async () => ({}),
            };
          }
        }
      }
    } catch (e) {
      // fallback to real fetch on any error
    }
    return originalFetch(input, init);
  };
}
export async function registerAndSendPushToken(data) {
  const { userId } = data;
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.warn("pushTokenService: Нет разрешения на уведомления");
      return;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync();
    const token = tokenData.data;
    console.log("📲 Push Token:", token);
    console.log("👤 User ID:", userId);

    const accessToken = await getToken();

    const headers = {
      "Content-Type": "application/json",
    };
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    await apiRequest("/api/v1/notifications/register-token", {
      method: "POST",
      headers,
      body: JSON.stringify({ token, userId }),
    });
  } catch (error) {
    console.warn("❌ Ошибка при регистрации push-токена:", error.message);
  }
}
export async function getPushPermissionStatus() {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status === "granted";
  } catch (error) {
    console.warn("Ошибка при проверке разрешений на пуши:", error.message);
    return null;
  }
}