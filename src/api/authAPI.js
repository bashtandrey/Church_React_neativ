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
    await registerAndSendPushToken({ userId: userData.id });
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
  const url = `${apiAuth}fetchAllMemberGroup`;
  console.log("[groups] GET:", url);

  // apiRequest САМ бросит исключение, если !response.ok
  const res = await apiRequest(url, {
    method: "GET",
    credentials: "include",
  });

  const ct = (res.headers.get("content-type") || "").toLowerCase();
  if (!ct.includes("application/json")) {
    const txt = await res.text().catch(() => "");
    // бросаем предметную ошибку (НЕ new Error(error.message))
    throw { error: `Bad content-type: ${ct || "unknown"}`, body: txt };
  }

  // Сервер возвращает массив [{ leader, idGroup, nameGroup }, ...]
  return res.json();
}

export async function assignUserToGroup(newUserId, selectedGroupId) {
  await apiRequest(
    `${apiAuth}assignUserToGroup?newUserId=${encodeURIComponent(
      newUserId
    )}&groupId=${encodeURIComponent(selectedGroupId)}`,
    {
      method: "POST",
      credentials: "include",
    }
  );
}
export async function requestPasswordReset(email) {
  const res = await apiRequest(`${apiAuth}requestResetPassword`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email }),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data?.message || "Request failed");
  return { rid: data.rid, message: data.message };
}

export async function verifyResetCode(rid, code) {
  const res = await apiRequest(`${apiAuth}verify-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ rid, code }),
  });

  const data = await safeJson(res);
  if (!res.ok) {
    throw new Error(data?.message || "Invalid code");
  }

  return {
    login: data?.login ?? null,
    message: data?.message ?? "Code verified",
  };
}

export async function resetPasswordWithCode(rid, code, newPassword) {
  const res = await apiRequest(`${apiAuth}reset-by-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ rid, code, newPassword }),
  });
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data?.message || "Reset failed");
  return { message: data?.message || "Password updated" };
}

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}
