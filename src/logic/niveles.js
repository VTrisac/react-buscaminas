export const NIVELES = {
  facil: { etiqueta: 'Fácil', filas: 8, columnas: 8, minas: 10 },
  medio: { etiqueta: 'Medio', filas: 16, columnas: 16, minas: 40 },
  dificil: { etiqueta: 'Difícil', filas: 16, columnas: 30, minas: 99 },
};

/** Valida una configuración personalizada y devuelve un mensaje de error o null. */
export function validarPersonalizado({ filas, columnas, minas }) {
  if ([filas, columnas, minas].some((n) => Number.isNaN(n))) return 'Rellena filas, columnas y minas.';
  if (filas < 5 || filas > 24 || columnas < 5 || columnas > 30) return 'Filas entre 5 y 24, columnas entre 5 y 30.';
  const max = filas * columnas - 9;
  if (minas < 1 || minas > max) return `Las minas deben estar entre 1 y ${max}.`;
  return null;
}
