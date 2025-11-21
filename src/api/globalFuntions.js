import * as SecureStore from "expo-secure-store";
import { errorJWT } from "@/utils/errorJWT";
import Constants from "expo-constants";

const TOKEN_KEY = "accessToken";
const API_URL = Constants.expoConfig.extra.API_URL;

export async function apiRequest(endpoint, options = {}, isRetry = false) {
  console.log("globalFunctions: API request to", API_URL + endpoint);
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);

    const headers = {
      ...(options.headers || {}),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(API_URL + endpoint, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorData = { error: "Server error", status: response.status };

      try {
        const errorBody = await response.json();

        // ожидаем от бэка { message, code, field? }
        if (errorBody && (errorBody.code || errorBody.message || errorBody.error)) {
          errorData = {
            status: response.status,
            field: errorBody.field,
            code: errorBody.code,
            // нормализуем message
            message: errorBody.message || errorBody.error || "Server error",
          };
        } else {
          errorData = {
            status: response.status,
            message: errorBody ? JSON.stringify(errorBody) : "Server error",
          };
        }
      } catch (e) {
        const fallbackText = await response.text().catch(() => "");
        errorData = {
          status: response.status,
          message: fallbackText || "Unknown error",
        };
      }

      // ====== обработка JWT-ошибок ======
      if (
        errorData.status === 401 &&
        errorData.code &&
        errorData.code.startsWith("JWT_")
      ) {
        // пробуем обработать через errorJWT (там refresh или logout)
        const handled = await errorJWT(errorData);

        // если токен обновили и мы ещё не пытались повторить запрос — повторяем один раз
        if (handled && !isRetry) {
          const newToken = await SecureStore.getItemAsync(TOKEN_KEY);
          const retryHeaders = {
            ...(options.headers || {}),
          };
          if (newToken) {
            retryHeaders["Authorization"] = `Bearer ${newToken}`;
          }

          const retryResponse = await fetch(API_URL + endpoint, {
            ...options,
            headers: retryHeaders,
          });

          if (!retryResponse.ok) {
            // повторный запрос тоже упал — разбираем ошибку как обычно
            let retryError = { error: "Server error", status: retryResponse.status };
            try {
              const body = await retryResponse.json();
              retryError = {
                status: retryResponse.status,
                code: body.code,
                field: body.field,
                message: body.message || body.error || "Server error",
              };
            } catch {
              const txt = await retryResponse.text().catch(() => "");
              retryError = {
                status: retryResponse.status,
                message: txt || "Unknown error",
              };
            }
            throw retryError;
          }

          return retryResponse;
        }

        // если handled = false (refresh не удался / logout) — просто кидаем ошибку дальше
        throw errorData;
      }

      // не JWT-ошибка — кидаем как есть
      throw errorData;
    }

    return response;
  } catch (error) {
    console.error("globalFunctions: API request error:", error);
    throw error;
  }
}