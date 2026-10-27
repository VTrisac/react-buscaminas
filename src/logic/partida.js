// Reducer de la partida. La lógica de tablero.js muta, así que cada acción
// trabaja sobre una copia profunda: el estado de React nunca se modifica en sitio.
import { ESTADO, crearTablero, abrir, alternarBandera } from './tablero.js';

export const estadoInicial = (config) => crearTablero(config.filas, config.columnas, config.minas);

export function partidaReducer(tablero, accion) {
  switch (accion.tipo) {
    case 'nueva':
      return estadoInicial(accion.config);
    case 'abrir': {
      if (tablero.estado !== ESTADO.JUGANDO) return tablero;
      const copia = structuredClone(tablero);
      abrir(copia, accion.fila, accion.columna);
      if (copia.estado === ESTADO.GANADO) {
        // Al ganar se marcan las minas que quedaban
        copia.celdas.flat().forEach((c) => { if (c.mina) c.bandera = true; });
      }
      return copia;
    }
    case 'bandera': {
      const copia = structuredClone(tablero);
      return alternarBandera(copia, accion.fila, accion.columna) ? copia : tablero;
    }
    default:
      throw new Error(`Acción desconocida: ${accion.tipo}`);
  }
}
