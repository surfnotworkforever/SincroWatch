/**
 * Script para verificar la conexión con Supabase
 * 
 * Este script puede ser ejecutado de forma independiente para
 * validar que la conexión con Supabase funciona correctamente.
 * 
 * Uso: ts-node src/scripts/verify-supabase-connection.ts
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Las variables de entorno SUPABASE_URL y SUPABASE_ANON_KEY deben estar configuradas');
  process.exit(1);
}

// Función para verificar la conexión con Supabase
async function verifySupabaseConnection() {
  console.log('Verificando conexión con Supabase...');
  
  try {
    // Crear cliente Supabase
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Comprobar conexión con la base de datos
    console.log('Intentando consultar la tabla "users"...');
    const { data, error } = await supabase.from('users').select('*').limit(1);
    
    if (error) {
      throw error;
    }
    
    console.log('✅ Conexión exitosa con Supabase!');
    console.log(`Datos obtenidos: ${JSON.stringify(data, null, 2)}`);
    
    // Comprobar servicio de autenticación
    console.log('\nVerificando servicio de autenticación...');
    const authResponse = await supabase.auth.getSession();
    
    if (authResponse.error) {
      throw authResponse.error;
    }
    
    console.log('✅ Servicio de autenticación funcionando correctamente!');
    
    // Comprobar otras tablas
    console.log('\nVerificando tablas de la aplicación...');
    const tables = ['devices', 'activities', 'metrics', 'sessions'];
    
    for (const table of tables) {
      console.log(`Intentando consultar la tabla "${table}"...`);
      const { error: tableError } = await supabase.from(table).select('count').limit(1);
      
      if (tableError) {
        console.warn(`⚠️ Error al consultar la tabla "${table}": ${tableError.message}`);
      } else {
        console.log(`✅ Tabla "${table}" accesible correctamente`);
      }
    }
    
    console.log('\n✅ Verificación completa');
    return true;
  } catch (error) {
    console.error('❌ Error al conectar con Supabase:', error);
    return false;
  }
}

// Ejecutar la verificación
verifySupabaseConnection()
  .then(success => {
    if (!success) {
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Error inesperado:', error);
    process.exit(1);
  }); 