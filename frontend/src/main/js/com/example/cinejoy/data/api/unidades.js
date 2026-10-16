import { requisicao } from "./requisicao.js";

export function adicionarUnidade(unidade) {
  const dados = { ...unidade, id: 0 };
  return requisicao("/unidades", "POST", dados);
}

export function editarUnidade(unidade) {
  return requisicao("/unidades/" + unidade.id, "PUT", unidade);
}

export function excluirUnidade(id) {
  return requisicao("/unidades/" + id, "DELETE");
}

export function buscarSalas() {
  return requisicao("/salas");
}

export function salvarSala(sala) {
  const dados = {
    ...sala,
    id: Number(sala.id) || 0,
    unidadeId: Number(sala.unidadeId)
  };

  if (dados.id === 0) {
    return requisicao("/salas", "POST", dados);
  }

  return requisicao("/salas/" + dados.id, "PUT", dados);
}

export function excluirSala(id) {
  return requisicao("/salas/" + id, "DELETE");
}
