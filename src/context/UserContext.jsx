import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import * as SecureStore from "expo-secure-store";
import { logOutAPI } from "@/api/authAPI";
import { setLogOut } from "@/context/logOutHelper";

const UserContext = createContext();

const USER_KEY = "user";
const TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export const UserProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const isAuthenticated = !!user;

  // загрузка пользователя из SecureStore
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

  // logout
  const logOut = useCallback(async () => {
    try {
      await logOutAPI();

      await SecureStore.deleteItemAsync(USER_KEY);
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      
      setUserState(null);
      
    } catch (e) {
      console.error("Failed to logout", e);
    }
  }, []);



  // регистрируем глобальный logout helper
  useEffect(() => {
    setLogOut(logOut);
  }, [logOut]);

  // setUser (обновление или очистка)
  const setUser = async (userData) => {
    try {
      if (userData) {
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));

        if (userData.accessToken) {
          await SecureStore.setItemAsync(TOKEN_KEY, userData.accessToken);
        }

        if (userData.refreshToken) {
          await SecureStore.setItemAsync(
            REFRESH_TOKEN_KEY,
            userData.refreshToken
          );
        }

        setUserState(userData);
      } else {
        await SecureStore.deleteItemAsync(USER_KEY);
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
        setUserState(null);
      }
    } catch (e) {
      console.error("Failed to update user", e);
    }
  };

  // 🔑 Доступ к ролям
  const roles = user?.roles || []; // массив объектов { code, russianName, englishName }

  const hasRole = (rolePrefix) =>
    roles.some((r) => r.code.startsWith(rolePrefix));

  const isReviewer = user?.reviewer ?? false;

  const isUserAdmin = roles.some((r) => r.code === "USER_ADMIN");
  const isMemberAdmin = roles.some((r) => r.code === "MEMBER_ADMIN");
  const isAdmin = isUserAdmin || isMemberAdmin;
  const isVerseOfDayEditor = roles.some(
    (r) => r.code === "VERSE_OF_DAY_EDITOR"
  );
  const isPrayerCardEditor = roles.some((r) => r.code === "PRAYER_CARD_EDITOR");
  const isYearReadingPlanEditor = roles.some(
    (r) => r.code === "YEAR_READING_PLAN_EDITOR"
  );
  const isAnnouncementsEditor = roles.some(
    (r) => r.code === "ANNOUNCEMENTS_EDITOR"
  );
  const isYouTubeEditor = roles.some((r) => r.code === "YOUTUBE_EDITOR");
  const isEventsChurchEditor = roles.some(
    (r) => r.code === "EVENTS_CHURCH_EDITOR"
  );
  const isMember = roles.some((r) => r.code === "MEMBER");

  const isDonationEditor = roles.some((r) => r.code === "DONATION_EDITOR");
  const isDonationView =
    roles.some((r) => r.code === "DONATION_VIEW") || isDonationEditor;

  const hasGUEST = roles.some((r) => r.code === "GUEST");
  const isLibrarryEditor = roles.some((r) => r.code === "LIBRARY_EDITOR");
  const isLibrarryAdmin = roles.some((r) => r.code === "LIBRARY_ADMIN");

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        logOut,
        isAuthenticated,
        hasRole,
        isAdmin,
        isUserAdmin,
        isMemberAdmin,
        isAnnouncementsEditor,
        isYearReadingPlanEditor,
        isYouTubeEditor,
        isReviewer,
        isPrayerCardEditor,
        isEventsChurchEditor,
        hasGUEST,
        isVerseOfDayEditor,
        isDonationEditor,
        isDonationView,
        isMember,
        isLibrarryEditor,
        isLibrarryAdmin,
        roles,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
