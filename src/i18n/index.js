import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

import enAboutApp from "@/locales/en/aboutApp.json";
import ruAboutApp from "@/locales/ru/aboutApp.json";
import uaAboutApp from "@/locales/ua/aboutApp.json";

import ruDailyReadingPlan from "@/locales/ru/dailyReadingPlan.json";
import enDailyReadingPlan from "@/locales/en/dailyReadingPlan.json";
import uaDailyReadingPlan from "@/locales/ua/dailyReadingPlan.json";

import enAboutChurch from "@/locales/en/aboutChurch.json";
import ruAboutChurch from "@/locales/ru/aboutChurch.json";
import uaAboutChurch from "@/locales/ua/aboutChurch.json";

import enPlanYearVerse from "@/locales/en/planYearVerse.json";
import ruPlanYearVerse from "@/locales/ru/planYearVerse.json";
import uaPlanYearVerse from "@/locales/ua/planYearVerse.json";

import enCommon from "@/locales/en/common.json";
import ruCommon from "@/locales/ru/common.json";
import uaCommon from "@/locales/ua/common.json";

import enSetDayVerse from "@/locales/en/setDayVerse.json";
import ruSetDayVerse from "@/locales/ru/setDayVerse.json";
import uaSetDayVerse from "@/locales/ua/setDayVerse.json";

import enBiblePicker from "@/locales/en/biblePicker.json";
import uaBiblePicker from "@/locales/ua/biblePicker.json";
import ruBiblePicker from "@/locales/ru/biblePicker.json";

import enProfileScreen from "@/locales/en/profileScreen.json";
import ruProfileScreen from "@/locales/ru/profileScreen.json";
import uaProfileScreen from "@/locales/ua/profileScreen.json";

import enEventsChurch from "@/locales/en/eventsChurch.json";
import ruEventsChurch from "@/locales/ru/eventsChurch.json";
import uaEventsChurch from "@/locales/ua/eventsChurch.json";

import enUserCreateForm from "@/locales/en/userCreateForm.json";
import ruUserCreateForm from "@/locales/ru/userCreateForm.json";
import uaUserCreateForm from "@/locales/ua/userCreateForm.json";

import enRequestMember from "@/locales/en/requestMember.json";
import ruRequestMember from "@/locales/ru/requestMember.json";
import uaRequestMember from "@/locales/ua/requestMember.json";

import enManageGroup from "@/locales/en/manageGroupScreen.json";
import ruManageGroup from "@/locales/ru/manageGroupScreen.json";
import uaManageGroup from "@/locales/ua/manageGroupScreen.json";

import uaDonateScreen from "@/locales/ua/donateScreen.json";
import enDonateScreen from "@/locales/en/donateScreen.json";
import ruDonateScreen from "@/locales/ru/donateScreen.json";

import uaVerseDayCard from "@/locales/ua/verseDayCard.json";
import enVerseDayCard from "@/locales/en/verseDayCard.json";
import ruVerseDayCard from "@/locales/ru/verseDayCard.json";

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
    requestMember: enRequestMember,
    manageGroupScreen: enManageGroup,
    donateScreen: enDonateScreen,
    verseDayCard: enVerseDayCard,
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
    requestMember: ruRequestMember,
    manageGroupScreen: ruManageGroup,
    donateScreen: ruDonateScreen,
    verseDayCard: ruVerseDayCard,
  },
  ua: {
    aboutApp: uaAboutApp,
    dailyReadingPlan: uaDailyReadingPlan,
    aboutChurch: uaAboutChurch,
    planYearVerse: uaPlanYearVerse,
    common: uaCommon,
    setDayVerse: uaSetDayVerse,
    biblePicker: uaBiblePicker,
    profileScreen: uaProfileScreen,
    eventsChurch: uaEventsChurch,
    userCreateForm: uaUserCreateForm,
    requestMember: uaRequestMember,
    manageGroupScreen: uaManageGroup,
    donateScreen: uaDonateScreen,
    verseDayCard: uaVerseDayCard,
  },
};

const locale =
  typeof Localization.locale === "string" ? Localization.locale : "en";

const lng = locale.startsWith("en") ? "en" : "ua";
i18n.use(initReactI18next).init({
  resources,
  lng,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
