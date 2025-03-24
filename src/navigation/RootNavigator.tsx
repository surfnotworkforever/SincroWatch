import { createStackNavigator } from "@react-navigation/stack"
import { useSupabase } from "../contexts/SupabaseContext"
import AuthNavigator from "./AuthNavigator"
import MainNavigator from "./MainNavigator"
import LoadingScreen from "../screens/LoadingScreen"

const Stack = createStackNavigator()

const RootNavigator = () => {
  const { user, loading } = useSupabase()

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="Main" component={MainNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  )
}

export default RootNavigator

