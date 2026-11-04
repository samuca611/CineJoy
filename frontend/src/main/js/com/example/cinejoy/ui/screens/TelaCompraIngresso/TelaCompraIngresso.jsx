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

      <main className="pagina-ingresso">
        <section className="poster-ingresso" role="img" aria-label="CineJoy: filmes, pipoca e algodão-doce"></section>

        <section className="topo-ingresso">
          <button type="button" onClick={voltarInicio}>
            Voltar para início
          </button>
          <div>
            <h1>{filme.titulo}</h1>
            <p>{filme.duracao} {filme.genero}</p>
          </div>
        </section>

        <section className="area-ingresso">
          <div className="painel-assentos">
            <div className="horarios-sessao">
              {sessoes.map((sessao) => (
                <button
                  className={sessaoEscolhida === sessao.id ? "ativo" : ""}
                  key={sessao.id}
                  type="button"
                  onClick={() => setSessaoEscolhida(sessao.id)}
                >
                  {sessao.data} - {sessao.horario}
                </button>
              ))}
            </div>

            <div className="rolagem-assentos" role="region" aria-label="Mapa de assentos" tabIndex={0}>
              <div className="mapa-assentos">
                {fileiras.map((fileira) => (
                  <div className="fileira-assentos" key={fileira}>
                    <strong>{fileira}</strong>
                    <div>
                      {criarAssentos()
                        .filter((assento) => assento.startsWith(fileira))
                        .map((assento) => (
                          <button
                            className={[
                              "botao-assento",
                              assentosSelecionados.includes(assento) ? "selecionado" : "",
                              assentosBloqueados.includes(assento) ? "ocupado" : "",
                              assentosAcessiveis.includes(assento) ? "acessivel" : ""
                            ].join(" ")}
                            key={assento}
                            type="button"
                            disabled={!sessao || assentosBloqueados.includes(assento)}
                            onClick={() => alternarAssento(assento)}
                            aria-label={`Assento ${assento}`}
                            aria-pressed={assentosSelecionados.includes(assento)}
                            title={`Assento ${assento}${assentosAcessiveis.includes(assento) ? " - acessível" : ""}${assentosBloqueados.includes(assento) ? " - ocupado" : ""}`}
                          >
                            {assento}
                          </button>
                        ))}
                    </div>
                    <strong>{fileira}</strong>
                  </div>
                ))}
                <div className="tela-cinema">TELA</div>
              </div>
            </div>
          </div>

          <aside className="resumo-ingresso">
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
            <div className="alimentos-ingresso">
              {produtos.length === 0 ? (
                <p className="carrinho-vazio">Nenhum alimento cadastrado.</p>
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

            <div className="total-ingresso">
              <span>Total</span>
              <strong>R$ {total.toFixed(2).replace(".", ",")}</strong>
            </div>
            {erro !== "" && <p className="erro-ingresso">{erro}</p>}
            <button className="finalizar-pedido" type="button" onClick={finalizarCompra}>
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
