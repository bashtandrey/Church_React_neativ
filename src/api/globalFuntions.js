import * as SecureStore from "expo-secure-store";
import { errorJWT } from "@/utils/errorJWT";
import Constants from "expo-constants";

const TOKEN_KEY = "accessToken";
const API_URL = Constants.expoConfig.extra.API_URL;


export async function apiRequest(endpoint, options = {}) {
  try {
    console.log("globalFunctions: API Request:", API_URL + endpoint, options);
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    const headers = {
      ...(options.headers || {}),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(API_URL + endpoint, {
      ...options,
      headers,
    });
    if (!response.ok) {
      let errorData = { error: "Server error" };

      try {
        const errorBody = await response.json();
        if (
          errorBody &&
          (errorBody.field || errorBody.code || errorBody.error)
        ) {
          errorData = {
            field: errorBody.field,
            code: errorBody.code,
            error: errorBody.error,
          };
        } else {
          errorData = {
            error: errorBody.message || JSON.stringify(errorBody),
          };
        }
      } catch (e) {
        const fallbackText = await response.text();
        errorData = { error: fallbackText || "Unknown error" };
      }

      throw errorData;
    }

    return response;
  } catch (error) {
    if (error.code === "JWT") {
      errorJWT();
    }
    // console.error("globalFunctions: API request error:", error);
    throw error;
  }
}
