const tresDigitos = (n) => String(Math.max(-99, Math.min(999, n))).padStart(3, '0');
const CARAS = { jugando: '🙂', ganado: '😎', perdido: '😵' };

export default function Marcador({ minasRestantes, segundos, estado, onReiniciar }) {
  return (
    <div className="marcador">
      <div className="contador" title="Minas restantes"><span aria-hidden="true">💣</span> <output>{tresDigitos(minasRestantes)}</output></div>
      <button type="button" className="cara" onClick={onReiniciar} aria-label="Reiniciar partida">{CARAS[estado]}</button>
      <div className="contador" title="Tiempo"><span aria-hidden="true">⏱</span> <output>{tresDigitos(segundos)}</output></div>
    </div>
  );
}
