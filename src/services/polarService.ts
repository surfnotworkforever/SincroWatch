import Constants from "expo-constants"

// Obtener las variables de entorno
const polarClientId = Constants.expoConfig?.extra?.polarClientId || ""
const polarClientSecret = Constants.expoConfig?.extra?.polarClientSecret || ""
const redirectUri = Constants.expoConfig?.extra?.polarRedirectUri || "fitsync://auth/polar/callback"

// Endpoints de la API de Polar
const POLAR_AUTH_URL = "https://flow.polar.com/oauth2/authorization"
const POLAR_TOKEN_URL = "https://polarremote.com/v2/oauth2/token"
const POLAR_API_URL = "https://www.polaraccesslink.com/v3"

/**
 * Inicia el proceso de conexión con un dispositivo Polar
 * @returns URL de autorización para OAuth 2.0
 */
export const connectToPolarDevice = async (): Promise<string> => {
  if (!polarClientId) {
    throw new Error("Polar Client ID no configurado")
  }

  // Generar URL de autorización
  const authUrl = `${POLAR_AUTH_URL}?client_id=${polarClientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}`

  return authUrl
}

/**
 * Intercambia el código de autorización por un token de acceso
 * @param authCode Código de autorización obtenido después de la redirección
 * @returns Tokens de acceso y actualización
 */
export const exchangeAuthCodeForToken = async (authCode: string) => {
  try {
    const response = await fetch(POLAR_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${polarClientId}:${polarClientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: authCode,
        redirect_uri: redirectUri,
      }).toString(),
    })

    if (!response.ok) {
      throw new Error(`Error al obtener token: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error al intercambiar código por token:", error)
    throw error
  }
}

/**
 * Registra un nuevo usuario en Polar AccessLink
 * @param accessToken Token de acceso
 * @param userId ID del usuario en nuestra aplicación
 * @returns Información del usuario registrado
 */
export const registerUser = async (accessToken: string, userId: string) => {
  try {
    const response = await fetch(`${POLAR_API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      body: JSON.stringify({
        "member-id": userId,
      }),
    })

    if (!response.ok) {
      throw new Error(`Error al registrar usuario: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error al registrar usuario en Polar:", error)
    throw error
  }
}

/**
 * Obtiene las sesiones de entrenamiento disponibles
 * @param accessToken Token de acceso
 * @param userId ID del usuario en Polar
 * @returns Lista de sesiones disponibles
 */
export const getAvailableExercises = async (accessToken: string, userId: string) => {
  try {
    const response = await fetch(`${POLAR_API_URL}/users/${userId}/exercise-transactions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Error al obtener ejercicios: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error al obtener ejercicios de Polar:", error)
    throw error
  }
}

/**
 * Obtiene los detalles de una sesión de entrenamiento
 * @param accessToken Token de acceso
 * @param exerciseUrl URL de la sesión de entrenamiento
 * @returns Detalles de la sesión
 */
export const getExerciseDetails = async (accessToken: string, exerciseUrl: string) => {
  try {
    const response = await fetch(exerciseUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Error al obtener detalles del ejercicio: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error al obtener detalles del ejercicio de Polar:", error)
    throw error
  }
}

/**
 * Obtiene los datos de actividad diaria
 * @param accessToken Token de acceso
 * @param userId ID del usuario en Polar
 * @returns Datos de actividad diaria
 */
export const getDailyActivity = async (accessToken: string, userId: string) => {
  try {
    const response = await fetch(`${POLAR_API_URL}/users/${userId}/activity-transactions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Error al obtener actividad diaria: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error al obtener actividad diaria de Polar:", error)
    throw error
  }
}

