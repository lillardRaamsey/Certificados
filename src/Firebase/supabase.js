// supabase.js
import { createClient } from '@supabase/supabase-js';

// ============================================
// CONFIGURACIÓN DE SUPABASE
// ============================================
// Reemplaza estos valores con los de tu proyecto
const supabaseUrl = 'https://ebzgcevhjqrukgjylmis.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViemdjZXZoanFydWtnanlsbWlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1Nzc2NjUsImV4cCI6MjA3NzE1MzY2NX0.an-NQoih6Uj62S_5V6qCkGqBXx2ImscX1HoDTFucMrM'; // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...


// Crear cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});

// ============================================
// FUNCIÓN PARA AUTENTICAR AUTOMÁTICAMENTE
// ============================================
let authenticating = false;

export async function authenticateSupabase() {
  // Evitar múltiples autenticaciones simultáneas
  if (authenticating) {
    console.log('Ya se está autenticando...');
    return null;
  }

  try {
    authenticating = true;

    // Verificar si ya hay una sesión activa
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (session && !sessionError) {
      console.log('✅ Ya hay sesión activa en Supabase:', session.user.id);
      return session;
    }

    console.log('🔐 Creando sesión anónima en Supabase...');

    // Crear sesión anónima
    const { data, error } = await supabase.auth.signInAnonymously();
    
    if (error) {
      console.error('❌ Error al autenticar en Supabase:', error.message);
      throw error;
    }

    console.log('✅ Sesión anónima creada:', data.session?.user.id);
    return data.session;

  } catch (error) {
    console.error('❌ Error en authenticateSupabase:', error);
    return null;
  } finally {
    authenticating = false;
  }
}

// ============================================
// FUNCIÓN PARA VERIFICAR AUTENTICACIÓN
// ============================================
export async function ensureAuthenticated() {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return await authenticateSupabase();
  }
  
  return session;
}

// ============================================
// FUNCIÓN PARA CERRAR SESIÓN
// ============================================
export async function signOutSupabase() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Error al cerrar sesión:', error);
    return false;
  }
  
  console.log('Sesión cerrada en Supabase');
  return true;
}

// ============================================
// SERVICIO DE ARCHIVOS CON SUPABASE
// ============================================
export const supabaseFileService = {
  // Subir archivo
  async uploadFile(file, options = {}) {
    try {
      // Asegurar autenticación
      await ensureAuthenticated();

      const {
        userId,
        bucketName = 'certificar',
        folder = '',
        customFileName = null
      } = options;

      // Generar nombre único
      const timestamp = Date.now();
      const fileName = customFileName || `${timestamp}_${file.name}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      console.log('📤 Subiendo archivo:', filePath);

      // Subir a Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('❌ Error al subir archivo:', error);
        throw error;
      }

      console.log('✅ Archivo subido exitosamente:', data.path);

      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      return {
        success: true,
        path: data.path,
        url: urlData.publicUrl,
        fileName: file.name,
        size: file.size,
        type: file.type
      };

    } catch (error) {
      console.error('❌ Error en uploadFile:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Eliminar archivo
  async deleteFile(filePath, bucketName = 'certificar') {
    try {
      await ensureAuthenticated();

      console.log('🗑️ Eliminando archivo:', filePath);

      const { error } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);

      if (error) {
        console.error('❌ Error al eliminar archivo:', error);
        throw error;
      }

      console.log('✅ Archivo eliminado exitosamente');
      return { success: true };

    } catch (error) {
      console.error('❌ Error en deleteFile:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Listar archivos
  async listFiles(folder = '', bucketName = 'certificar') {
    try {
      await ensureAuthenticated();

      const { data, error } = await supabase.storage
        .from(bucketName)
        .list(folder, {
          limit: 100,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        console.error('❌ Error al listar archivos:', error);
        throw error;
      }

      return {
        success: true,
        files: data
      };

    } catch (error) {
      console.error('❌ Error en listFiles:', error);
      return {
        success: false,
        error: error.message,
        files: []
      };
    }
  },

  // Obtener URL pública
  getPublicUrl(filePath, bucketName = 'certificar') {
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  // Descargar archivo
  downloadFile(url, fileName) {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// ============================================
// LISTENER DE CAMBIOS DE AUTENTICACIÓN
// ============================================
supabase.auth.onAuthStateChange((event, session) => {
  console.log('🔄 Estado de autenticación cambió:', event);
  
  if (event === 'SIGNED_IN') {
    console.log('✅ Usuario autenticado:', session?.user.id);
  } else if (event === 'SIGNED_OUT') {
    console.log('👋 Usuario desautenticado');
  } else if (event === 'TOKEN_REFRESHED') {
    console.log('🔄 Token renovado');
  }
});

export default supabase;