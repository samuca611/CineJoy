import { LogOut, Search, UserCircle } from "lucide-react";
import { useState } from "react";
import Rodape from "../../components/Rodape/Rodape.jsx";
import TelaSalas from "./TelaSalas.jsx";

const filmeVazio = {
  id: 0,
  titulo: "",
  genero: "",
  classificacao: "L",
  duracao: "",
  direcao: "",
  elenco: "",
  descricao: "",
  imagem: "/assets/filme.jpg",
  posterCatalogo: ""
};

const alimentoVazio = {
  nome: "",
  descricao: "",
  preco: "",
  estoque: 0,
  imagem: "/assets/pipoca.jpg"
};

const unidadeVazia = {
  nome: "",
  cep: "",
  endereco: "",
  complemento: ""
};

function CabecalhoFuncionario({ pagina, trocarPagina, sair }) {
  return (
    <header className="func-cabecalho">
      <div className="func-faixa">
        <button type="button" onClick={sair}>
          <LogOut size={18} />
          Sair
        </button>
        <UserCircle size={34} />
      </div>

      <div className="func-logo">
        <img src="/assets/logo-cinejoyfuls.png" alt="CineJoyfuls" />
      </div>

      <nav className="func-menu" aria-label="Navegação do funcionário">
        <button className={pagina === "cinema" ? "ativo" : ""} type="button" onClick={() => trocarPagina("cinema")}>
          Cinema
        </button>
        <button className={pagina === "alimentacao" ? "ativo" : ""} type="button" onClick={() => trocarPagina("alimentacao")}>
          Alimentação
        </button>
        <button className={pagina === "ingressos" ? "ativo" : ""} type="button" onClick={() => trocarPagina("ingressos")}>
          Ingressos
        </button>
        <button className={pagina === "unidades" ? "ativo" : ""} type="button" onClick={() => trocarPagina("unidades")}>
          Unidades
        </button>
        <button className={pagina === "salas" ? "ativo" : ""} type="button" onClick={() => trocarPagina("salas")}>
          Salas
        </button>
        <label>
          <Search size={16} />
          <input placeholder="Buscar" />
        </label>
        <button className={pagina === "inicio" ? "ativo" : ""} type="button" onClick={() => trocarPagina("inicio")}>
          CineJoyfuls
        </button>
      </nav>
    </header>
  );
}

function LateralFuncionario({ titulo, imagem, children, funcionario }) {
  return (
    <aside className="func-lateral">
      <h2>ÁREA DO FUNCIONÁRIO</h2>
      <label>
        Nome:
        <input value={funcionario?.nome || ""} readOnly />
      </label>
      <label>
        id:
        <input value={funcionario?.id || ""} readOnly />
      </label>

      <div className="func-imagem">
        <strong>{titulo}</strong>
        <img src={imagem} alt="" />
      </div>

      {children}
    </aside>
  );
}

function BotoesOperacao({ operacao, trocarOperacao, desativado = false }) {
  return (
    <div className="func-acoes">
      <button className={operacao === "Editar" ? "ativo" : ""} type="button" disabled={desativado} onClick={() => trocarOperacao("Editar")}>
        Editar
      </button>
      <button className={operacao === "Incluir" ? "ativo" : ""} type="button" disabled={desativado} onClick={() => trocarOperacao("Incluir")}>
        Incluir
      </button>
      <button className={operacao === "Excluir" ? "ativo" : ""} type="button" disabled={desativado} onClick={() => trocarOperacao("Excluir")}>
        Excluir
      </button>
    </div>
  );
}

function textoVazio(tipo) {
  return (
    <div className="quadro-exclusao">
      <p>Nenhum {tipo} cadastrado. Use a opção Incluir para adicionar.</p>
    </div>
  );
}

function TelaCinema({ filmes, gravarFilme, removerFilme, funcionario }) {
  const [operacao, setOperacao] = useState("Incluir");
  const [filmeSelecionado, setFilmeSelecionado] = useState("");
  const filmeAtual = filmes.find((filme) => filme.id === Number(filmeSelecionado));
  const [formulario, setFormulario] = useState(filmeVazio);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  function escolherFilme(id) {
    const filme = filmes.find((item) => item.id === Number(id));
    setFilmeSelecionado(id);
    setFormulario(filme || filmeVazio);
    setErro("");
    setMensagem("");
  }

  function mudarCampo(campo, valor) {
    setFormulario({ ...formulario, [campo]: valor });
  }

  function trocarOperacao(novaOperacao) {
    setOperacao(novaOperacao);
    setErro("");
    setMensagem("");
    if (novaOperacao === "Incluir") {
      setFormulario(filmeVazio);
      setFilmeSelecionado("");
      return;
    }

    setFormulario(filmeAtual || filmes[0] || filmeVazio);
    setFilmeSelecionado(filmeAtual?.id || filmes[0]?.id || "");
  }

  async function salvarFilme(evento) {
    evento.preventDefault();
    if (salvando) return;
    setSalvando(true);
    setErro("");
    setMensagem("");
    const incluir = operacao === "Incluir";
    const filme = {
      ...formulario,
      id: incluir ? 0 : Number(filmeSelecionado),
      titulo: formulario.titulo.trim(),
      imagem: formulario.imagem || "/assets/filme.jpg",
      posterCatalogo: formulario.posterCatalogo || formulario.imagem || "/assets/filme.jpg",
      sessoes: incluir ? [] : formulario.sessoes || []
    };

    try {
      const salvo = await gravarFilme(filme, incluir);
      setFilmeSelecionado(salvo.id);
      setFormulario(salvo);
      setOperacao("Editar");
      setMensagem(incluir ? "Filme adicionado. Nenhuma sessão cadastrada." : "Filme atualizado.");
    } catch (falha) {
      setErro(falha.message);
    } finally {
      setSalvando(false);
    }
  }

  async function excluirFilme() {
    const excluido = await removerFilme(Number(filmeSelecionado));
    if (!excluido) return;

    const restantes = filmes.filter((filme) => filme.id !== Number(filmeSelecionado));
    setFilmeSelecionado(restantes[0]?.id || "");
    setFormulario(restantes[0] || filmeVazio);
    setOperacao(restantes.length === 0 ? "Incluir" : "Editar");
  }

  const semCadastro = filmes.length === 0 && operacao !== "Incluir";

  return (
    <main className="func-conteudo">
      <LateralFuncionario funcionario={funcionario} titulo={formulario.titulo || "Filme"} imagem={formulario.imagem || "/assets/filme.jpg"} />

      <section className="func-painel">
        <h1>Cadastro, edição e exclusão de filmes</h1>
        <BotoesOperacao operacao={operacao} trocarOperacao={trocarOperacao} desativado={salvando} />
        {erro && <p role="alert">{erro}</p>}
        {mensagem && <p role="status">{mensagem}</p>}

        {semCadastro ? textoVazio("filme") : (
          <>
            {operacao !== "Incluir" && (
              <label className="func-selecao">
                Filme
                <select value={filmeSelecionado} onChange={(evento) => escolherFilme(evento.target.value)}>
                  {filmes.map((filme) => (
                    <option key={filme.id} value={filme.id}>
                      {filme.titulo}
                    </option>
                  ))}
                </select>
              </label>
            )}

            {operacao === "Excluir" ? (
              <div className="quadro-exclusao">
                <p>Excluir o filme selecionado?</p>
                <button type="button" onClick={excluirFilme}>Excluir</button>
              </div>
            ) : (
              <form className="func-formulario" onSubmit={salvarFilme}>
                <label>Nome<input value={formulario.titulo} maxLength={150} pattern=".*\S.*" disabled={salvando} onChange={(evento) => mudarCampo("titulo", evento.target.value)} required /></label>
                <label>Gênero<input value={formulario.genero} maxLength={80} disabled={salvando} onChange={(evento) => mudarCampo("genero", evento.target.value)} /></label>
                <label>Duração<input value={formulario.duracao} maxLength={30} disabled={salvando} onChange={(evento) => mudarCampo("duracao", evento.target.value)} /></label>
                <label>Classificação<select value={formulario.classificacao} disabled={salvando} onChange={(evento) => mudarCampo("classificacao", evento.target.value)}>
                  <option value="L">Livre</option>
                  <option value="10">10 anos</option><option value="12">12 anos</option>
                  <option value="14">14 anos</option><option value="16">16 anos</option><option value="18">18 anos</option>
                </select></label>
                <label>Direção<input value={formulario.direcao} maxLength={150} disabled={salvando} onChange={(evento) => mudarCampo("direcao", evento.target.value)} /></label>
                <label>Elenco<input value={formulario.elenco} maxLength={500} disabled={salvando} onChange={(evento) => mudarCampo("elenco", evento.target.value)} /></label>
                <label className="linha-inteira">Imagem principal<input value={formulario.imagem} maxLength={1000} disabled={salvando} onChange={(evento) => mudarCampo("imagem", evento.target.value)} /></label>
                <label className="linha-inteira">Pôster do catálogo<input value={formulario.posterCatalogo} maxLength={1000} disabled={salvando} onChange={(evento) => mudarCampo("posterCatalogo", evento.target.value)} /></label>
                <button type="submit" disabled={salvando}>{salvando ? "Salvando..." : operacao === "Incluir" ? "Adicionar" : "Salvar"}</button>
              </form>
            )}
          </>
        )}
      </section>
    </main>
  );
}

function TelaAlimentacaoFuncionario({ produtos, gravarProduto, removerProduto, funcionario }) {
  const [operacao, setOperacao] = useState("Incluir");
  const [idSelecionado, setIdSelecionado] = useState(produtos[0]?.id || "");
  const produtoAtual = produtos.find((produto) => produto.id === Number(idSelecionado));
  const [formulario, setFormulario] = useState(produtoAtual || alimentoVazio);

  function escolherProduto(id) {
    const produto = produtos.find((item) => item.id === Number(id));
    setIdSelecionado(id);
    setFormulario(produto || alimentoVazio);
  }

  function trocarOperacao(novaOperacao) {
    setOperacao(novaOperacao);
    if (novaOperacao === "Incluir") {
      setFormulario(alimentoVazio);
      setIdSelecionado("");
      return;
    }

    setFormulario(produtoAtual || produtos[0] || alimentoVazio);
    setIdSelecionado(produtoAtual?.id || produtos[0]?.id || "");
  }

  async function salvarProduto(evento) {
    evento.preventDefault();
    const incluir = operacao === "Incluir";
    const produto = {
      ...formulario,
      id: Number(idSelecionado) || 0,
      preco: Number(String(formulario.preco).replace(",", ".")),
      estoque: Number(formulario.estoque)
    };

    const salvo = await gravarProduto(produto, incluir);
    if (salvo) {
      setIdSelecionado(salvo.id);
      setFormulario(salvo);
      setOperacao("Editar");
    }
  }

  async function excluirProduto() {
    const excluido = await removerProduto(Number(idSelecionado));
    if (!excluido) return;

    const restantes = produtos.filter((produto) => produto.id !== Number(idSelecionado));
    setIdSelecionado(restantes[0]?.id || "");
    setFormulario(restantes[0] || alimentoVazio);
    setOperacao(restantes.length === 0 ? "Incluir" : "Editar");
  }

  const semCadastro = produtos.length === 0 && operacao !== "Incluir";

  return (
    <main className="func-conteudo">
      <LateralFuncionario funcionario={funcionario} titulo={formulario.nome || "Alimento"} imagem={formulario.imagem || "/assets/pipoca.jpg"} />
      <section className="func-painel">
        <h1>Cadastro, edição e exclusão de alimentos</h1>
        <BotoesOperacao operacao={operacao} trocarOperacao={trocarOperacao} />

        {semCadastro ? textoVazio("alimento") : (
          <>
            {operacao !== "Incluir" && (
              <label className="func-selecao">
                Alimento
                <select value={idSelecionado} onChange={(evento) => escolherProduto(evento.target.value)}>
                  {produtos.map((produto) => <option key={produto.id} value={produto.id}>{produto.nome}</option>)}
                </select>
              </label>
            )}

            {operacao === "Excluir" ? (
              <div className="quadro-exclusao">
                <p>Excluir o alimento selecionado?</p>
                <button type="button" onClick={excluirProduto}>Excluir</button>
              </div>
            ) : (
              <form className="func-formulario" onSubmit={salvarProduto}>
                <label>Nome<input value={formulario.nome} onChange={(evento) => setFormulario({ ...formulario, nome: evento.target.value })} required /></label>
                <label>Preço R$<input value={formulario.preco} onChange={(evento) => setFormulario({ ...formulario, preco: evento.target.value })} /></label>
                <label>Estoque<input type="number" value={formulario.estoque} onChange={(evento) => setFormulario({ ...formulario, estoque: evento.target.value })} /></label>
                <label className="linha-inteira">Descrição<input value={formulario.descricao} onChange={(evento) => setFormulario({ ...formulario, descricao: evento.target.value })} /></label>
                <label className="linha-inteira">Imagem<input value={formulario.imagem} onChange={(evento) => setFormulario({ ...formulario, imagem: evento.target.value })} /></label>
                <button type="submit">{operacao === "Incluir" ? "Adicionar" : "Salvar"}</button>
              </form>
            )}
          </>
        )}
      </section>
    </main>
  );
}

function TelaIngressos({ ingressos, alterarStatus, funcionario }) {
  const [idSelecionado, setIdSelecionado] = useState(ingressos[0]?.id || "");
  const ingresso = ingressos.find((item) => item.id === Number(idSelecionado)) || ingressos[0];

  function trocarStatus(status) {
    if (ingresso) {
      alterarStatus(ingresso.pedidoId, status);
    }
  }

  return (
    <main className="func-conteudo">
      <LateralFuncionario funcionario={funcionario} titulo="Dados do ingresso" imagem="/assets/ingresso.png" />
      <section className="func-painel">
        <h1>Visualização do ingresso do usuário</h1>

        {ingressos.length === 0 ? textoVazio("ingresso") : (
          <>
            <label className="func-selecao">
              Ingresso
              <select value={idSelecionado} onChange={(evento) => setIdSelecionado(evento.target.value)}>
                {ingressos.map((item) => <option key={item.id} value={item.id}>#{item.id} - {item.usuario}</option>)}
              </select>
            </label>
            <div className="func-informacoes">
              <span>Nome do usuário<strong>{ingresso.usuario}</strong></span>
              <span>Id do ingresso<strong>{ingresso.id}</strong></span>
              <span>Comida<strong>{ingresso.comida}</strong></span>
              <span>Assento<strong>{ingresso.assento}</strong></span>
              <span>Unidade - Sala - Sessão<strong>{ingresso.unidade}</strong></span>
              <span>Filme<strong>{ingresso.filme}</strong></span>
            </div>
            <div className="situacao-pagamento">
              <p>Situação do pagamento</p>
              <button type="button" onClick={() => trocarStatus("Simulado")}>Simulado</button>
              <button type="button" onClick={() => trocarStatus("Pendente")}>Pendente</button>
              <strong>{ingresso.status}</strong>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

function TelaUnidades({ unidades, gravarUnidade, removerUnidade, funcionario }) {
  const [operacao, setOperacao] = useState("Incluir");
  const [idSelecionado, setIdSelecionado] = useState(unidades[0]?.id || "");
  const unidadeAtual = unidades.find((unidade) => unidade.id === Number(idSelecionado));
  const [formulario, setFormulario] = useState(unidadeAtual || unidadeVazia);

  function escolherUnidade(id) {
    const unidade = unidades.find((item) => item.id === Number(id));
    setIdSelecionado(id);
    setFormulario(unidade || unidadeVazia);
  }

  function trocarOperacao(novaOperacao) {
    setOperacao(novaOperacao);
    if (novaOperacao === "Incluir") {
      setFormulario(unidadeVazia);
      setIdSelecionado("");
      return;
    }

    setFormulario(unidadeAtual || unidades[0] || unidadeVazia);
    setIdSelecionado(unidadeAtual?.id || unidades[0]?.id || "");
  }

  async function salvarUnidade(evento) {
    evento.preventDefault();
    const incluir = operacao === "Incluir";
    const unidade = { ...formulario, id: Number(idSelecionado) || 0 };
    const salva = await gravarUnidade(unidade, incluir);

    if (salva) {
      setIdSelecionado(salva.id);
      setFormulario(salva);
      setOperacao("Editar");
    }
  }

  async function excluirUnidade() {
    const excluida = await removerUnidade(Number(idSelecionado));
    if (!excluida) return;

    const restantes = unidades.filter((unidade) => unidade.id !== Number(idSelecionado));
    setIdSelecionado(restantes[0]?.id || "");
    setFormulario(restantes[0] || unidadeVazia);
    setOperacao(restantes.length === 0 ? "Incluir" : "Editar");
  }

  const semCadastro = unidades.length === 0 && operacao !== "Incluir";

  return (
    <main className="func-conteudo">
      <LateralFuncionario funcionario={funcionario} titulo="Imagem da unidade" imagem="/assets/logo-cinejoy-footer.png" />
      <section className="func-painel">
        <h1>Unidades CineJoy</h1>
        <BotoesOperacao operacao={operacao} trocarOperacao={trocarOperacao} />

        {semCadastro ? textoVazio("unidade") : (
          <>
            {operacao !== "Incluir" && (
              <label className="func-selecao">
                Unidade
                <select value={idSelecionado} onChange={(evento) => escolherUnidade(evento.target.value)}>
                  {unidades.map((unidade) => <option key={unidade.id} value={unidade.id}>{unidade.nome}</option>)}
                </select>
              </label>
            )}

            {operacao === "Excluir" ? (
              <div className="quadro-exclusao">
                <p>Excluir a unidade selecionada?</p>
                <button type="button" onClick={excluirUnidade}>Excluir</button>
              </div>
            ) : (
              <form className="func-formulario" onSubmit={salvarUnidade}>
                <label>Nome da unidade<input value={formulario.nome} onChange={(evento) => setFormulario({ ...formulario, nome: evento.target.value })} required /></label>
                <label>CEP<input value={formulario.cep} onChange={(evento) => setFormulario({ ...formulario, cep: evento.target.value })} /></label>
                <label>Endereço<input value={formulario.endereco} onChange={(evento) => setFormulario({ ...formulario, endereco: evento.target.value })} /></label>
                <label>Complemento<input value={formulario.complemento} onChange={(evento) => setFormulario({ ...formulario, complemento: evento.target.value })} /></label>
                <button type="submit">{operacao === "Incluir" ? "Adicionar" : "Salvar"}</button>
              </form>
            )}
          </>
        )}
      </section>
    </main>
  );
}

function TelaInicioFuncionario({ trocarPagina }) {
  return (
    <main className="func-conteudo coluna-unica">
      <section className="func-painel painel-inicio">
        <img src="/assets/logo-cinejoyfuls.png" alt="CineJoyfuls" />
        <h1>Qual área deseja gerenciar?</h1>
        <div className="botoes-inicio">
          <button type="button" onClick={() => trocarPagina("cinema")}>Cinema</button>
          <button type="button" onClick={() => trocarPagina("alimentacao")}>Alimentação</button>
          <button type="button" onClick={() => trocarPagina("ingressos")}>Ingressos</button>
          <button type="button" onClick={() => trocarPagina("unidades")}>Unidades</button>
          <button type="button" onClick={() => trocarPagina("salas")}>Salas</button>
        </div>
      </section>
    </main>
  );
}

export default function TelaFuncionario({
  filmes,
  ingressos,
  gravarFilme,
  removerFilme,
  gravarProduto,
  removerProduto,
  gravarUnidade,
  removerUnidade,
  alterarStatus,
  produtos,
  salas,
  atualizarDados,
  usuario,
  sair,
  unidades
}) {
  const [pagina, setPagina] = useState("inicio");
  const [salaAberta, setSalaAberta] = useState(0);

  function trocarPagina(novaPagina) {
    setSalaAberta(0);
    setPagina(novaPagina);
  }

  return (
    <>
      <CabecalhoFuncionario pagina={pagina} trocarPagina={trocarPagina} sair={sair} />
      {pagina === "inicio" && <TelaInicioFuncionario trocarPagina={trocarPagina} />}
      {pagina === "cinema" && <TelaCinema funcionario={usuario} filmes={filmes} gravarFilme={gravarFilme} removerFilme={removerFilme} />}
      {pagina === "alimentacao" && <TelaAlimentacaoFuncionario funcionario={usuario} produtos={produtos} gravarProduto={gravarProduto} removerProduto={removerProduto} />}
      {pagina === "ingressos" && <TelaIngressos funcionario={usuario} ingressos={ingressos} alterarStatus={alterarStatus} />}
      {pagina === "unidades" && <TelaUnidades funcionario={usuario} unidades={unidades} gravarUnidade={gravarUnidade} removerUnidade={removerUnidade} />}
      {pagina === "salas" && <TelaSalas filmes={filmes} salas={salas} unidades={unidades} atualizarDados={atualizarDados} salaAberta={salaAberta} setSalaAberta={setSalaAberta} />}
      <Rodape />
    </>
  );
}
