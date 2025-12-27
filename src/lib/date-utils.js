/**
 * Obtiene año y quarter actuales
 * @returns {{ year: number, quarter: number }}
 */
export function getCurrentYearQuarter() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1-12
  const quarter = Math.ceil(month / 3); // 1-4
  return { year, quarter };
}

/**
 * Obtiene rango de fechas de un quarter
 * @param {number} quarter - 1-4
 * @returns {string} "Enero — Marzo"
 */
export function getQuarterDateRange(quarter) {
  const ranges = {
    1: "Enero — Marzo",
    2: "Abril — Junio",
    3: "Julio — Septiembre",
    4: "Octubre — Diciembre"
  };
  return ranges[quarter] || "";
}

/**
 * Obtiene día del mes actual
 * @returns {number}
 */
export function getCurrentDayOfMonth() {
  return new Date().getDate();
}
