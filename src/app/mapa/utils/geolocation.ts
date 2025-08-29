// src/utils/geolocation.ts

/**
 * Obtiene la ubicación actual del usuario (latitud y longitud).
 * @returns {Promise<{ lat: number; lon: number }>} Una promesa que resuelve con las coordenadas o rechaza con un error.
 */
export const getUserLocation = (): Promise<{ lat: number; lon: number }> => {
    return new Promise((resolve, reject) => {
      // Verifica si el navegador soporta la API de geolocalización
      if (!navigator.geolocation) {
        reject(new Error('La geolocalización no está soportada por tu navegador.'));
        return;
      }
  
      // Solicita la posición actual del usuario
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Resuelve la promesa con la latitud y longitud
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          // Rechaza la promesa con un mensaje de error específico según el código de error
          switch (error.code) {
            case error.PERMISSION_DENIED:
              reject(new Error("Permiso de ubicación denegado por el usuario."));
              break;
            case error.POSITION_UNAVAILABLE:
              reject(new Error("Información de ubicación no disponible."));
              break;
            case error.TIMEOUT:
              reject(new Error("La solicitud para obtener la ubicación ha caducado."));
              break;
            // ELIMINAMOS ESTE CASE, YA QUE 'UNKNOWN_ERROR' NO EXISTE COMO PROPIEDAD ESTÁTICA EN EL TIPO 'error'
            // case error.UNKNOWN_ERROR: // <--- ¡ELIMINAR O COMENTAR ESTA LÍNEA!
            //   reject(new Error("Un error desconocido ha ocurrido al obtener la ubicación."));
            //   break; 
            default: // El 'default' capturará el código 0 (UNKNOWN_ERROR) y cualquier otro error no especificado
              reject(new Error("Un error desconocido ha ocurrido al obtener la ubicación."));
          }
        },
        // Opciones para getCurrentPosition (opcional, pero útil)
        {
          enableHighAccuracy: true, // Solicita la mejor precisión posible
          timeout: 10000,           // Tiempo máximo en milisegundos para obtener la posición (10 segundos)
          maximumAge: 0             // No usar una posición en caché, forzar una nueva lectura
        }
      );
    });
  };