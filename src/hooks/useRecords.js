import { useCallback, useState } from 'react';

const CLAVE = 'buscaminas-react-records';
const clave = ({ filas, columnas, minas }) => `${filas}x${columnas}-${minas}`;

function leer() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE)) ?? {};
  } catch {
    return {};
  }
}

/** Mejores tiempos por configuración, persistidos en localStorage. */
export function useRecords() {
  const [records, setRecords] = useState(leer);

  const mejorTiempo = useCallback((config) => records[clave(config)] ?? null, [records]);

  /** Guarda el tiempo si es récord y devuelve true en ese caso. */
  const registrar = useCallback((config, segundos) => {
    const actual = records[clave(config)];
    if (actual != null && actual <= segundos) return false;
    const nuevos = { ...records, [clave(config)]: segundos };
    setRecords(nuevos);
    try {
      localStorage.setItem(CLAVE, JSON.stringify(nuevos));
    } catch {
      /* sin almacenamiento: el juego sigue funcionando */
    }
    return true;
  }, [records]);

  return { mejorTiempo, registrar };
}
