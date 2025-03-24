export default {
  name: "FitSync",
  slug: "fitsync",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.yourcompany.fitsync",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#FFFFFF",
    },
    package: "com.yourcompany.fitsync",
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  extra: {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    polarClientId: process.env.POLAR_CLIENT_ID,
    polarClientSecret: process.env.POLAR_CLIENT_SECRET,
    polarRedirectUri: process.env.POLAR_REDIRECT_URI,
  },
  plugins: ["expo-secure-store", "expo-background-fetch", "expo-notifications"],
  scheme: "fitsync",
}

