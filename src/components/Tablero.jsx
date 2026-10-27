import Celda from './Celda.jsx';

export default function Tablero({ tablero, onAbrir, onBandera }) {
  const perdida = tablero.estado === 'perdido';
  return (
    <div className="tablero-scroll">
      <div className="tablero" role="grid" style={{ '--columnas': tablero.columnas }}>
        {tablero.celdas.flat().map((c) => (
          <Celda
            key={`${c.fila}-${c.columna}`}
            fila={c.fila}
            columna={c.columna}
            abierta={c.abierta}
            bandera={c.bandera}
            mina={c.mina}
            explotada={Boolean(c.explotada)}
            vecinas={c.vecinas}
            perdida={perdida}
            onAbrir={onAbrir}
            onBandera={onBandera}
          />
        ))}
      </div>
    </div>
  );
}
