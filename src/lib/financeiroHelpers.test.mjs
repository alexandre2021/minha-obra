import test from 'node:test';
import assert from 'node:assert/strict';
import { calcularPercentualSubtarefa } from './financeiroHelpers.js';

test('calcula percentual de subtarefa a partir de progresso quando existe valor numérico', () => {
  assert.equal(calcularPercentualSubtarefa({ progresso: 42, concluida: false }), 42);
});

test('usa 100% quando a subtarefa está concluída e não há progresso definido', () => {
  assert.equal(calcularPercentualSubtarefa({ concluida: true }), 100);
});

test('usa 0% para subtarefas não concluídas sem progresso informado', () => {
  assert.equal(calcularPercentualSubtarefa({ concluida: false }), 0);
});
