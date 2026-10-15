export async function POST(request) {
  const dados = await request.json();

  if (dados.email === "funcionario1@cinejoy.com" && dados.senha === "cinejoy") {
    return Response.json({
      idFunc: 1,
      nomeFunc: "Funcionario 1",
      emailFunc: dados.email
    });
  }

  return Response.json({ mensagem: "Funcionario nao encontrado." }, { status: 401 });
}
