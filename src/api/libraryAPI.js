import { apiRequest } from "./globalFuntions.js";
const libraryAPI = "/api/v1/library/";

//BookAPI
export async function fetchAllBook() {
  const urlRequest = libraryAPI + "fetchAllBook";
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
export async function saveBook(data) {
  const urlRequest = libraryAPI + "saveBook";
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
export async function deleteBook(id) {
  const urlRequest = libraryAPI + "deleteBook/" + encodeURIComponent(id);
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
export async function getAllBookWithoutLibraryCard() {
  const urlRequest = libraryAPI + "getAllBookWithoutLibraryCard";
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
export async function getAllBookFromLibraryCard(libraryCardId) {
  const urlRequest =
    libraryAPI + "getAllBookFromLibraryCard" + `?libraryCardId=${libraryCardId}`;
  try {
    const response = await apiRequest(urlRequest, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.status === 200) {
      return response.json();
    }
  } catch (error) {
    return {
      success: false,
      error: error.error || "Network error",
      field: error.field,
    };
  }
}
export async function getBookHistoryFromBook(bookId) {
  const urlRequest =
    libraryAPI + "getBookHistoryFromBook" + `?bookId=${bookId}`;
  try {
    const response = await apiRequest(urlRequest, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.status === 200) {
      return response.json();
    }
  } catch (error) {
    return {
      success: false,
      error: error.error || "Network error",
      field: error.field,
    };
  }
}

//LibraryCardAPI
export async function fetchAllLibraryCard() {
  const urlRequest = libraryAPI + "fetchAllLibraryCards";
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
export async function saveLibraryCard(data) {
  const urlRequest = libraryAPI + "saveLibraryCard";
  const { id, firstName, lastName, memberId } = data;

  try {
    const response = await apiRequest(urlRequest, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        id,
        firstName,
        lastName,
        memberId,
      }),
    });

    if (response.status === 201 || response.status === 200) {
      return {
        success: true,
        status: response.status,
        message:
          response.message ||
          (response.status === 201
            ? "Library card created successfully"
            : "Library card updated successfully"),
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
export async function deleteLibraryCard(id) {
  const urlRequest = libraryAPI + "deleteLibraryCard/" + encodeURIComponent(id);
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
export async function geAllMemberWithoutLibraryCard() {
  const urlRequest = libraryAPI + "geAllMemberWithoutLibraryCard";
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
export async function getBookHistoryFromLibraryCard(libraryCardId) {
  const urlRequest =
    libraryAPI + "getBookHistoryFromLibraryCard" + `?libraryCardId=${libraryCardId}`;
  try {
    const response = await apiRequest(urlRequest, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.status === 200) {
      return response.json();
    }
  } catch (error) {
    return {
      success: false,
      error: error.error || "Network error",
      field: error.field,
    };
  }
}

//Action
export async function issueBook(data) {
  const { bookId, cardId } = data;
  const urlRequest =
    libraryAPI + "issueBook" + `?bookId=${bookId}&cardId=${cardId}`;
  try {
    const response = await apiRequest(urlRequest, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.status === 200) {
      return {
        success: true,
        status: response.status,
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
export async function returnBook(data) {
  const { bookId } = data;
  const urlRequest =
    libraryAPI + "returnBook" + `?bookId=${bookId}`;
  try {
    const response = await apiRequest(urlRequest, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.status === 200) {
      return {
        success: true,
        status: response.status,
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