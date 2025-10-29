import React, { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Notifications from "expo-notifications";

import { registerAndSendPushToken } from "@/api/PushTokenService";
import { checkForAppUpdate } from "@/api/checkUpdate";
import { UserProvider, useUser } from "@/context/UserContext";

import Toast from "react-native-toast-message";

import WelcomeScreen from "@/screens/welcomeScreen/WelcomeScreen";
import PlanVersesYearScreen from "@/screens/church/planVersesYearScreen/PlanVersesYearScreen";
import AboutAppScreen from "@/screens/aboutAppScreen/AboutAppScreen";
import LoginScreen from "@/screens/loginScreen/LoginScreen";
import ProfileScreen from "@/screens/profileScreen/ProfileScreen";
import ManageAdminScreen from "@/screens/admin/ManageAdminScreen";
import AnnouncementsScreen from "@/screens/church/announcementsScreen/AnnouncementsScreen";
import YouTubeScreen from "@/screens/church/youTubeScreen/YouTubeScreen";
import AboutChurchScreen from "@/screens/church/aboutChurchScreen/AboutChurchScreen";
import LinkDonateScreen from "@/screens/church/donateScreens/LinkDonateScreen";
import EventsChurchScreen from "@/screens/eventsChurch/EventsChurchScreen";
import ManageGroupScreen from "@/screens/manageGroupScreen/ManageGroupScreen";
import DonateScreen from "@/screens/church/donateScreens/DonateScreens";
import DonationEntryScreens from "@/screens/church/donateScreens/DonationEntryScreens";
import AddDonationEntryScreen from "@/components/donation/AddDonationEntryScreen";
import BookScreen from "@/screens/library/bookScreen/BookScreen";
import EnterBookScreen from "@/screens/library/enterBook/EnterBookScreen";
import ReturnBookScreen from "@/screens/library/returnBook/ReturnBookScreen";
import LibraryCardScreen from "@/screens/library/libraryCard/LibraryCardScreen";
import ReturnBookFromReader from "@/screens/library/returnBookFromReader/ReturnBookFromReaderScreen";
import BookHistoryFromBookScreen from "@/screens/library/bookHistoryFromBook/BookHistoryFromBookScreen";
import BookHistoryFromLibraryCard from "@/screens/library/bookHistoryFromLibraryCard/BookHistoryFromLibraryCard";
<<<<<<< HEAD



ReturnBookFromReader;
import { AppState, AppStateStatus } from "react-native";
import RNRestart from "react-native-restart";
=======
import ForgotPasswordScreen from "@/screens/forgotPasswordScreen/ForgotPasswordScreen";
import RememberLoginScreen from "@/screens/rememberLoginScreen/RememberLoginScreen";
>>>>>>> dd26ad7 (lib)

import "@/i18n";

const Stack = createNativeStackNavigator();

function PublicScreens(Stack) {
  return (
    <>
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ title: "Welcome" }}
      />
      <Stack.Screen
        name="Announcements"
        component={AnnouncementsScreen}
        options={{ title: "Announcements" }}
      />
      <Stack.Screen
        name="YouTube"
        component={YouTubeScreen}
        options={{ title: "YouTube" }}
      />
      <Stack.Screen
        name="LinkDonate"
        component={LinkDonateScreen}
        options={{ title: "Link Donate" }}
      />
      <Stack.Screen
        name="PlanVersesYear"
        component={PlanVersesYearScreen}
        options={{ title: "Plan Verses Year" }}
      />
      <Stack.Screen
        name="AboutChurch"
        component={AboutChurchScreen}
        options={{ title: "About Church" }}
      />
      <Stack.Screen
        name="AboutApp"
        component={AboutAppScreen}
        options={{ title: "About App" }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ title: "Forgot Password" }}
      />
      <Stack.Screen
        name="RememberLogin"
        component={RememberLoginScreen}
        options={{ title: "Remember Login" }}
      />
    </>
  );
}

<<<<<<< HEAD
      {isAuthenticated && (
        <>
          <Stack.Screen
            name="EventsChurchScreen"
            component={EventsChurchScreen}
            options={{ title: "Events Church" }}
          />
          <Stack.Screen
            name="BookScreen"
            component={BookScreen}
            options={{ title: "Books" }}
          />
          
          <Stack.Screen
            name="BookHistoryFromBookScreen"
            component={BookHistoryFromBookScreen}
            options={{ title: "Book History" }}
          />
          <Stack.Screen
            name="BookHistoryFromLibraryCard"
            component={BookHistoryFromLibraryCard}
            options={{ title: "Book History" }}
          />
          <Stack.Screen
            name="EnterBook"
            component={EnterBookScreen}
            options={{ title: "Enter Book" }}
          />
          <Stack.Screen
            name="ReturnBook"
            component={ReturnBookScreen}
            options={{ title: "Return Book" }}
          />
          <Stack.Screen
            name="ReturnBookFromReader"
            component={ReturnBookFromReader}
            options={{ title: "Return Book" }}
          />
          <Stack.Screen
            name="LibraryCardScreen"
            component={LibraryCardScreen}
            options={{ title: "Library Card" }}
          />
          <Stack.Screen
            name="ManageGroup"
            component={ManageGroupScreen}
            options={{ title: "Manage Group" }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ title: "Profile" }}
          />
          <Stack.Screen
            name="ManageAdmin"
            component={ManageAdminScreen}
            options={{ title: "Manange Admin" }}
          />
          <Stack.Screen
            name="DonateScreen"
            component={DonateScreen}
            options={{ title: "Donate" }}
          />
          <Stack.Screen
            name="DonationEntryScreens"
            component={DonationEntryScreens}
            options={{ title: "Donation Entry" }}
          />
          <Stack.Screen
            name="AddDonationEntryScreen"
            component={AddDonationEntryScreen}
            options={{ title: "Add Donation Entry" }}
          />
        </>
      )}
=======
function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerBackVisible: false,
        unmountOnBlur: false,
        detachInactiveScreens: false,
      }}
    >
      {PublicScreens(Stack)}
      <Stack.Screen
        name="LogIn"
        component={LoginScreen}
        options={{ title: "Login" }}
      />
>>>>>>> dd26ad7 (lib)
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackVisible: false,
        unmountOnBlur: false,
        detachInactiveScreens: false,
      }}
    >
      {PublicScreens(Stack)}
      <Stack.Screen
        name="EventsChurchScreen"
        component={EventsChurchScreen}
        options={{ title: "Events Church" }}
      />
      <Stack.Screen
        name="BookScreen"
        component={BookScreen}
        options={{ title: "Books" }}
      />
      <Stack.Screen
        name="BookHistoryFromBookScreen"
        component={BookHistoryFromBookScreen}
        options={{ title: "Book History" }}
      />
      <Stack.Screen
        name="BookHistoryFromLibraryCard"
        component={BookHistoryFromLibraryCard}
        options={{ title: "Book History" }}
      />
      <Stack.Screen
        name="EnterBook"
        component={EnterBookScreen}
        options={{ title: "Enter Book" }}
      />
      <Stack.Screen
        name="ReturnBook"
        component={ReturnBookScreen}
        options={{ title: "Return Book" }}
      />
      <Stack.Screen
        name="ReturnBookFromReader"
        component={ReturnBookFromReader}
        options={{ title: "Return Book" }}
      />
      <Stack.Screen
        name="LibraryCardScreen"
        component={LibraryCardScreen}
        options={{ title: "Library Card" }}
      />
      <Stack.Screen
        name="ManageGroup"
        component={ManageGroupScreen}
        options={{ title: "Manage Group" }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Profile" }}
      />
      <Stack.Screen
        name="ManageAdmin"
        component={ManageAdminScreen}
        options={{ title: "Manange Admin" }}
      />
      <Stack.Screen
        name="DonateScreen"
        component={DonateScreen}
        options={{ title: "Donate" }}
      />
      <Stack.Screen
        name="DonationEntryScreens"
        component={DonationEntryScreens}
        options={{ title: "Donation Entry" }}
      />
      <Stack.Screen
        name="AddDonationEntryScreen"
        component={AddDonationEntryScreen}
        options={{ title: "Add Donation Entry" }}
      />
    </Stack.Navigator>
  );
}

// --- Корневой роутер: выбираем стек по isAuthenticated ---
function RootNavigator() {
  const { isAuthenticated } = useUser();
  const nav = useNavigationContainerRef();
  useEffect(() => {
    if (nav.isReady())
      nav.reset({
        index: 0,
        routes: [{ name: isAuthenticated ? "Welcome" : "LogIn" }],
      });
  }, [isAuthenticated]);

  return isAuthenticated ? <AppStack /> : <AuthStack />;
}

const App = () => {
  const navigationRef = useNavigationContainerRef();
  const responseListener = useRef(null);
  const pendingRoute = useRef(null);
  const appStateRef = useRef(AppState.currentState);

  // === Обработка уведомлений ===
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    registerAndSendPushToken();
    checkForAppUpdate(navigationRef.current);

    // Подписка: клик по уведомлению
    const sub = Notifications.addNotificationResponseReceivedListener(
      (resp) => {
        const data = resp?.notification?.request?.content?.data || {};
        const screen = typeof data.screen === "string" ? data.screen : null;
        if (!screen) return;

        if (navigationRef.isReady()) {
          navigationRef.navigate(screen);
        } else {
          pendingRoute.current = screen;
        }
      }
    );

    responseListener.current = sub;

    return () => {
      try {
        responseListener.current &&
          responseListener.current.remove &&
          responseListener.current.remove();
      } catch {}
      responseListener.current = null;
    };
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (next) => {
      appStateRef.current = next;
    });
    return () => sub.remove();
  }, []);

  return (
    <UserProvider>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          if (pendingRoute.current) {
            navigationRef.navigate(pendingRoute.current);
            pendingRoute.current = null;
          }
        }}
      >
        <RootNavigator />
      </NavigationContainer>
      <Toast />
    </UserProvider>
  );
};

export default App;
