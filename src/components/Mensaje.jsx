import { useEffect, useRef } from 'react';

/** Diálogo modal nativo (<dialog>) controlado por la prop `abierto`. */
export default function Mensaje({ abierto, titulo, texto, onCerrar }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialogo = ref.current;
    if (!dialogo || typeof dialogo.showModal !== 'function') return;
    if (abierto && !dialogo.open) dialogo.showModal();
    if (!abierto && dialogo.open) dialogo.close();
  }, [abierto]);

  return (
    <dialog ref={ref} className="mensaje" onClose={onCerrar}>
      <h2>{titulo}</h2>
      <p>{texto}</p>
      <form method="dialog"><button className="btn">Vale</button></form>
    </dialog>
  );
}
