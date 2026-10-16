export async function requisicao(caminho, metodo = "GET", dados) {
  const opcoes = {
    method: metodo,
    credentials: "include",
    cache: "no-store"
  };

  if (dados !== undefined) {
    opcoes.headers = { "Content-Type": "application/json" };
    opcoes.body = JSON.stringify(dados);
  }

  let resposta;
  try {
    const servidor = process.env.NEXT_PUBLIC_API_URL ||
      "http://" + window.location.hostname + ":8080";
    resposta = await fetch(servidor + "/api" + caminho, opcoes);
  } catch {
    throw new Error("Não foi possível acessar a API. Confira se ela está ligada.");
  }

  if (resposta.status === 204) {
    return null;
  }

  const texto = await resposta.text();
  let resultado = null;

  if (texto !== "") {
    try {
      resultado = JSON.parse(texto);
    } catch {
      resultado = null;
    }
  }

  if (!resposta.ok) {
    let mensagem = "Não foi possível concluir a operação.";

    if (resposta.status === 401) {
      mensagem = "Entre na sua conta para continuar.";
    }
    if (resultado && resultado.errors) {
      mensagem = Object.values(resultado.errors).flat().join(" ");
    }
    if (resultado && resultado.mensagem) {
      mensagem = resultado.mensagem;
    }

    const erro = new Error(mensagem);
    erro.status = resposta.status;
    throw erro;
  }

  return resultado;
}
