import { apiRequest } from "./globalFuntions.js";
import { registerAndSendPushToken } from "@/api/PushTokenService";

const apiAuth = "/api/v1/auth/";

import { saveToken, saveUser, getUser } from "./tokenStorage";

export async function signIn(data) {
  const { login, password, onSuccess, onError } = data;
  try {
    const response = await apiRequest(apiAuth + "nativeSignIn", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ login, password }),
    });

    const userData = await response.json();

    if (userData.accessToken) {
      await saveToken(userData.accessToken);
    }
    await saveUser(userData);
    registerAndSendPushToken();
    onSuccess?.(userData);
    return userData;
  } catch (error) {
    onError?.(error);
  }
}

export async function logOutAPI() {
  try {
    await apiRequest(apiAuth + "logOut", {
      method: "GET",
      credentials: "include",
    });
  } catch (error) {
    console.error("authAPI: Ошибка при выходе:", error);
  }
}

export async function getCurrentUser() {
  return await getUser();
}
export async function fetchAllMemberGroup() {
  const urlRequest = userApi + "fetchAllMemberGroup";
  console.log("fetchAllMemberGroup: URL запроса:");
  // try {
  //   const response = await apiRequest(urlRequest, {
  //     method: "GET",
  //     credentials: "include",
  //   });
  //   const contentType = response.headers.get("content-type");
  //   if (contentType && contentType.includes("application/json")) {
  //     return await response.json();
  //   } else {
  //     throw new Error("Неверный тип контента от сервера");
  //   }
  // } catch (error) {
  //   throw new Error(error.message);
  // }
}