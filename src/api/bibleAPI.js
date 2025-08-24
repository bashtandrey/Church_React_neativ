import { apiRequest } from "./globalFuntions.js";
const api = "/api/v1/bible";

export async function fetchAllBooks() {
  const urlRequest = api + "/fetchAllBooks";
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
export async function fetchAllBookChapter(selectedBook) {
  const urlRequest = `${api}/fetchAllBookChapters?number=${selectedBook}`;
  try {
    const response = await apiRequest(urlRequest, {
      method: "POST",
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
export async function fetchAllBookChapterVerses(selectedBook, selectedChapter) {
  const urlRequest = `${api}/fetchAllBookChapterVerses?number=${selectedBook}&chapter=${selectedChapter}`;
  try {
    const response = await apiRequest(urlRequest, {
      method: "POST",
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
export async function getVerseText(
  bibleLanguage,
  selectedBook,
  selectedChapter,
  selectedVerse
) {
  const urlRequest = `${api}/getVerses?bibleLanguage=${bibleLanguage}&number=${selectedBook}&chapter=${selectedChapter}&verse=${selectedVerse}`;
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
export async function setDailyVerse(
  selectedBook,
  selectedChapter,
  selectedVerse
) {
  const urlRequest = `${api}/setDailyVerse?number=${selectedBook}&chapter=${selectedChapter}&verses=${selectedVerse}`;
  try {
    const response = await apiRequest(urlRequest, {
      method: "POST",
    });
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      return data;
    } else {
      throw new Error("bibleAPI:Неверный тип контента от сервера");
    }
  } catch (error) {
    throw new Error(
      error.error || "bibleAPI: Неизвестная ошибка при установке стиха"
    );
  }
}
export async function getDailyPlan() {
  const urlRequest = api + "/getDailyPlan";
  try {
    const response = await apiRequest(urlRequest, {
      method: "GET",
    });
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      throw new Error("bibleAPI:Неверный тип контента от сервера");
    }
  } catch (error) {
    throw new Error(error.message);
  }
}
export async function getVerseOfTheDay() {
  const urlRequest = api + "/getDailyVerse";
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
export async function getMonthPlan(month) {
  const urlRequest = `${api}/getMonthPlan?month=${month}`;
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
export async function getYearPlan() {
  const urlRequest = api + "/getYearPlan";

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
export async function getListDayPlan(month, day) {
  const urlRequest = `${api}/getListDayPlan?month=${month}&day=${day}`;
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
export async function setDailyPlan(month, day, book, chapter) {
  const urlRequest = `${api}/setDailyPlan?month=${month}&day=${day}&book=${book}&chapter=${chapter}`;
  try {
    const response = await apiRequest(urlRequest, {
      method: "POST",
    });
    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status}`);
    }
    // Сервер возвращает пустое тело, просто возвращаем true
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
}
export async function deleteDailyPlan(id) {
  const urlRequest = `${api}/deleteDailyPlan?id=${id}`;
  try {
    const response = await apiRequest(urlRequest, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status}`);
    }
    // Сервер возвращает пустое тело, просто возвращаем true
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
}

