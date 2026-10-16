import { requisicao } from "./requisicao.js";

export function loginUsuario(email, senha) {
  return requisicao("/autenticacao/entrar", "POST", { email, senha });
}
export const loginFuncionario = loginUsuario;
export function sairDaConta() {
  return requisicao("/autenticacao/sair", "POST");
}
export async function buscarSessao() {
  try { return await requisicao("/autenticacao/sessao"); }
  catch (erro) { if (erro.status === 401) return null; throw erro; }
}
export function buscarLocalidades() {
  return requisicao("/usuarios/localidades");
}
export function buscarMinhaConta() {
  return requisicao("/usuarios/minha-conta");
}
export function salvarMinhaConta(dados) {
  return requisicao("/usuarios/minha-conta", "PUT", dados);
}
export function cadastrarUsuario(usuario) {
  return requisicao("/usuarios", "POST", {
    ...usuario, cpf: usuario.cpf.replace(/\D/g, ""), estado: undefined, cidade: undefined
  });
}
