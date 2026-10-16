import { Minus, Plus, ShoppingCart, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { requisicao } from "../../../data/api/requisicao.js";
import BotaoUsuario from "../../components/BotaoUsuario/BotaoUsuario.jsx";
import Cabecalho from "../../components/Cabecalho/Cabecalho.jsx";
import Rodape from "../../components/Rodape/Rodape.jsx";
import TelaPagamento from "../TelaPagamento/TelaPagamento.jsx";

const fileiras = ["K", "J", "I", "H", "G", "F", "E", "D", "C", "B", "A"];
const assentosAcessiveis = ["A1", "A2", "A3", "A4"];

function criarAssentos() {
  const assentos = [];

  fileiras.forEach((fileira) => {
    for (let numero = 1; numero <= 16; numero++) {
      assentos.push(`${fileira}${numero}`);
    }
  });

  return assentos;
}

export default function TelaCompraIngresso({
  abrirAlimentacao,
  abrirIngresso,
  abrirInicio,
  abrirLogin,
  abrirProgramacao,
  buscarFilme,
  filme,
  produtos,
  registrarIngresso,
  trocarUnidade,
  unidadeEscolhida,
  unidadeEscolhidaId,
  unidades,
  usuarioLogado,
  voltarInicio
}) {
  const [assentosSelecionados, setAssentosSelecionados] = useState([]);
  const sessoes = (filme.sessoes || []).filter((s) => String(s.unidadeId) === String(unidadeEscolhidaId));
  const [sessaoEscolhida, setSessaoEscolhida] = useState(sessoes[0]?.id || "");
  const [alimentos, setAlimentos] = useState([]);
  const [erro, setErro] = useState("");
  const [pagamentoAberto, setPagamentoAberto] = useState(false);
  const [assentosBloqueados, setAssentosBloqueados] = useState([]);
  const sessao = sessoes.find((item) => item.id === sessaoEscolhida) || sessoes[0];
  const precoIngresso = Number(sessao?.preco || 0);
  const unidade = unidadeEscolhida || unidades[0];
  const totalIngressos = assentosSelecionados.length * precoIngresso;
  const totalAlimentos = alimentos.reduce((soma, item) => soma + precoProduto(item) * item.quantidade, 0);
  const total = totalIngressos + totalAlimentos;

  useEffect(() => {
    setAssentosSelecionados([]);
    setAssentosBloqueados([]);
    if (!sessao?.id) return;
    let ativo = true;
    async function atualizar() {
      try {
        const ocupados = await requisicao("/sessoes/" + sessao.id + "/assentos");
        if (ativo) setAssentosBloqueados(ocupados);
      } catch (falha) { if (ativo) setErro(falha.message); }
    }
    atualizar();
    const intervalo = setInterval(atualizar, 10000);
    return () => { ativo = false; clearInterval(intervalo); };
  }, [sessao?.id]);

  function precoProduto(produto) {
    return Number(String(produto.preco).replace(",", ".")) || 0;
  }

  function alternarAssento(assento) {
    if (assentosBloqueados.includes(assento)) {
      return;
    }

    if (assentosSelecionados.includes(assento)) {
      setAssentosSelecionados(assentosSelecionados.filter((item) => item !== assento));
      return;
    }

    setAssentosSelecionados([...assentosSelecionados, assento]);
    setErro("");
  }

  function finalizarCompra() {
    if (!sessao || assentosSelecionados.length === 0) {
      setErro("Selecione pelo menos um assento para continuar.");
      return;
    }

    setPagamentoAberto(true);
  }

  function adicionarAlimento(produto) {
    const existente = alimentos.find((item) => item.id === produto.id);

    if (existente) {
      setAlimentos(
        alimentos.map((item) => {
          if (item.id === produto.id) {
            return { ...item, quantidade: item.quantidade + 1 };
          }

          return item;
        })
      );
      return;
    }

    setAlimentos([...alimentos, { ...produto, quantidade: 1 }]);
  }

  function removerAlimento(produto) {
    const existente = alimentos.find((item) => item.id === produto.id);

    if (!existente) {
      return;
    }

    if (existente.quantidade === 1) {
      setAlimentos(alimentos.filter((item) => item.id !== produto.id));
      return;
    }

    setAlimentos(
      alimentos.map((item) => {
        if (item.id === produto.id) {
          return { ...item, quantidade: item.quantidade - 1 };
        }

        return item;
      })
    );
  }

  if (pagamentoAberto) {
    return (
      <TelaPagamento
        abrirAlimentacao={abrirAlimentacao}
        abrirIngresso={abrirIngresso}
        abrirInicio={abrirInicio}
        abrirLogin={abrirLogin}
        abrirProgramacao={abrirProgramacao}
        buscarFilme={buscarFilme}
        alimentos={alimentos}
        assentos={assentosSelecionados}
        filme={filme}
        precoIngresso={precoIngresso}
        registrarIngresso={registrarIngresso}
        sessao={sessao}
        trocarUnidade={trocarUnidade}
        unidade={unidade}
        unidadeEscolhidaId={unidadeEscolhidaId}
        unidades={unidades}
        usuarioLogado={usuarioLogado}
        voltar={() => setPagamentoAberto(false)}
        voltarInicio={voltarInicio}
      />
    );
  }

  return (
    <>
      <Cabecalho
        abrirAlimentacao={abrirAlimentacao}
        abrirIngresso={abrirIngresso}
        abrirInicio={abrirInicio}
        abrirLogin={abrirLogin}
        abrirProgramacao={abrirProgramacao}
        buscarFilme={buscarFilme}
        trocarUnidade={trocarUnidade}
        unidadeEscolhidaId={unidadeEscolhidaId}
        unidades={unidades}
        usuarioLogado={usuarioLogado}
      />

      <main className="ticket-page">
        <section className="ticket-banner"></section>

        <section className="ticket-toolbar">
          <button type="button" onClick={voltarInicio}>
            Voltar para inicio
          </button>
          <div>
            <h1>{filme.titulo}</h1>
            <p>{filme.duracao} {filme.genero}</p>
          </div>
        </section>

        <section className="ticket-layout">
          <div className="seat-panel">
            <div className="session-row">
              {sessoes.map((sessao) => (
                <button
                  className={sessaoEscolhida === sessao.id ? "active" : ""}
                  key={sessao.id}
                  type="button"
                  onClick={() => setSessaoEscolhida(sessao.id)}
                >
                  {sessao.data} - {sessao.horario}
                </button>
              ))}
            </div>

            <div className="seat-map">
              {fileiras.map((fileira) => (
                <div className="seat-line" key={fileira}>
                  <strong>{fileira}</strong>
                  <div>
                    {criarAssentos()
                      .filter((assento) => assento.startsWith(fileira))
                      .map((assento) => (
                        <button
                          className={[
                            "seat-button",
                            assentosSelecionados.includes(assento) ? "selected" : "",
                            assentosBloqueados.includes(assento) ? "blocked" : "",
                            assentosAcessiveis.includes(assento) ? "accessible" : ""
                          ].join(" ")}
                          key={assento}
                          type="button"
                          disabled={!sessao || assentosBloqueados.includes(assento)}
                          onClick={() => alternarAssento(assento)}
                          aria-label={`Assento ${assento}`}
                        >
                          {assentosAcessiveis.includes(assento) ? "AC" : ""}
                        </button>
                      ))}
                  </div>
                  <strong>{fileira}</strong>
                </div>
              ))}
              <div className="screen-label">TELA</div>
            </div>
          </div>

          <aside className="ticket-summary">
            <img src={filme.imagem} alt={filme.titulo} />
            <h2>
              <Ticket size={22} />
              Resumo
            </h2>
            <p>Assentos: {assentosSelecionados.length > 0 ? assentosSelecionados.join(", ") : "nenhum"}</p>
            <p>Ingressos: R$ {totalIngressos.toFixed(2).replace(".", ",")}</p>

            <h3>
              <ShoppingCart size={18} />
              Alimentos
            </h3>
            <div className="ticket-food-list">
              {produtos.length === 0 ? (
                <p className="empty-cart">Nenhum alimento cadastrado.</p>
              ) : produtos.map((produto) => (
                <article key={produto.id}>
                  <span>{produto.nome}</span>
                  <div>
                    <button type="button" aria-label={"Remover " + produto.nome} onClick={() => removerAlimento(produto)}>
                      <Minus size={13} />
                    </button>
                    <strong>{alimentos.find((item) => item.id === produto.id)?.quantidade || 0}</strong>
                    <button type="button" aria-label={"Adicionar " + produto.nome} onClick={() => adicionarAlimento(produto)}>
                      <Plus size={13} />
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="ticket-total">
              <span>Total</span>
              <strong>R$ {total.toFixed(2).replace(".", ",")}</strong>
            </div>
            {erro !== "" && <p className="ticket-error">{erro}</p>}
            <button className="finish-order" type="button" onClick={finalizarCompra}>
              Finalizar compra
            </button>
          </aside>
        </section>
      </main>

      <Rodape />
      <BotaoUsuario abrirConta={abrirLogin} />
    </>
  );
}
