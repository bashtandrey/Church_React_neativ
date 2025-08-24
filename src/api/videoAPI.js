import { apiRequest } from "./globalFuntions.js";
const videoAPI = "/api/v1/video/";
import { getToken } from './tokenStorage';

export async function fetchVideo() {
  try {
    const response = await apiRequest(videoAPI + "fetchAll", {
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


export async function saveVideo(data) {
  const { id, title, url, date, onSuccess, onError } = data;

  const actionUrl = id
    ? videoAPI + "edit"
    : videoAPI + "create";

  // Формируем тело запроса без id, если он отсутствует
  const bodyData = {
    title,
    url,
    date,
    ...(id ? { id } : {}), // добавляем id только если он есть
  };

  try {
    const response = await apiRequest(actionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(bodyData),
    });

    if (onSuccess) {
      onSuccess(response.message);
    }
  } catch (error) {
    if (onError) {
      onError(error.message);
    }
  }
}

export async function deleteVideo(data) {
  const { id, checkDelete, onSuccess, onError } = data;

  try {
    const response = await apiRequest(videoAPI + "delete", {
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
