import { LogOut, Search, UserCircle } from "lucide-react";
import { useState } from "react";
import Rodape from "../../components/Rodape/Rodape.jsx";
import TelaSalas from "./TelaSalas.jsx";
import TelaSessoes from "./TelaSessoes.jsx";
import TelaLogs from "../TelaLogs/TelaLogs.jsx";

const filmeVazio = {
  titulo: "",
  genero: "",
  classificacao: "L",
  duracao: "",
  direcao: "",
  elenco: "",
  imagem: "/assets/filme.jpg",
  posterCatalogo: "",
  dataSessao: "25/09",
  horarioSessao: "19:00",
  sala: "01",
  salaId: "",
  preco: 24,
  formato: "2D"
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
    <header className="func-header">
      <div className="func-strip">
        <button type="button" onClick={sair}>
          <LogOut size={18} />
          Sair
        </button>
        <UserCircle size={34} />
      </div>

      <div className="func-logo">
        <img src="/assets/logo-cinejoyfuls.png" alt="CineJoyfuls" />
      </div>

      <nav className="func-nav" aria-label="Navegação do funcionário">
        <button className={pagina === "cinema" ? "active" : ""} type="button" onClick={() => trocarPagina("cinema")}>
          Cinema
        </button>
        <button className={pagina === "alimentacao" ? "active" : ""} type="button" onClick={() => trocarPagina("alimentacao")}>
          Alimentação
        </button>
        <button className={pagina === "ingressos" ? "active" : ""} type="button" onClick={() => trocarPagina("ingressos")}>
          Ingressos
        </button>
        <button className={pagina === "unidades" ? "active" : ""} type="button" onClick={() => trocarPagina("unidades")}>
          Unidades
        </button>
        <button className={pagina === "logs" ? "active" : ""} type="button" onClick={() => trocarPagina("logs")}>
          Logs
        </button>
        <label>
          <Search size={16} />
          <input placeholder="Buscar" />
        </label>
        <button className={pagina === "home" ? "active" : ""} type="button" onClick={() => trocarPagina("home")}>
          CineJoyfuls
        </button>
      </nav>
    </header>
  );
}

function LateralFuncionario({ titulo, imagem, children, funcionario }) {
  return (
    <aside className="func-side">
      <h2>ÁREA DO FUNCIONÁRIO</h2>
      <label>
        Nome:
        <input value={funcionario?.nome || ""} readOnly />
      </label>
      <label>
        id:
        <input value={funcionario?.id || ""} readOnly />
      </label>

      <div className="func-poster-card">
        <strong>{titulo}</strong>
        <img src={imagem} alt="" />
      </div>

      {children}
    </aside>
  );
}

function BotoesOperacao({ operacao, trocarOperacao }) {
  return (
    <div className="func-actions">
      <button className={operacao === "Editar" ? "active" : ""} type="button" onClick={() => trocarOperacao("Editar")}>
        Editar
      </button>
      <button className={operacao === "Incluir" ? "active" : ""} type="button" onClick={() => trocarOperacao("Incluir")}>
        Incluir
      </button>
      <button className={operacao === "Excluir" ? "active" : ""} type="button" onClick={() => trocarOperacao("Excluir")}>
        Excluir
      </button>
    </div>
  );
}

function textoVazio(tipo) {
  return (
    <div className="delete-box">
      <p>Nenhum {tipo} cadastrado. Use a opção Incluir para adicionar.</p>
    </div>
  );
}

function formularioDoFilme(filme) {
  if (!filme) {
    return filmeVazio;
  }

  const sessao = filme.sessoes?.[0] || {};

  return {
    ...filme,
    dataSessao: sessao.data || "25/09",
    horarioSessao: sessao.horario || "19:00",
    sala: sessao.sala || "01",
    salaId: sessao.salaId || "",
    preco: sessao.preco ?? 24,
    formato: sessao.formato || "2D"
  };
}

function dadosDoFilme(formulario, idAtual) {
  return {
    id: idAtual || 0,
    titulo: formulario.titulo,
    genero: formulario.genero,
    classificacao: formulario.classificacao,
    duracao: formulario.duracao,
    direcao: formulario.direcao,
    elenco: formulario.elenco,
    imagem: formulario.imagem || "/assets/filme.jpg",
    posterCatalogo: formulario.posterCatalogo || formulario.imagem || "/assets/filme.jpg",
    sessoes: [
      {
        id: formulario.sessoes?.[0]?.id || 0,
        data: formulario.dataSessao,
        horario: formulario.horarioSessao,
        sala: formulario.sala,
        salaId: Number(formulario.salaId),
        preco: Number(formulario.preco),
        formato: formulario.formato
      },
      ...(formulario.sessoes || []).slice(1)
    ]
  };
}

function TelaCinema({ filmes, gravarFilme, removerFilme, salas, unidades, funcionario }) {
  const [operacao, setOperacao] = useState("Incluir");
  const [filmeSelecionado, setFilmeSelecionado] = useState(filmes[0]?.id || "");
  const filmeAtual = filmes.find((filme) => filme.id === Number(filmeSelecionado));
  const [formulario, setFormulario] = useState(formularioDoFilme(filmeAtual));

  function escolherFilme(id) {
    const filme = filmes.find((item) => item.id === Number(id));
    setFilmeSelecionado(id);
    setFormulario(formularioDoFilme(filme));
  }

  function mudarCampo(campo, valor) {
    setFormulario({ ...formulario, [campo]: valor });
  }

  function trocarOperacao(novaOperacao) {
    setOperacao(novaOperacao);
    if (novaOperacao === "Incluir") {
      setFormulario(filmeVazio);
      setFilmeSelecionado("");
      return;
    }

    setFormulario(formularioDoFilme(filmeAtual || filmes[0]));
    setFilmeSelecionado(filmeAtual?.id || filmes[0]?.id || "");
  }

  async function salvarFilme(evento) {
    evento.preventDefault();
    const incluir = operacao === "Incluir";
    const filme = dadosDoFilme(formulario, Number(filmeSelecionado));
    const salvo = await gravarFilme(filme, incluir);

    if (salvo) {
      setFilmeSelecionado(salvo.id);
      setFormulario(formularioDoFilme(salvo));
      setOperacao("Editar");
    }
  }

  async function excluirFilme() {
    const excluido = await removerFilme(Number(filmeSelecionado));
    if (!excluido) return;

    const restantes = filmes.filter((filme) => filme.id !== Number(filmeSelecionado));
    setFilmeSelecionado(restantes[0]?.id || "");
    setFormulario(formularioDoFilme(restantes[0]));
    setOperacao(restantes.length === 0 ? "Incluir" : "Editar");
  }

  const semCadastro = filmes.length === 0 && operacao !== "Incluir";

  return (
    <main className="func-main">
      <LateralFuncionario funcionario={funcionario} titulo={formulario.titulo || "Filme"} imagem={formulario.imagem || "/assets/filme.jpg"} />

      <section className="func-panel">
        <h1>Cadastro, edição e exclusão de filmes</h1>
        <BotoesOperacao operacao={operacao} trocarOperacao={trocarOperacao} />

        {semCadastro ? textoVazio("filme") : (
          <>
            {operacao !== "Incluir" && (
              <label className="func-select">
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
              <div className="delete-box">
                <p>Excluir o filme selecionado?</p>
                <button type="button" onClick={excluirFilme}>Excluir</button>
              </div>
            ) : (
              <form className="func-form" onSubmit={salvarFilme}>
                <label>Nome<input value={formulario.titulo} onChange={(evento) => mudarCampo("titulo", evento.target.value)} required /></label>
                <label>Gênero<input value={formulario.genero} onChange={(evento) => mudarCampo("genero", evento.target.value)} /></label>
                <label>Duração<input value={formulario.duracao} onChange={(evento) => mudarCampo("duracao", evento.target.value)} /></label>
                <label>Classificação<input value={formulario.classificacao} onChange={(evento) => mudarCampo("classificacao", evento.target.value)} /></label>
                <label>Direção<input value={formulario.direcao} onChange={(evento) => mudarCampo("direcao", evento.target.value)} /></label>
                <label>Elenco<input value={formulario.elenco} onChange={(evento) => mudarCampo("elenco", evento.target.value)} /></label>
                <label>Data da sessão<input value={formulario.dataSessao} onChange={(evento) => mudarCampo("dataSessao", evento.target.value)} /></label>
                <label>Horário<input value={formulario.horarioSessao} onChange={(evento) => mudarCampo("horarioSessao", evento.target.value)} /></label>
                <label>Sala<select required value={formulario.salaId} onChange={(evento) => mudarCampo("salaId", evento.target.value)}>
                  <option value="">Selecione</option>
                  {salas.map((sala) => <option key={sala.id} value={sala.id}>{unidades.find((u) => u.id === sala.unidadeId)?.nome} - Sala {sala.numero}</option>)}
                </select></label>
                <label>Preço do ingresso<input type="number" min="0.01" step="0.01" value={formulario.preco} onChange={(evento) => mudarCampo("preco", evento.target.value)} required /></label>
                <label>Formato<input value={formulario.formato} onChange={(evento) => mudarCampo("formato", evento.target.value)} /></label>
                <label className="wide">Imagem principal<input value={formulario.imagem} onChange={(evento) => mudarCampo("imagem", evento.target.value)} /></label>
                <label className="wide">Pôster do catálogo<input value={formulario.posterCatalogo} onChange={(evento) => mudarCampo("posterCatalogo", evento.target.value)} /></label>
                <button type="submit">{operacao === "Incluir" ? "Adicionar" : "Salvar"}</button>
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
    <main className="func-main">
      <LateralFuncionario funcionario={funcionario} titulo={formulario.nome || "Alimento"} imagem={formulario.imagem || "/assets/pipoca.jpg"} />
      <section className="func-panel">
        <h1>Cadastro, edição e exclusão de alimentos</h1>
        <BotoesOperacao operacao={operacao} trocarOperacao={trocarOperacao} />

        {semCadastro ? textoVazio("alimento") : (
          <>
            {operacao !== "Incluir" && (
              <label className="func-select">
                Alimento
                <select value={idSelecionado} onChange={(evento) => escolherProduto(evento.target.value)}>
                  {produtos.map((produto) => <option key={produto.id} value={produto.id}>{produto.nome}</option>)}
                </select>
              </label>
            )}

            {operacao === "Excluir" ? (
              <div className="delete-box">
                <p>Excluir o alimento selecionado?</p>
                <button type="button" onClick={excluirProduto}>Excluir</button>
              </div>
            ) : (
              <form className="func-form" onSubmit={salvarProduto}>
                <label>Nome<input value={formulario.nome} onChange={(evento) => setFormulario({ ...formulario, nome: evento.target.value })} required /></label>
                <label>Preço R$<input value={formulario.preco} onChange={(evento) => setFormulario({ ...formulario, preco: evento.target.value })} /></label>
                <label>Estoque<input type="number" value={formulario.estoque} onChange={(evento) => setFormulario({ ...formulario, estoque: evento.target.value })} /></label>
                <label className="wide">Descrição<input value={formulario.descricao} onChange={(evento) => setFormulario({ ...formulario, descricao: evento.target.value })} /></label>
                <label className="wide">Imagem<input value={formulario.imagem} onChange={(evento) => setFormulario({ ...formulario, imagem: evento.target.value })} /></label>
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
    <main className="func-main">
      <LateralFuncionario funcionario={funcionario} titulo="Dados do ingresso" imagem="/assets/ingresso.png" />
      <section className="func-panel">
        <h1>Visualização do ingresso do usuário</h1>

        {ingressos.length === 0 ? textoVazio("ingresso") : (
          <>
            <label className="func-select">
              Ingresso
              <select value={idSelecionado} onChange={(evento) => setIdSelecionado(evento.target.value)}>
                {ingressos.map((item) => <option key={item.id} value={item.id}>#{item.id} - {item.usuario}</option>)}
              </select>
            </label>
            <div className="func-info-grid">
              <span>Nome do usuário<strong>{ingresso.usuario}</strong></span>
              <span>Id do ingresso<strong>{ingresso.id}</strong></span>
              <span>Comida<strong>{ingresso.comida}</strong></span>
              <span>Assento<strong>{ingresso.assento}</strong></span>
              <span>Unidade - Sala - Sessão<strong>{ingresso.unidade}</strong></span>
              <span>Filme<strong>{ingresso.filme}</strong></span>
            </div>
            <div className="payment-box">
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
    <main className="func-main">
      <LateralFuncionario funcionario={funcionario} titulo="Imagem da unidade" imagem="/assets/logo-cinejoy-footer.png" />
      <section className="func-panel">
        <h1>Unidades CineJoy</h1>
        <BotoesOperacao operacao={operacao} trocarOperacao={trocarOperacao} />

        {semCadastro ? textoVazio("unidade") : (
          <>
            {operacao !== "Incluir" && (
              <label className="func-select">
                Unidade
                <select value={idSelecionado} onChange={(evento) => escolherUnidade(evento.target.value)}>
                  {unidades.map((unidade) => <option key={unidade.id} value={unidade.id}>{unidade.nome}</option>)}
                </select>
              </label>
            )}

            {operacao === "Excluir" ? (
              <div className="delete-box">
                <p>Excluir a unidade selecionada?</p>
                <button type="button" onClick={excluirUnidade}>Excluir</button>
              </div>
            ) : (
              <form className="func-form" onSubmit={salvarUnidade}>
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

function TelaHomeFuncionario({ trocarPagina }) {
  return (
    <main className="func-main single">
      <section className="func-panel home-panel">
        <img src="/assets/logo-cinejoyfuls.png" alt="CineJoyfuls" />
        <h1>Qual área deseja gerenciar?</h1>
        <div className="home-buttons">
          <button type="button" onClick={() => trocarPagina("cinema")}>Cinema</button>
          <button type="button" onClick={() => trocarPagina("alimentacao")}>Alimentação</button>
          <button type="button" onClick={() => trocarPagina("ingressos")}>Ingressos</button>
          <button type="button" onClick={() => trocarPagina("unidades")}>Unidades</button>
          <button type="button" onClick={() => trocarPagina("logs")}>Logs</button>
          <button type="button" onClick={() => trocarPagina("salas")}>Salas</button>
          <button type="button" onClick={() => trocarPagina("sessoes")}>Sessões</button>
        </div>
      </section>
    </main>
  );
}

export default function TelaFuncionario({
  filmes,
  ingressos,
  logs,
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
  const [pagina, setPagina] = useState("home");

  return (
    <>
      <CabecalhoFuncionario pagina={pagina} trocarPagina={setPagina} sair={sair} />
      {pagina === "home" && <TelaHomeFuncionario trocarPagina={setPagina} />}
      {pagina === "cinema" && <TelaCinema funcionario={usuario} filmes={filmes} gravarFilme={gravarFilme} removerFilme={removerFilme} salas={salas} unidades={unidades} />}
      {pagina === "alimentacao" && <TelaAlimentacaoFuncionario funcionario={usuario} produtos={produtos} gravarProduto={gravarProduto} removerProduto={removerProduto} />}
      {pagina === "ingressos" && <TelaIngressos funcionario={usuario} ingressos={ingressos} alterarStatus={alterarStatus} />}
      {pagina === "unidades" && <TelaUnidades funcionario={usuario} unidades={unidades} gravarUnidade={gravarUnidade} removerUnidade={removerUnidade} />}
      {pagina === "salas" && <TelaSalas salas={salas} unidades={unidades} atualizarDados={atualizarDados} />}
      {pagina === "sessoes" && <TelaSessoes filmes={filmes} salas={salas} unidades={unidades} atualizarDados={atualizarDados} />}
      {pagina === "logs" && <TelaLogs logs={logs} />}
      <Rodape />
    </>
  );
}
