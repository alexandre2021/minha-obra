export const calcularPercentualSubtarefa = (subtarefa = {}) => {
  if (typeof subtarefa.progresso === 'number' && Number.isFinite(subtarefa.progresso)) {
    return Math.min(100, Math.max(0, Math.round(subtarefa.progresso)));
  }

  if (subtarefa.concluida) {
    return 100;
  }

  return 0;
};

export const buildSubtaskBudgetSummary = (etapas = [], despesas = []) => {
  return (etapas || []).flatMap((etapa) => {
    return (etapa.subtarefas || []).map((subtarefa) => {
      const despesasDaSubtarefa = (despesas || []).filter((despesa) => despesa.subtarefaId === subtarefa.id);
      const valorRealizado = Number(subtarefa.valorRealizado || 0);
      const valorPlanejado = Number(subtarefa.valorPlanejado || 0);
      const percentual = calcularPercentualSubtarefa(subtarefa);

      return {
        etapaId: etapa.id,
        etapaNome: etapa.nome,
        subtarefaId: subtarefa.id,
        subtarefaTitulo: subtarefa.titulo,
        valorPlanejado,
        valorRealizado,
        percentual,
        despesas: despesasDaSubtarefa
      };
    });
  });
};
