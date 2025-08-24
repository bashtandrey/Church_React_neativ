import { apiRequest } from "./globalFuntions.js";
const api = "/api/v1/weeklyPrayer";

export async function getWeeklyPrayer() {
  const urlRequest = api + "/getWeeklyPrayer";
  try {
    const response = await apiRequest(urlRequest, {
      method: "GET",
    });

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      return data;
    } else {
      throw new Error("Неверный тип контента от сервера");
    }
  } catch (error) {
    console.error("bibleAPI: Error fetching verse text:", error.message);
    throw new Error(error.message || "Неизвестная ошибка при получении стиха");
  }
}
export async function setWeeklyPrayer(form) {
  const urlRequest = api + "/setWeeklyPrayer";
  try {
    const response = await apiRequest(urlRequest, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return;

  } catch (error) {
    throw new Error(
      error.message || "prayerCardAPI: Неизвестная ошибка при установке стиха"
    );
  }
}

