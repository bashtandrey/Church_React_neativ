import React, { useEffect, useRef } from "react";
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

import { AppState, AppStateStatus } from "react-native";
import RNRestart from "react-native-restart";

import "@/i18n";

const MainNavigator = () => {
  const { isAuthenticated } = useUser();
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerBackVisible: false,
      }}
    >
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
        name="LogIn"
        component={LoginScreen}
        options={{ title: "Login" }}
      />
      <Stack.Screen
        name="AboutApp"
        component={AboutAppScreen}
        options={{ title: "About App" }}
      />

      {isAuthenticated && (
        <>
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
            name="EventsChurchScreen"
            component={EventsChurchScreen}
            options={{ title: "Events Church" }}
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
    </Stack.Navigator>
  );
};

const App = () => {
  const navigationRef = useNavigationContainerRef();
  const responseListener = useRef();

  const appStateRef = useRef(AppState.currentState);
  const lastReloadAt = useRef(0);

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

    // Слушатель — при нажатии на уведомление
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const screen = response.notification.request.content.data?.screen;
        console.log("APP:➡️ Переход по уведомлению:", screen);

        if (screen) {
          navigationRef.current?.navigate(screen);
        }
      });

    return () => {
      responseListener.current?.remove();
    };
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (next) => {
      const prev = appStateRef.current;
      appStateRef.current = next;

      if ((prev === "background" || prev === "inactive") && next === "active") {
        if (Date.now() - lastReloadAt.current > 5000) {
          lastReloadAt.current = Date.now();
          RNRestart.restart(); // полный рестарт приложения
        }
      }
    });
    return () => sub.remove();
  }, []);

  return (
    <UserProvider>
      <NavigationContainer ref={navigationRef}>
        <MainNavigator />
      </NavigationContainer>
      <Toast />
    </UserProvider>
  );
};

export default App;
