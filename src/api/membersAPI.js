import { apiRequest } from "./globalFuntions.js";
const memberAPI = "/api/v1/member/";

export async function fetchAllMembers() {
  const urlRequest = memberAPI + "fetchAllMembers";
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
export async function fetchAllHierarchy() {
  const urlRequest = memberAPI + "fetchAllHierarchy";
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
export async function saveMember(member) {
  let url = "";
  if (member.id) {
    url = memberAPI + "edit";
  } else {
    url = memberAPI + "create";
  }
  let response;
  try {
    response = await apiRequest(url, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(member),
    });
    return response;
  } catch (error) {
    console.log(error);
    throw new Error(error?.error || "Сеть недоступна или сервер не отвечает");
  }
}
export async function deleteMember(id) {
  if (!id) throw new Error("Пустой id участника");
  const url = memberAPI + "delete/" + encodeURIComponent(id);
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
export async function assignHierarch(data) {
  const { memberId, hierarchy } = data;
  let url;
  if (hierarchy === null) {
    url = memberAPI + "assignHierarch?memberId=" + encodeURIComponent(memberId);
  } else {
    url =
      memberAPI +
      "assignHierarch?memberId=" +
      encodeURIComponent(memberId) +
      "&hierarchy=" +
      encodeURIComponent(hierarchy);
  }
  let response;
  try {
    response = await apiRequest(url, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    return response;
  } catch (error) {
    console.log(error);
    throw new Error(error?.error || "Сеть недоступна или сервер не отвечает");
  }
}
export async function assignGroup(data) {
  const { groupId, memberId } = data;
  let url;
  if (groupId === null) {
    url = memberAPI + "assignGroup?memberId=" + encodeURIComponent(memberId);
  } else {
    url =
      memberAPI +
      "assignGroup?memberId=" +
      encodeURIComponent(memberId) +
      "&groupId=" +
      encodeURIComponent(groupId);
  }
  let response;
  try {
    response = await apiRequest(url, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    return response;
  } catch (error) {
    console.log(error);
    throw new Error(error?.error || "Сеть недоступна или сервер не отвечает");
  }
}
export async function fetchAllUserWithoutMember() {
  const urlRequest = memberAPI + "fetchAllUserWithoutMember";
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
export async function assignUser(data) {
  const { memberId, userId } = data;
  let url;
  if (userId === null) {
    url = memberAPI + "assignUser?memberId=" + encodeURIComponent(memberId);
  } else {
    url =
      memberAPI +
      "assignUser?memberId=" +
      encodeURIComponent(memberId) +
      "&userId=" +
      encodeURIComponent(userId);
  }
  let response;
  try {
    response = await apiRequest(url, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    return response;
  } catch (error) {
    console.log(error);
    throw new Error(error?.error || "Сеть недоступна или сервер не отвечает");
  }
}
