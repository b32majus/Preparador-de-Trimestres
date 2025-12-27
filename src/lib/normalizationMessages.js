/**
 * Mensajes de normalización para la pantalla de trimestre
 * Objetivo: Reducir ansiedad y normalizar dudas
 */

const NORMALIZATION_MESSAGES = [
  {
    icon: 'lightbulb',
    title: 'Tranquilidad:',
    message: 'El 70% de usuarios marca al menos un ítem como dudoso. Es completamente normal y tu asesor lo revisará.'
  },
  {
    icon: 'lightbulb',
    title: 'Recuerda:',
    message: 'Marcar algo como dudoso es señal de profesionalidad, no de incompetencia. Tu asesor prefiere revisar que asumir.'
  },
  {
    icon: 'spa',
    title: 'Respira:',
    message: 'No tienes que saberlo todo. Para eso tienes un asesor. Tu trabajo es organizar, no calcular.'
  },
  {
    icon: 'check_circle',
    title: 'Vas bien:',
    message: 'La mayoría de usuarios tienen 2-3 dudas por trimestre. Mejor preguntar ahora que corregir después.'
  },
  {
    icon: 'info',
    title: 'Dato curioso:',
    message: 'Los usuarios que marcan más ítems como dudosos suelen encontrar más deducciones al final. Preguntar sale rentable.'
  }
];

/**
 * Retorna un mensaje de normalización aleatorio
 */
export function getRandomNormalizationMessage() {
  const randomIndex = Math.floor(Math.random() * NORMALIZATION_MESSAGES.length);
  return NORMALIZATION_MESSAGES[randomIndex];
}

/**
 * Retorna todos los mensajes (útil para testing)
 */
export function getAllNormalizationMessages() {
  return NORMALIZATION_MESSAGES;
}
