import { requisicao } from "./requisicao.js";
export function buscarMeusPedidos() {
  return requisicao("/pedidos/meus");
}
export function comprarIngresso(dados) {
  return requisicao("/pedidos", "POST", {
    chave: dados.chave,
    sessaoId: dados.idSessao || null,
    assentos: dados.assentos || [],
    produtos: (dados.produtos || []).map((item) => ({ id: item.id, quantidade: item.quantidade })),
    formaPagamento: dados.formaPagamento,
    simularPagamento: true
  });
}
export function atualizarStatusPedido(id, status) {
  return requisicao("/pedidos/" + id + "/status", "PUT", { status });
}
