import { useState } from 'react';
import { NIVELES, validarPersonalizado } from '../logic/niveles.js';

/** Formulario para elegir nivel o tablero personalizado. */
export default function Configuracion({ onNuevaPartida }) {
  const [nivel, setNivel] = useState('facil');
  const [personal, setPersonal] = useState({ filas: '10', columnas: '10', minas: '15' });
  const [error, setError] = useState('');

  function enviar(evento) {
    evento.preventDefault();
    if (nivel !== 'personalizado') {
      setError('');
      onNuevaPartida(NIVELES[nivel]);
      return;
    }
    const config = {
      filas: parseInt(personal.filas, 10),
      columnas: parseInt(personal.columnas, 10),
      minas: parseInt(personal.minas, 10),
    };
    const mensaje = validarPersonalizado(config);
    setError(mensaje ?? '');
    if (!mensaje) onNuevaPartida(config);
  }

  const cambiarCampo = (campo) => (e) => setPersonal((p) => ({ ...p, [campo]: e.target.value }));

  return (
    <form className="panel config" onSubmit={enviar} noValidate>
      <fieldset className="niveles">
        <legend>Dificultad</legend>
        {Object.entries(NIVELES).map(([id, n]) => (
          <label key={id}>
            <input type="radio" name="nivel" value={id} checked={nivel === id} onChange={() => setNivel(id)} />
            {n.etiqueta} <small>{n.filas}×{n.columnas} · {n.minas}</small>
          </label>
        ))}
        <label>
          <input type="radio" name="nivel" value="personalizado" checked={nivel === 'personalizado'} onChange={() => setNivel('personalizado')} />
          Personalizado
        </label>
      </fieldset>

      {nivel === 'personalizado' && (
        <div className="personalizado">
          <label>Filas <input id="filas" type="number" min="5" max="24" value={personal.filas} onChange={cambiarCampo('filas')} /></label>
          <label>Columnas <input id="columnas" type="number" min="5" max="30" value={personal.columnas} onChange={cambiarCampo('columnas')} /></label>
          <label>Minas <input id="minas" type="number" min="1" value={personal.minas} onChange={cambiarCampo('minas')} /></label>
        </div>
      )}

      <p className="error" role="alert">{error}</p>
      <button type="submit" className="btn">Nueva partida</button>
    </form>
  );
}
