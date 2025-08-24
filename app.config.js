const ENV = process.env.APP_ENV || "development";

const CONFIG = {
  development: {
    API_URL: "http://localhost:8090",
  },
  production: {
    API_URL: "https://server.churchriveroflife.com",
  },
};

export default () => ({
  expo: {
    name: "Church River of Life",
    slug: "churchapp",
    version: "1.3.0",
    scheme: "churchapp",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.bashtandrey.churchapp",
      buildNumber: "31",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSAppTransportSecurity: {
          NSAllowsArbitraryLoads: true
        }
      }
    },
    android: {
      package: "com.bashtandrey.churchapp",
      versionCode: 32,
      usesCleartextTraffic: true,
      edgeToEdgeEnabled: true,
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      }
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      eas: {
        projectId: "4cf76abd-77bc-4b75-9458-881f18c0405b"
      },
      API_URL: CONFIG[ENV].API_URL,
      APP_ENV: ENV
    },
    owner: "bashtandrey",
    plugins: [
      "expo-secure-store",
      [
        "expo-build-properties",
        {
          ios: {
            deploymentTarget: "15.1",
            useFrameworks: "static",
            podfileProperties: {
              "use_modular_headers!": "true"
            },
            buildSettings: {
              "GCC_TREAT_WARNINGS_AS_ERRORS": "NO",
              "WARNING_CFLAGS": "-Wno-strict-prototypes"
            }
          }
        }
      ]
    ]
  }
});