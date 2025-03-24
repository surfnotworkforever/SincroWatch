import "react-native-gesture-handler"
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { NavigationContainer } from "@react-navigation/native"
import { SupabaseProvider } from "./src/contexts/SupabaseContext"
import RootNavigator from "./src/navigation/RootNavigator"
import { ThemeProvider } from "./src/contexts/ThemeContext"

export default function App() {
  return (
    <SafeAreaProvider>
      <SupabaseProvider>
        <ThemeProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <RootNavigator />
          </NavigationContainer>
        </ThemeProvider>
      </SupabaseProvider>
    </SafeAreaProvider>
  )
}

