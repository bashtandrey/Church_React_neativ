import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { logOutAPI } from "@/api/authAPI";
import { setLogOut } from "@/context/logOutHelper";

const UserContext = createContext();

const USER_KEY = "user";
const TOKEN_KEY = "accessToken";

export const UserProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const isAuthenticated = !!user;

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await SecureStore.getItemAsync(USER_KEY);
        if (storedUser) {
          setUserState(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error("Failed to load user", e);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    setLogOut(logOut);
  }, [logOut]);

  const setUser = async (userData) => {
    try {
      if (userData) {
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));
        if (userData.accessToken) {
          await SecureStore.setItemAsync(TOKEN_KEY, userData.accessToken);
        }
        setUserState(userData);
      } else {
        await SecureStore.deleteItemAsync(USER_KEY);
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        setUserState(null);
      }
    } catch (e) {
      console.error("Failed to update user", e);
    }
  };

  const logOut = async () => {
    try {
      logOutAPI();
      await SecureStore.deleteItemAsync(USER_KEY);
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      setUserState(null);
    } catch (e) {
      console.error("Failed to logout", e);
    }
  };
  const isReviewer = user?.reviewer ?? false;
  const hasRole = (rolePrefix) =>
    user?.roles?.some((r) => r.startsWith(rolePrefix));

  const isAdmin = user?.roles?.includes("ADMIN") ?? false;

  const isPostEditor = user?.roles?.includes("ANNOUNCEMENTS_EDITOR") ?? false;
  const isBibleEditor = user?.roles?.includes("BIBLE_EDITOR") ?? false;
  const isVideoAdmin = user?.roles?.includes("VIDEO_EDITOR") ?? false;
  const isPrayerCardEditor =
    user?.roles?.includes("PRAYER_CARD_EDITOR") ?? false;
  const hasGUEST = user?.roles?.includes("GUEST") ?? false;
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        logOut,
        isAuthenticated,
        hasRole,
        isAdmin,
        isPostEditor,
        isBibleEditor,
        isVideoAdmin,
        isReviewer,
        isPrayerCardEditor,
        hasGUEST,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
