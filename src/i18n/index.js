import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

import enAboutApp from "@/locales/en/aboutApp.json";
import ruAboutApp from "@/locales/ru/aboutApp.json";

import ruDailyReadingPlan from "@/locales/ru/dailyReadingPlan.json";
import enDailyReadingPlan from "@/locales/en/dailyReadingPlan.json";

import enAboutChurch from "@/locales/en/aboutChurch.json";
import ruAboutChurch from "@/locales/ru/aboutChurch.json";

import enPlanYearVerse from "@/locales/en/planYearVerse.json";
import ruPlanYearVerse from "@/locales/ru/planYearVerse.json";

import enCommon from "@/locales/en/common.json";
import ruCommon from "@/locales/ru/common.json";

import enSetDayVerse from "@/locales/en/setDayVerse.json";
import ruSetDayVerse from "@/locales/ru/setDayVerse.json";

import enBiblePicker from "@/locales/en/biblePicker.json";
import ruBiblePicker from "@/locales/ru/biblePicker.json";

import enProfileScreen from "@/locales/en/profileScreen.json";
import ruProfileScreen from "@/locales/ru/profileScreen.json";

import enEventsChurch from "@/locales/en/eventsChurch.json";
import ruEventsChurch from "@/locales/ru/eventsChurch.json";

import enUserCreateForm from "@/locales/en/userCreateForm.json";
import ruUserCreateForm from "@/locales/ru/userCreateForm.json";

const resources = {
  en: {
    aboutApp: enAboutApp,
    dailyReadingPlan: enDailyReadingPlan,
    aboutChurch: enAboutChurch,
    planYearVerse: enPlanYearVerse,
    common: enCommon,
    setDayVerse: enSetDayVerse,
    biblePicker: enBiblePicker,
    profileScreen: enProfileScreen,
    eventsChurch: enEventsChurch,
    userCreateForm: enUserCreateForm,
  },
  ru: {
    aboutApp: ruAboutApp,
    dailyReadingPlan: ruDailyReadingPlan,
    aboutChurch: ruAboutChurch,
    planYearVerse: ruPlanYearVerse,
    common: ruCommon,
    setDayVerse: ruSetDayVerse,
    biblePicker: ruBiblePicker,
    profileScreen: ruProfileScreen,
    eventsChurch: ruEventsChurch,
    userCreateForm: ruUserCreateForm,
  },
};

const locale =
  typeof Localization.locale === "string" ? Localization.locale : "en";

const lng = locale.startsWith("en") ? "en" : "ru";
i18n.use(initReactI18next).init({
  resources,
  lng,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
