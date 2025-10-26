import { apiRequest } from "./globalFuntions.js";
const bookAPI = "/api/v1/library/";

export async function fetchAllBook() {
  const urlRequest = bookAPI + "fetchAllBook";
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

export async function deleteBook(id) {
  const urlRequest = bookAPI + "deleteBook/" + encodeURIComponent(id);
  try {
    const response = await apiRequest(urlRequest, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.status === 204) {
      return {
        success: true,
        status: response.status,
        message: response.message || "Book deleted successfully",
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.error || "Network error",
      field: error.field,
    };
  }
}
export async function saveBook(data) {
  const urlRequest = bookAPI + "saveBook";
  const { id, serial, nameBook, publishingYear, publishingHouse, description } =
    data;

  try {
    const response = await apiRequest(urlRequest, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        id,
        serial,
        nameBook,
        publishingYear,
        publishingHouse,
        description,
      }),
    });

    if (response.status === 201 || response.status === 200) {
      return {
        success: true,
        status: response.status,
        message:
          response.message ||
          (response.status === 201
            ? "Book created successfully"
            : "Book updated successfully"),
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.error || "Network error",
      field: error.field,
    };
  }
}
