-- Crear tablas para la aplicación FitSync

-- Tabla de usuarios (extiende la tabla auth.users de Supabase)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
    email TEXT NOT NULL,
    nombre TEXT,
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT now(),
    avatar_url TEXT,
    configuracion JSONB DEFAULT '{}'::JSONB,
    CONSTRAINT users_email_key UNIQUE (email)
);

-- Tabla de dispositivos
CREATE TABLE public.devices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users NOT NULL,
    marca TEXT NOT NULL,
    modelo TEXT,
    identificador_sincronizacion TEXT NOT NULL,
    token_acceso TEXT,
    token_refresco TEXT,
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT now(),
    ultima_sincronizacion TIMESTAMP WITH TIME ZONE,
    estado TEXT DEFAULT 'activo',
    CONSTRAINT devices_user_id_identificador_key UNIQUE (user_id, identificador_sincronizacion)
);

-- Tabla de actividades
CREATE TABLE public.activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users NOT NULL,
    device_id UUID REFERENCES public.devices,
    tipo TEXT NOT NULL,
    duracion INTEGER NOT NULL, -- en minutos
    distancia DECIMAL(10, 2), -- en kilómetros
    calorias INTEGER,
    fecha TIMESTAMP WITH TIME ZONE NOT NULL,
    datos_adicionales JSONB DEFAULT '{}'::JSONB,
    notas TEXT
);

-- Tabla de métricas
CREATE TABLE public.metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users NOT NULL,
    device_id UUID REFERENCES public.devices,
    fecha TIMESTAMP WITH TIME ZONE NOT NULL,
    frecuencia_cardiaca_promedio INTEGER,
    frecuencia_cardiaca_max INTEGER,
    frecuencia_cardiaca_min INTEGER,
    pasos INTEGER,
    sueño_minutos INTEGER,
    sueño_calidad TEXT,
    datos_adicionales JSONB DEFAULT '{}'::JSONB
);

-- Tabla de sesiones de sincronización
CREATE TABLE public.sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users NOT NULL,
    device_id UUID REFERENCES public.devices NOT NULL,
    hora_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    hora_fin TIMESTAMP WITH TIME ZONE,
    estado TEXT DEFAULT 'en_progreso',
    resumen_datos JSONB DEFAULT '{}'::JSONB,
    error TEXT
);

-- Configurar Row Level Security (RLS)

-- Política para usuarios: solo pueden ver y modificar sus propios datos
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY users_policy ON public.users
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- Política para dispositivos: solo pueden ver y modificar sus propios dispositivos
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
CREATE POLICY devices_policy ON public.devices
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Política para actividades: solo pueden ver y modificar sus propias actividades
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY activities_policy ON public.activities
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Política para métricas: solo pueden ver y modificar sus propias métricas
ALTER TABLE public.metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY metrics_policy ON public.metrics
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Política para sesiones: solo pueden ver y modificar sus propias sesiones
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY sessions_policy ON public.sessions
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Crear función para insertar un nuevo usuario cuando se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, nombre)
  VALUES (NEW.id, NEW.email, split_part(NEW.email, '@', 1));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear un nuevo usuario cuando se registra
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

