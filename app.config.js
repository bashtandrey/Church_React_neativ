const ENV = process.env.APP_ENV || "development";

const CONFIG = {
  development: {
    API_URL: "http://192.168.1.154:8090",
  },
  development1: {
    API_URL: "http://192.168.0.110:8090",
  },
  production: {
    API_URL: "https://server.churchriveroflife.com",
  },
};

export default () => ({
  expo: {
    name: "Church River of Life",
    slug: "churchapp",
    version: "1.3.1",
    scheme: "churchapp",
    orientation: "portrait",
    icon: "./src/assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./src/assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.bashtandrey.churchapp",
      buildNumber: "40",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSAppTransportSecurity: {
          NSAllowsArbitraryLoads: true,
        },
        NSFaceIDUsageDescription: "This app uses Face ID for authentication",
      },
    },
    android: {
      package: "com.bashtandrey.churchapp",
      versionCode: "41",
      edgeToEdgeEnabled: true,
      adaptiveIcon: {
        foregroundImage: "./src/assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
    },
    web: {
      favicon: "./src/assets/favicon.png",
    },
    extra: {
      eas: {
        projectId: "4cf76abd-77bc-4b75-9458-881f18c0405b",
      },
      API_URL: CONFIG[ENV].API_URL,
      APP_ENV: ENV,
    },
    owner: "bashtandrey",
    plugins: [
      "expo-secure-store",
      "expo-font", 
      [
        "expo-build-properties",
        {
          ios: {
            deploymentTarget: "15.1",
            useFrameworks: "static",
            podfileProperties: {
              "use_modular_headers!": "true",
            },
            buildSettings: {
              GCC_TREAT_WARNINGS_AS_ERRORS: "NO",
              WARNING_CFLAGS: "-Wno-strict-prototypes",
            },
          },
        },
      ],
    ],
  },
});
