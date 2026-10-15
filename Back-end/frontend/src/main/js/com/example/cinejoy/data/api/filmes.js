import { requisicao } from "./requisicao.js";

function prepararFilme(filme, incluir) {
  const dados = { ...filme };
  dados.id = Number(filme.id) || 0;
  if (incluir) {
    dados.id = 0;
  }

  dados.sessoes = [];
  for (const sessao of filme.sessoes || []) {
    const dadosDaSessao = { ...sessao };
    dadosDaSessao.id = Number(sessao.id) || 0;
    if (incluir) {
      dadosDaSessao.id = 0;
    }
    dadosDaSessao.filmeId = dados.id;
    dadosDaSessao.salaId = Number(sessao.salaId);
    dadosDaSessao.preco = Number(String(sessao.preco ?? 24).replace(",", "."));
    dados.sessoes.push(dadosDaSessao);
  }

  return dados;
}

export function adicionarFilme(filme) {
  const dados = prepararFilme(filme, true);
  return requisicao("/filmes", "POST", dados);
}

export function editarFilme(filme) {
  const dados = prepararFilme(filme, false);
  return requisicao("/filmes/" + filme.id, "PUT", dados);
}

export function excluirFilme(id) {
  return requisicao("/filmes/" + id, "DELETE");
}
