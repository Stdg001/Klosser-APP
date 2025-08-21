export async function APIconnection(endpoint = '', data = null, method = 'GET', debug = false) {
  const options = {
    method,
    credentials: 'include',
  };

  if (data && method !== 'GET') {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`/api/${endpoint}`, options);

    if (debug) {
      const clone = response.clone();
      const rawResponse = await clone.text();
      console.log("Raw response:", rawResponse); // Ver qué devuelve realmente el servidor
    }

    const json = await response.json().catch(() => {
      throw new Error('La respuesta no es JSON válido');
    });

    if (!response.ok || !json.success) {
      throw new Error(json.error || 'Error en la solicitud');
    }

    return json;

  } catch (error) {
    if (debug) console.error('API Error:', error);
    throw error;
  }
}

export function currentDate() {
  // Obtener la fecha actual
  const hoy = new Date();
  
  // Extraer año, mes y día
  const año = hoy.getFullYear();
  const mes = hoy.getMonth() + 1; 
  const dia = hoy.getDate();
  
  // Formatear con ceros a la izquierda si es necesario
  const mesFormateado = mes < 10 ? `0${mes}` : mes;
  const diaFormateado = dia < 10 ? `0${dia}` : dia;
  
  return `${año}-${mesFormateado}-${diaFormateado}`;
};

export const deepParseJson = (obj) => {
  if (typeof obj === 'string') {
    try {
      obj = JSON.parse(obj);
    } catch (e) {
      return obj; // Si falla, mantiene el string
    }
  }

  if (typeof obj === 'object' && obj !== null) {
    Object.keys(obj).forEach(key => {
      obj[key] = deepParseJson(obj[key]); // Recursividad para propiedades anidadas
    });
  }

  return obj;
};

export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};
