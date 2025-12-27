/**
 * Sistema de microcopy contextual para Preparador de Trimestres
 * Retorna mensajes empáticos basados en el progreso del usuario y el día del mes
 */

export function getContextualMessage(progress, dayOfMonth, lastVisit = null) {
  // Día 1-10 + progreso < 30%: Inicio tranquilo
  if (dayOfMonth <= 10 && progress < 30) {
    return {
      icon: 'spa',
      title: 'Acabas de empezar.',
      message: 'Tranquilo. Tienes todo el mes por delante.'
    };
  }

  // Día 10-15 + progreso 40-70%: Avance positivo
  if (dayOfMonth <= 15 && progress >= 40 && progress < 70) {
    return {
      icon: 'spa',
      title: 'Vas por la mitad.',
      message: 'Esto ya es más de lo que la mayoría hace a estas alturas. Tómate un respiro si lo necesitas.'
    };
  }

  // Día 15-20 + progreso < 50%: Empujón suave
  if (dayOfMonth <= 20 && progress < 50) {
    return {
      icon: 'notifications_active',
      title: 'Aún queda un poco.',
      message: 'Estás en la recta final. Un último empujón y lo tendrás listo.'
    };
  }

  // Progreso >= 80%: Casi terminado (cualquier día)
  if (progress >= 80) {
    return {
      icon: 'celebration',
      title: 'Casi terminado.',
      message: 'Ya queda muy poco. El esfuerzo ha valido la pena.'
    };
  }

  // Default: Mensaje neutro de ánimo
  return {
    icon: 'spa',
    title: 'Sigue así.',
    message: 'Cada documento que añades es un paso menos de preocupación.'
  };
}

/**
 * Mensaje de celebración al cerrar el trimestre
 */
export function getClosureMessage(quarter, year) {
  return {
    icon: 'check_circle',
    title: '¡Trimestre cerrado!',
    message: `Q${quarter}/${year} está listo para enviar. Puedes soltar esto de tu cabeza.`
  };
}

/**
 * Mensaje al marcar un ítem como dudoso
 */
export function getDoubtfulItemMessage() {
  const messages = [
    'Perfecto. Tu asesor lo revisará.',
    'Bien marcado. Es mejor preguntar que asumir.',
    'Tranquilo, tu asesor está para esto.',
    'Dudas = profesionalidad. Vas bien.'
  ];

  return messages[Math.floor(Math.random() * messages.length)];
}
