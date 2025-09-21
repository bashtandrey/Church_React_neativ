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
export async function getMembersForLeader() {
  const urlRequest = memberGroupAPI + "getMembersForLeader";
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
export async function getMembersWithoutGroup() {
  const urlRequest = memberGroupAPI + "getMembersWithoutGroup";
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
export async function createMemberGroup(name) {
  const groupName = (name ?? "").trim();
  if (!groupName) throw new Error("Пустое имя группы");

  const url =
    memberGroupAPI + "create?groupName=" + encodeURIComponent(groupName);

  let response;
  try {
    response = await apiRequest(url, {
      method: "POST",
      credentials: "include",
    });
    return response;
  } catch (error) {
    console.log(error);
    throw new Error(error?.error || "Сеть недоступна или сервер не отвечает");
  }
}
export async function editMemberGroup(id, name) {
  const groupName = (name ?? "").trim();
  if (!groupName) throw new Error("Пустое имя группы");

  const url =
    memberGroupAPI +
    "edit?memberGroupId=" +
    encodeURIComponent(id) +
    "&groupName=" +
    encodeURIComponent(groupName);

  let response;
  try {
    response = await apiRequest(url, {
      method: "POST",
      credentials: "include",
    });
    return response;
  } catch (error) {
    console.log(error);
    throw new Error(error?.error || "Сеть недоступна или сервер не отвечает");
  }
}
export async function deleteMemberGroup(id) {
  if (!id) throw new Error("Пустой id группы");
  const url = memberGroupAPI + "delete/" + encodeURIComponent(id);
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
export async function addedMembersInGroup(data) {
  const url = memberGroupAPI + "addedMembersInGroup";
  const { groupId, memberIds } = data;
  let response;
  try {
    response = await apiRequest(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ groupId, memberIds }),
    });
    return response;
  } catch (error) {
    console.log(error);
    throw new Error(error?.error || "Сеть недоступна или сервер не отвечает");
  }
}
export async function deletedMembersForGroup(groupId, memberId) {
  let url;
  url =
    memberGroupAPI +
    "deleteMember?memberGroupId=" +
    encodeURIComponent(groupId) +
    "&memberId=" +
    encodeURIComponent(memberId);

  let response;
  try {
    response = await apiRequest(url, {
      method: "POST",
      credentials: "include",
    });
    return response;
  } catch (error) {
    console.log(error);
    throw new Error(error?.error || "Сеть недоступна или сервер не отвечает");
  }
}
export async function setLeader(groupId, leaderId) {
  let url;
  if (leaderId === null) {
    url =
      memberGroupAPI + "setLeader?memberGroupId=" + encodeURIComponent(groupId);
  } else {
    url =
      memberGroupAPI +
      "setLeader?memberGroupId=" +
      encodeURIComponent(groupId) +
      "&leaderId=" +
      encodeURIComponent(leaderId);
  }
  let response;
  try {
    response = await apiRequest(url, {
      method: "POST",
      credentials: "include",
    });
    return response;
  } catch (error) {
    console.log(error);
    throw new Error(error?.error || "Сеть недоступна или сервер не отвечает");
  }
}
