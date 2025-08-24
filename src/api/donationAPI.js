import { apiRequest } from "./globalFuntions.js";
const api = "/api/v1/donation";

export async function donationLink() {
  const urlRequest = api + "/donationLink";
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