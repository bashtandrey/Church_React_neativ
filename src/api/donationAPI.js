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
export async function fetchAllDonateProgram() {
  const urlRequest = api + "/fetchAllDonateProgram";
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
export async function saveDonationProgram(data) {
  const { idProgram, nameProgram } = data;
  let url = "";
console.log(data);
  if (idProgram) {
    url = api + "/editDonationProgram?idProgram=" +
      encodeURIComponent(idProgram) +
      "&nameProgram=" +
      encodeURIComponent(nameProgram);
  } else {
    url = api + "/createDonationProgram?nameProgram=" +
      encodeURIComponent(nameProgram);
  }

  try {
    const response = await apiRequest(url, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Server error: " + response.status);
    }

    return true;
  } catch (error) {
    console.log(error);
    throw new Error(error?.message || "Сеть недоступна или сервер не отвечает");
  }
}
export async function deleteDonationProgram(id) {
  if (!id) throw new Error("Empty event id");
  const url = api + "/deleteDonationProgram/" + encodeURIComponent(id);
  let response;
  try {
    response = await apiRequest(url, {
      method: "DELETE",
      credentials: "include",
    });
    return response;
  } catch (error) {
    console.log(error);
    throw new Error(
      error?.error || "Network unavailable or server not responding"
    );
  }
}
export async function getDonationEntryFromProgram(programId) {
  const urlRequest = api + "/getDonationEntryFromProgram/" + encodeURIComponent(programId);
  try {
    const response = await apiRequest(urlRequest, {
      method: "POST",
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
export async function getMemberList() {
  const urlRequest = api + "/getMemberList";
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