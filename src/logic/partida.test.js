// Pruebas de la lógica (node --test src/logic/)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ESTADO, crearTablero, colocarMinas, abrir } from './tablero.js';
import { partidaReducer, estadoInicial } from './partida.js';
import { validarPersonalizado } from './niveles.js';

test('el primer clic nunca es mina y abre una zona', () => {
  for (let i = 0; i < 300; i++) {
    const t = crearTablero(8, 8, 10);
    abrir(t, 3, 3);
    assert.equal(t.celdas.flat().filter((c) => c.mina).length, 10);
    assert.equal(t.celdas[3][3].vecinas, 0);
    assert.notEqual(t.estado, ESTADO.PERDIDO);
  }
});

test('la cascada abre todo menos la mina y se gana', () => {
  const t = crearTablero(5, 5, 1);
  colocarMinas(t, 0, 0, () => 0.999999);
  assert.equal(abrir(t, 0, 0).length, 24);
  assert.equal(t.estado, ESTADO.GANADO);
});

test('el reducer no muta el estado anterior', () => {
  const antes = estadoInicial({ filas: 8, columnas: 8, minas: 10 });
  const despues = partidaReducer(antes, { tipo: 'abrir', fila: 0, columna: 0 });
  assert.notEqual(antes, despues);
  assert.equal(antes.abiertas, 0);
  assert.ok(despues.abiertas > 0);
});

test('bandera sobre celda abierta no cambia nada', () => {
  const t = partidaReducer(estadoInicial({ filas: 8, columnas: 8, minas: 10 }), { tipo: 'abrir', fila: 0, columna: 0 });
  assert.equal(partidaReducer(t, { tipo: 'bandera', fila: 0, columna: 0 }), t);
});

test('validación de tablero personalizado', () => {
  assert.equal(validarPersonalizado({ filas: 10, columnas: 10, minas: 15 }), null);
  assert.match(validarPersonalizado({ filas: 10, columnas: 10, minas: 999 }), /minas/);
  assert.match(validarPersonalizado({ filas: 2, columnas: 10, minas: 3 }), /Filas/);
  assert.match(validarPersonalizado({ filas: NaN, columnas: 10, minas: 3 }), /Rellena/);
});
