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
import PlanVersesYearScreen from "@/screens/planVersesYearScreen/PlanVersesYearScreen";
import AboutAppScreen from "@/screens/aboutAppScreen/AboutAppScreen";
import LoginScreen from "@/screens/loginScreen/LoginScreen";
import ProfileScreen from "@/screens/profileScreen/ProfileScreen";
import AdminScreen from "@/screens/adminScreen/AdminScreen";
import AnnouncementsScreen from "@/screens/announcementsScreen/AnnouncementsScreen";
import YouTubeScreen from "@/screens/youTubeScreen/YouTubeScreen";
import AboutChurchScreen from "@/screens/aboutChurchScreen/AboutChurchScreen";
import LinkDonateScreen from "@/screens/donateScreens/LinkDonateScreen";

import "@/i18n";

const MainNavigator = () => {
  const { isAdmin, isAuthenticated } = useUser();
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
        options={{ title: "Donate" }}
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
      {isAuthenticated && (
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: "Profile" }}
        />
      )}
      {isAuthenticated && isAdmin && (
        <Stack.Screen name="Admin" component={AdminScreen} />
      )}
      <Stack.Screen
        name="AboutApp"
        component={AboutAppScreen}
        options={{ title: "About App" }}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  const navigationRef = useNavigationContainerRef();
  const responseListener = useRef();

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  useEffect(() => {
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
