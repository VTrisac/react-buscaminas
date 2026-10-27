import { useEffect, useState } from 'react';

/** Cuenta segundos mientras `activo` sea true. `reiniciar` lo pone a 0. */
export function useCronometro(activo) {
  const [segundos, setSegundos] = useState(0);

  useEffect(() => {
    if (!activo) return undefined;
    const id = setInterval(() => setSegundos((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [activo]);

  return [segundos, () => setSegundos(0)];
}
