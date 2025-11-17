// src/storage/credentialsStorage.js
import * as SecureStore from "expo-secure-store";

const KEY_CREDENTIALS = "biometric_credentials_v1";

export async function saveCredentials(login, password) {
  const payload = { login, password };
  await SecureStore.setItemAsync(KEY_CREDENTIALS, JSON.stringify(payload));
}

export async function loadCredentials() {
  const raw = await SecureStore.getItemAsync(KEY_CREDENTIALS);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.log("Failed to parse credentials", e);
    return null;
  }
}

export async function clearCredentials() {
  await SecureStore.deleteItemAsync(KEY_CREDENTIALS);
}