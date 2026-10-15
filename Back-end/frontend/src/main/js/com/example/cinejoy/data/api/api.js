import { requisicao } from "./requisicao.js";
import { buscarSessao } from "./usuarios.js";

export { loginUsuario, loginFuncionario, sairDaConta, buscarSessao, buscarLocalidades, cadastrarUsuario } from "./usuarios.js";
export { adicionarFilme, editarFilme, excluirFilme } from "./filmes.js";
export { adicionarProduto, editarProduto, excluirProduto } from "./produtos.js";
export { adicionarUnidade, editarUnidade, excluirUnidade, buscarSalas, salvarSala, excluirSala } from "./unidades.js";
export { comprarIngresso, atualizarStatusPedido } from "./pedidos.js";

export async function buscarDadosDaHome() {
  const dados = await requisicao("/site/home");
  const usuario = await buscarSessao();
  let ingressos = [];
  let logs = [];

  if (usuario) {
    ingressos = await requisicao("/ingressos");
    if (usuario.papel === "Funcionario") {
      logs = await requisicao("/logs");
    }
  }

  return { ...dados, usuario, ingressos, logs };
}
