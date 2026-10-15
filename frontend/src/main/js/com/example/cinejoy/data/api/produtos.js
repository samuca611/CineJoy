import { requisicao } from "./requisicao.js";
function preparar(produto) {
  return { ...produto, preco: Number(String(produto.preco).replace(",", ".")), estoque: Number(produto.estoque) };
}
export function adicionarProduto(produto) {
  return requisicao("/produtos", "POST", { ...preparar(produto), id: 0 });
}
export function editarProduto(produto) {
  return requisicao("/produtos/" + produto.id, "PUT", preparar(produto));
}
export function excluirProduto(id) {
  return requisicao("/produtos/" + id, "DELETE");
}
