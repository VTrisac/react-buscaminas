import { useCallback, useEffect, useReducer, useState } from 'react';
import Configuracion from './components/Configuracion.jsx';
import Marcador from './components/Marcador.jsx';
import Tablero from './components/Tablero.jsx';
import Mensaje from './components/Mensaje.jsx';
import { useCronometro } from './hooks/useCronometro.js';
import { useRecords } from './hooks/useRecords.js';
import { partidaReducer, estadoInicial } from './logic/partida.js';
import { NIVELES } from './logic/niveles.js';
import { ESTADO } from './logic/tablero.js';

export default function App() {
  const [config, setConfig] = useState(NIVELES.facil);
  const [tablero, dispatch] = useReducer(partidaReducer, NIVELES.facil, estadoInicial);
  const [mensaje, setMensaje] = useState(null);
  const { mejorTiempo, registrar } = useRecords();

  // El cronómetro corre desde la primera celda abierta hasta que acaba la partida
  const enCurso = tablero.estado === ESTADO.JUGANDO && tablero.abiertas > 0;
  const [segundos, reiniciarCronometro] = useCronometro(enCurso);

  const nuevaPartida = useCallback((nuevaConfig) => {
    setConfig(nuevaConfig);
    dispatch({ tipo: 'nueva', config: nuevaConfig });
    reiniciarCronometro();
    setMensaje(null);
  }, [reiniciarCronometro]);

  const onAbrir = useCallback((fila, columna) => dispatch({ tipo: 'abrir', fila, columna }), []);
  const onBandera = useCallback((fila, columna) => dispatch({ tipo: 'bandera', fila, columna }), []);

  // Reacciona al final de la partida (una sola vez por partida)
  useEffect(() => {
    if (tablero.estado === ESTADO.PERDIDO) {
      setMensaje({ titulo: '💥 Game Over', texto: 'Has pisado una mina. ¡Prueba otra vez!' });
    } else if (tablero.estado === ESTADO.GANADO) {
      const record = registrar(config, segundos);
      setMensaje({ titulo: '🎉 ¡Has ganado!', texto: `Tiempo: ${segundos} s.${record ? ' ¡Nuevo récord!' : ''}` });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tablero.estado]);

  const banderas = tablero.celdas.flat().filter((c) => c.bandera).length;
  const record = mejorTiempo(config);

  return (
    <>
      <header className="cabecera">
        <h1>Busca<span>minas</span></h1>
        <p>Proyecto ReactJS · Máster Full Stack</p>
      </header>
      <main>
        <Configuracion onNuevaPartida={nuevaPartida} />
        <section className="panel juego" aria-label="Tablero">
          <Marcador
            minasRestantes={tablero.minas - banderas}
            segundos={segundos}
            estado={tablero.estado}
            onReiniciar={() => nuevaPartida(config)}
          />
          <Tablero tablero={tablero} onAbrir={onAbrir} onBandera={onBandera} />
          <p className="ayuda">Clic: abrir · Clic derecho o mantener pulsado: bandera</p>
          <p className="record">{record == null ? 'Aún no hay récord para este tablero' : `Récord en este tablero: ${record} s`}</p>
        </section>
      </main>
      <Mensaje abierto={Boolean(mensaje)} titulo={mensaje?.titulo} texto={mensaje?.texto} onCerrar={() => setMensaje(null)} />
    </>
  );
}
