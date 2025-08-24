import { apiRequest } from "./globalFuntions.js";
const api = "/api/v1/posts/";

export async function fetchPost() {
  const urlRequest = api + "fetchAll";
  try {
    const response = await apiRequest(urlRequest, {
      method: "GET",
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


export async function savePost(formData) {
  const urlRequest = api + "save";

  try {
    const response = await apiRequest(urlRequest, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    if (response.status === 201) {
      return true;
    } else {
      throw new Error("Не удалось создать пост");
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deletePost(itemId, checkDelete,onSuccess, onError) {
  const urlRequest = api + "delete";
  const post = {
    id: itemId,
    checkDelete: checkDelete,
  };
  try {
    const response = await apiRequest(urlRequest, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
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
