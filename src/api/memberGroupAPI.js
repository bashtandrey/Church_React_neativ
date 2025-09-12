import { apiRequest } from "./globalFuntions.js";

const memberGroupAPI = "/api/v1/memberGroup/";

export async function fetchAllMemberGroup() {
  const urlRequest = memberGroupAPI + "fetchAllMemberGroup";
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