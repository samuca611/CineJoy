import { Banknote, CheckCircle2, CreditCard, QrCode } from "lucide-react";
import { useState } from "react";
import BotaoUsuario from "../../components/BotaoUsuario/BotaoUsuario.jsx";
import Cabecalho from "../../components/Cabecalho/Cabecalho.jsx";
import Rodape from "../../components/Rodape/Rodape.jsx";

export default function TelaPagamento({
  abrirAlimentacao,
  abrirIngresso,
  abrirInicio,
  abrirLogin,
  abrirProgramacao,
  buscarFilme,
  alimentos,
  assentos,
  filme,
  precoIngresso,
  registrarIngresso,
  sessao,
  trocarUnidade,
  unidade,
  unidadeEscolhidaId,
  unidades,
  usuarioLogado,
  voltar,
  voltarInicio
}) {
  const [formaPagamento, setFormaPagamento] = useState("Pix");
  const [compraFinalizada, setCompraFinalizada] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [pedido, setPedido] = useState(null);
  const [chave] = useState(() => crypto.randomUUID());
  const totalIngressos = assentos.length * precoIngresso;
  const totalAlimentos = alimentos.reduce((soma, item) => soma + precoProduto(item) * item.quantidade, 0);
  const total = totalIngressos + totalAlimentos;

  function precoProduto(produto) {
    return Number(String(produto.preco).replace(",", ".")) || 0;
  }

  async function confirmarPagamento() {
    if (enviando || compraFinalizada) return;
    setEnviando(true);
    setErro("");
    try {
    const resposta = await registrarIngresso({
      chave,
      idSessao: sessao?.id || 0,
      assentos,
      produtos: alimentos.map((item) => ({ id: item.id, quantidade: item.quantidade })),
      formaPagamento
    });
    setPedido(resposta);
    setCompraFinalizada(true);
    } catch (falha) {
      setErro(falha.message);
    } finally {
      setEnviando(false);
    }
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

      <main className="pagina-pagamento">
        <section className="poster-pagamento" role="img" aria-label="CineJoy: filmes, pipoca e algodão-doce"></section>

        <section className="topo-pagamento">
          <button type="button" onClick={voltar}>
            Voltar para assentos
          </button>
          <div>
            <p>Pagamento CineJoy</p>
            <h1>Finalize sua compra</h1>
          </div>
        </section>

        <section className="area-pagamento">
          <div className="formas-pagamento">
            <h2>Forma de pagamento</h2>

            <button
              className={formaPagamento === "Pix" ? "ativo" : ""}
              type="button"
              onClick={() => setFormaPagamento("Pix")}
            >
              <QrCode size={28} />
              Pix
            </button>
            <button
              className={formaPagamento === "Cartao" ? "ativo" : ""}
              type="button"
              onClick={() => setFormaPagamento("Cartao")}
            >
              <CreditCard size={28} />
              Cartão
            </button>
            <button
              className={formaPagamento === "Boleto" ? "ativo" : ""}
              type="button"
              onClick={() => setFormaPagamento("Boleto")}
            >
              <Banknote size={28} />
              Boleto
            </button>

            {formaPagamento === "Cartao" && (
              <div className="quadro-pagamento">
                <CreditCard size={84} />
                <p>Simulação com cartão. Nenhum valor será cobrado.</p>
              </div>
            )}

            {formaPagamento === "Pix" && (
              <div className="quadro-pagamento">
                <QrCode size={94} />
                <p>Simulação Pix. Nenhum código de cobrança será gerado.</p>
              </div>
            )}

            {formaPagamento === "Boleto" && (
              <div className="quadro-pagamento">
                <Banknote size={84} />
                <p>Simulação de boleto. Nenhum boleto será emitido.</p>
              </div>
            )}
          </div>

          <aside className="resumo-pagamento">
            {filme && <img src={filme.imagem} alt={filme.titulo} />}
            <h2>Resumo da compra</h2>
            {filme && <p><strong>Filme:</strong> {filme.titulo}</p>}
            <p><strong>Unidade:</strong> {unidade ? unidade.nome : "Não informada"}</p>
            <p><strong>Sessão:</strong> {sessao?.data} - {sessao?.horario}</p>
            <p><strong>Assentos:</strong> {assentos.join(", ")}</p>
            <p><strong>Ingressos:</strong> R$ {totalIngressos.toFixed(2).replace(".", ",")}</p>

            <div className="alimentos-pagamento">
              <strong>Alimentos</strong>
              {alimentos.length === 0 ? (
                <span>Nenhum alimento selecionado.</span>
              ) : (
                alimentos.map((item) => (
                  <span key={item.id}>{item.quantidade}x {item.nome}</span>
                ))
              )}
            </div>

            <div className="total-pagamento">
              <span>Total</span>
              <strong>R$ {Number(pedido?.total ?? total).toFixed(2).replace(".", ",")}</strong>
            </div>

            {compraFinalizada ? (
              <div className="pagamento-concluido">
                <CheckCircle2 size={28} />
                Pedido #{pedido?.id} salvo. Pagamento simulado.
              </div>
            ) : (
              <button className="finalizar-pedido" type="button" disabled={enviando} onClick={confirmarPagamento}>
                {enviando ? "Salvando..." : "Confirmar simulação"}
              </button>
            )}

            {erro && <p role="alert">{erro}</p>}
            <button className="acao-secundaria" type="button" onClick={voltarInicio}>
              Voltar para início
            </button>
          </aside>
        </section>
      </main>

      <Rodape />
      <BotaoUsuario abrirConta={abrirLogin} />
    </>
  );
}
