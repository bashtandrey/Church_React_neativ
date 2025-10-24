import { apiRequest } from "./globalFuntions.js";
import { registerAndSendPushToken } from "@/api/PushTokenService";

const userApi = "/api/v1/users/";
const authApi = "/api/v1/auth/";
const emailApi = "/api/v1/email/";
export async function fetchUsers() {
  const urlRequest = userApi + "fetchAll";
  try {
    const response = await apiRequest(urlRequest, {
      method: "GET",
      credentials: "include",
    });
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      throw new Error("Неверный тип контента от сервера");
    }
  } catch (error) {
    throw new Error(error.message);
  }
}
export async function fetchAllRoles() {
  const urlRequest = userApi + "fetchAllRoles";
  try {
    const response = await apiRequest(urlRequest, {
      method: "GET",
      credentials: "include",
    });
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      throw new Error("Неверный тип контента от сервера");
    }
  } catch (error) {
    throw new Error(error.message);
  }
}
export async function checkEmail({ email }) {
  await apiRequest(`${authApi}checkEmail?email=${encodeURIComponent(email)}`, {
    method: "POST",
    credentials: "include",
  });
}
export async function createUser(data) {
  const { login, password, email, firstName, lastName, onSuccess, onError } =
    data;

  try {
    const res = await apiRequest(authApi + "signUp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ login, password, email, firstName, lastName }),
    });

    // --- Парсим ответ ---
    const ct = (res.headers.get("content-type") || "").toLowerCase();
    let body;

    if (ct.includes("application/json")) {
      body = await res.json();
    } else {
      const text = await res.text();
      try {
        body = JSON.parse(text);
      } catch {
        body = text;
      }
    }

    // --- Вынимаем id ---
    let id =
      typeof body === "number"
        ? body
        : typeof body === "string" && /^\s*\d+\s*$/.test(body)
        ? Number(body.trim())
        : body && typeof body === "object"
        ? body.id ?? body.userId ?? body.idUser ?? null
        : null;
    await registerAndSendPushToken({ userId: id });
    onSuccess?.(id);
    return id;
  } catch (error) {
    onError?.(error);
    throw error;
  }
}
export async function editEmail(data) {
  const { id, email, isEditRoleUser, onSuccess, onError } = data;
  const action = "?userAction=EDIT_EMAIL";
  const urlRequest =
    userApi + (isEditRoleUser ? "editRoleUser" : "editRoleAdmin") + action;

  try {
    const response = await apiRequest(urlRequest, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ id, email }),
    });

    if (onSuccess) {
      onSuccess(response);
    }
  } catch (error) {
    if (onError) {
      onError(error);
    }
  }
}
export async function resendEmail(data) {
  const urlRequest = emailApi + "resendEmail";
  const { id, onSuccess, onError } = data;

  try {
    const response = await apiRequest(urlRequest, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ id }),
    });

    if (onSuccess) {
      onSuccess(response.message); // передаем сообщение успеха наверх
    }
  } catch (error) {
    if (onError) {
      onError(error.message); // передаем ошибку наверх
    }
  }
}
export async function editRoles(data) {
  const action = "?userAction=EDIT_ROLES";
  const urlRequest = userApi + "editRoleAdmin" + action;
  const { id, roles, onSuccess, onError } = data;

  try {
    const response = await apiRequest(urlRequest, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ id, roles }),
    });

    if (onSuccess) {
      onSuccess(response.message); // передаем сообщение успеха наверх
    }
  } catch (error) {
    if (onError) {
      onError(error.message); // передаем ошибку наверх
    }
  }
}
export async function toggleStatus(data) {
  const action = "?userAction=EDIT_STATUS";
  const urlRequest = userApi + "editRoleAdmin" + action;
  const { id, onSuccess, onError } = data;

  try {
    const response = await apiRequest(urlRequest, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ id }),
    });

    if (onSuccess) {
      onSuccess(response.message); // передаем сообщение успеха наверх
    }
  } catch (error) {
    if (onError) {
      onError(error.message); // передаем ошибку наверх
    }
  }
}
export async function editPassword(data) {
  const { id, password, isEditRoleUser, onSuccess, onError } = data;
  const action = "?userAction=EDIT_PASSWORD";
  const urlRequest =
    userApi + (isEditRoleUser ? "editRoleUser" : "editRoleAdmin") + action;
  try {
    const response = await apiRequest(urlRequest, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ id, password }),
    });

    if (onSuccess) {
      onSuccess(response.message); // передаем сообщение успеха наверх
    }
  } catch (error) {
    if (onError) {
      onError(error.message); // передаем ошибку наверх
    }
  }
}
export async function editUser(data) {
  const action = "?userAction=EDIT_USER";
  const urlRequest = userApi + "editRoleAdmin" + action;
  const { id, firstName, lastName, onSuccess, onError } = data;

  try {
    const response = await apiRequest(urlRequest, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ id, firstName, lastName }),
    });

    if (onSuccess) {
      onSuccess(response.message); // передаем сообщение успеха наверх
    }
  } catch (error) {
    if (onError) {
      onError(error.message); // передаем ошибку наверх
    }
  }
}
export async function editLogin(data) {
  const action = "?userAction=EDIT_LOGIN";
  const urlRequest = userApi + "editRoleAdmin" + action;
  const { id, login, onSuccess, onError } = data;

  try {
    const response = await apiRequest(urlRequest, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ id, login }),
    });

    if (onSuccess) {
      onSuccess(response.message); // передаем сообщение успеха наверх
    }
  } catch (error) {
    if (onError) {
      onError(error.error);
    }
  }
}
export async function deleteUser(data) {
  const urlRequest = userApi + "delete";
  const { id, checkDelete, onSuccess, onError } = data;

  try {
    const response = await apiRequest(urlRequest, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ id, checkDelete }),
    });

    if (onSuccess) {
      onSuccess(response.message); // передаем сообщение успеха наверх
    }
  } catch (error) {
    if (onError) {
      onError(error.message); // передаем ошибку наверх
    }
  }
}
