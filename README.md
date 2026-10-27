# Buscaminas · Proyecto ReactJS

El Buscaminas del proyecto de JS, pasado a React 19 + Vite y dividido en componentes, hooks y lógica pura.

## Funcionalidades
- Niveles Fácil (8×8, 10 minas), Medio (16×16, 40) y Difícil (16×30, 99), o tablero personalizado con validación.
- El primer clic nunca es mina y siempre abre una zona.
- Apertura en cascada de las celdas con 0 minas alrededor.
- Banderas con clic derecho (o pulsación larga en móvil) y contador de minas restantes.
- Game Over que revela todas las minas y marca las banderas erróneas; victoria con el tiempo total.
- Cronómetro, reinicio sin recargar y **mejor tiempo por tablero en localStorage**.

## Arquitectura
```
src/
  App.jsx                  Estado de la partida (useReducer) y composición
  components/
    Configuracion.jsx      Formulario controlado de nivel / tablero personalizado
    Marcador.jsx           Minas restantes, cara (reinicio) y tiempo
    Tablero.jsx            Rejilla de celdas
    Celda.jsx              Casilla (memo) con clic, clic derecho y pulsación larga
    Mensaje.jsx            Diálogo nativo <dialog> controlado por props
  hooks/
    useCronometro.js       setInterval con limpieza en useEffect
    useRecords.js          Mejores tiempos en localStorage
  logic/
    tablero.js             Lógica pura del juego (la misma del proyecto JS)
    partida.js             Reducer: cada acción trabaja sobre una copia (structuredClone)
    niveles.js             Niveles y validación del tablero personalizado
    partida.test.js        Pruebas con el test runner de Node
```

## Comandos
```bash
npm install
npm run dev      # http://localhost:5173
npm test         # pruebas de la lógica
npm run build    # genera dist/
```

## Publicar en GitHub Pages
Incluye `.github/workflows/deploy.yml`: compila y publica en cada push a `main`.
1. Crea el repositorio y sube el proyecto (sin `node_modules` ni `dist`).
2. Settings → Pages → Source: **GitHub Actions**.
3. Haz push a `main`; la URL aparece en Actions y en Settings → Pages.
