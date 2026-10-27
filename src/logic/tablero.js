// Lógica pura del Buscaminas: no toca el DOM, así se puede probar por separado.

export const ESTADO = { JUGANDO: 'jugando', GANADO: 'ganado', PERDIDO: 'perdido' };

/** Crea un tablero vacío; las minas se colocan en el primer clic. */
export function crearTablero(filas, columnas, minas) {
  if (minas >= filas * columnas) throw new Error('Demasiadas minas para el tablero');
  const celdas = [];
  for (let f = 0; f < filas; f++) {
    const fila = [];
    for (let c = 0; c < columnas; c++) {
      fila.push({ fila: f, columna: c, mina: false, abierta: false, bandera: false, vecinas: 0 });
    }
    celdas.push(fila);
  }
  return { filas, columnas, minas, celdas, minasColocadas: false, abiertas: 0, estado: ESTADO.JUGANDO };
}

/** Devuelve las celdas que rodean a (f, c), sin salirse del tablero. */
export function vecinas(tablero, f, c) {
  const res = [];
  for (let df = -1; df <= 1; df++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (df === 0 && dc === 0) continue;
      const nf = f + df;
      const nc = c + dc;
      if (nf >= 0 && nf < tablero.filas && nc >= 0 && nc < tablero.columnas) res.push(tablero.celdas[nf][nc]);
    }
  }
  return res;
}

/**
 * Coloca las minas al azar evitando la celda del primer clic y sus vecinas,
 * para que la primera jugada nunca pierda y abra una zona.
 */
export function colocarMinas(tablero, filaSegura, columnaSegura, aleatorio = Math.random) {
  const protegidas = new Set([`${filaSegura},${columnaSegura}`]);
  vecinas(tablero, filaSegura, columnaSegura).forEach((v) => protegidas.add(`${v.fila},${v.columna}`));
  // Si el tablero es tan pequeño que no caben, solo se protege la celda pulsada
  if (tablero.filas * tablero.columnas - protegidas.size < tablero.minas) {
    protegidas.clear();
    protegidas.add(`${filaSegura},${columnaSegura}`);
  }

  const candidatas = tablero.celdas.flat().filter((cel) => !protegidas.has(`${cel.fila},${cel.columna}`));
  // Fisher-Yates parcial: se barajan solo las posiciones que hacen falta
  for (let i = 0; i < tablero.minas; i++) {
    const j = i + Math.floor(aleatorio() * (candidatas.length - i));
    [candidatas[i], candidatas[j]] = [candidatas[j], candidatas[i]];
    candidatas[i].mina = true;
  }

  tablero.celdas.flat().forEach((cel) => {
    cel.vecinas = vecinas(tablero, cel.fila, cel.columna).filter((v) => v.mina).length;
  });
  tablero.minasColocadas = true;
}

/**
 * Abre una celda. Si es 0, abre en cascada las adyacentes (recorrido en anchura
 * con una cola, para no desbordar la pila en tableros grandes).
 * Devuelve la lista de celdas que se han abierto.
 */
export function abrir(tablero, f, c) {
  if (tablero.estado !== ESTADO.JUGANDO) return [];
  if (!tablero.minasColocadas) colocarMinas(tablero, f, c);

  const inicial = tablero.celdas[f][c];
  if (inicial.abierta || inicial.bandera) return [];

  if (inicial.mina) {
    inicial.abierta = true;
    inicial.explotada = true;
    tablero.estado = ESTADO.PERDIDO;
    tablero.celdas.flat().forEach((cel) => { if (cel.mina) cel.abierta = true; });
    return [inicial];
  }

  const abiertas = [];
  const cola = [inicial];
  inicial.abierta = true;
  while (cola.length) {
    const actual = cola.shift();
    abiertas.push(actual);
    if (actual.vecinas === 0) {
      for (const v of vecinas(tablero, actual.fila, actual.columna)) {
        if (!v.abierta && !v.bandera && !v.mina) {
          v.abierta = true;
          cola.push(v);
        }
      }
    }
  }
  tablero.abiertas += abiertas.length;
  if (tablero.abiertas === tablero.filas * tablero.columnas - tablero.minas) tablero.estado = ESTADO.GANADO;
  return abiertas;
}

/** Pone o quita una bandera en una celda cerrada. */
export function alternarBandera(tablero, f, c) {
  const celda = tablero.celdas[f][c];
  if (tablero.estado !== ESTADO.JUGANDO || celda.abierta) return false;
  celda.bandera = !celda.bandera;
  return true;
}

export const banderasPuestas = (tablero) => tablero.celdas.flat().filter((cel) => cel.bandera).length;
