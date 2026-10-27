import { memo, useRef } from 'react';

/**
 * Una casilla del tablero. Recibe solo props primitivas, así memo puede
 * comparar y no vuelve a pintar las celdas que no han cambiado.
 */
function Celda({ fila, columna, abierta, bandera, mina, explotada, vecinas, perdida, onAbrir, onBandera }) {
  const temporizador = useRef(null);
  const larga = useRef(false);

  let clases = 'celda';
  let contenido = '';
  if (abierta) {
    clases += ' abierta';
    if (mina) {
      clases += explotada ? ' mina explotada' : ' mina';
      contenido = '💣';
    } else if (vecinas > 0) {
      clases += ` n${vecinas}`;
      contenido = vecinas;
    }
  } else if (bandera) {
    clases += ' bandera';
    contenido = '🚩';
    if (perdida && !mina) clases += ' error-bandera';
  }

  // Pulsación larga en móvil = bandera
  const inicioToque = () => {
    larga.current = false;
    temporizador.current = setTimeout(() => {
      larga.current = true;
      onBandera(fila, columna);
    }, 450);
  };
  const finToque = (e) => {
    clearTimeout(temporizador.current);
    if (larga.current) e.preventDefault();
  };

  return (
    <button
      type="button"
      className={clases}
      disabled={abierta}
      aria-label={`Fila ${fila + 1}, columna ${columna + 1}`}
      onClick={() => onAbrir(fila, columna)}
      onContextMenu={(e) => { e.preventDefault(); onBandera(fila, columna); }}
      onTouchStart={inicioToque}
      onTouchEnd={finToque}
      onTouchMove={() => clearTimeout(temporizador.current)}
    >
      {contenido}
    </button>
  );
}

export default memo(Celda);
