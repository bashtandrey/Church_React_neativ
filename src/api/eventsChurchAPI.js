import { apiRequest } from "./globalFuntions.js";
const eventsAPI = "/api/v1/events/";


export async function fetchAllEvents() {
  const urlRequest = eventsAPI + "fetchAllEvents";
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

export async function saveEventChurch(eventChurch) {
  let url = "";
  if (eventChurch.id) {
    url = eventsAPI + "editEvents";
  } else {
    url = eventsAPI + "createEvents";
  }
  let response;
  try {
    response = await apiRequest(url, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventChurch),
    });
    return response;
  } catch (error) {
    console.log(error);
    throw new Error(error?.error || "Сеть недоступна или сервер не отвечает");
  }
}
export async function deleteEvent(id) {
  if (!id) throw new Error("Empty event id");
  const url = eventsAPI + "delete/" + encodeURIComponent(id);
  let response;
  try {
    response = await apiRequest(url, {
      method: "DELETE",
      credentials: "include",
    });
    return response;
  } catch (error) {
    console.log(error);
    throw new Error(error?.error || "Сеть недоступна или сервер не отвечает");
  }
}