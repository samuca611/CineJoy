import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import BotaoUsuario from "../../components/BotaoUsuario/BotaoUsuario.jsx";
import Cabecalho from "../../components/Cabecalho/Cabecalho.jsx";
import Rodape from "../../components/Rodape/Rodape.jsx";
import TelaPagamento from "../TelaPagamento/TelaPagamento.jsx";

// componente principal da tela de alimentação
export default function TelaAlimentacao({
  abrirAlimentacao,
  abrirIngresso,
  abrirInicio,
  abrirLogin,
  abrirProgramacao,
  buscarFilme,
  produtos,
  registrarIngresso,
  trocarUnidade,
  unidadeEscolhidaId,
  unidades,
  usuarioLogado,
  voltarInicio
}) {
  //armazena os produtos adicionados no carrinho
  const [carrinho, setCarrinho] = useState([]);
  const [pagamentoAberto, setPagamentoAberto] = useState(false);

  // converte o preco do produto para formato numérico
  function precoProduto(produto) {
    return Number(String(produto.preco).replace(",", ".")) || 0;
  }

  // adiciona um item ao carrinho ou aumenta sua quantidade
  function adicionarProduto(produto) {
    const produtoNoCarrinho = carrinho.find((item) => item.id === produto.id);

    if (produtoNoCarrinho) {
      setCarrinho(
        carrinho.map((item) => {
          if (item.id === produto.id) {
            return { ...item, quantidade: item.quantidade + 1 };
          }

          return item;
        })
      );
      return;
    }

    setCarrinho([...carrinho, { ...produto, quantidade: 1 }]);
  }

  // remove um item do carrinho ou diminui sua quantidade
  function removerProduto(produto) {
    const produtoNoCarrinho = carrinho.find((item) => item.id === produto.id);

    if (!produtoNoCarrinho) {
      return;
    }

    if (produtoNoCarrinho.quantidade === 1) {
      setCarrinho(carrinho.filter((item) => item.id !== produto.id));
      return;
    }

    setCarrinho(
      carrinho.map((item) => {
        if (item.id === produto.id) {
          return { ...item, quantidade: item.quantidade - 1 };
        }

        return item;
      })
    );
  }

  // cálculo do valor total dos itens no carrinho
  const total = carrinho.reduce((soma, item) => soma + precoProduto(item) * item.quantidade, 0);

  if (pagamentoAberto) return <TelaPagamento
    abrirAlimentacao={abrirAlimentacao} abrirIngresso={abrirIngresso}
    abrirInicio={abrirInicio} abrirLogin={abrirLogin}
    abrirProgramacao={abrirProgramacao} buscarFilme={buscarFilme}
    alimentos={carrinho} assentos={[]} precoIngresso={0}
    registrarIngresso={registrarIngresso}
    trocarUnidade={trocarUnidade} unidade={unidades.find((u) => String(u.id) === String(unidadeEscolhidaId))}
    unidadeEscolhidaId={unidadeEscolhidaId} unidades={unidades}
    usuarioLogado={usuarioLogado} voltar={() => setPagamentoAberto(false)}
    voltarInicio={voltarInicio}
  />;

  return (
    <>
    {/* renderização do cabeçalho repassando todas as propriedades de navegação e estado */}
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

      <main className="food-page">
        <section className="food-banner"></section>

        <section className="food-toolbar">
          <button type="button" onClick={voltarInicio}>
            Voltar para inicio
          </button>
          <div>
            <p>Alimentacao CineJoy</p>
            <h1>Escolha seus alimentos</h1>
          </div>
        </section>

        <section className="food-layout">
          {/* lista de produtos disponiveis para compra */}
          <div className="food-products">
            {produtos.length === 0 ? (
              <p className="empty-message">
                Nenhum alimento cadastrado. Entre como funcionario para adicionar produtos.
              </p>
              // mapeia e exibe cada produto cadastrado em formato de cartão
            ) : produtos.map((produto) => (
              <article className="food-card" key={produto.id}>
                <img src={produto.imagem || "/assets/pipoca.jpg"} alt={produto.nome} />
                <div>
                  <h2>{produto.nome}</h2>
                  <p>{produto.descricao}</p>
                  <strong>R$ {precoProduto(produto).toFixed(2).replace(".", ",")}</strong>
                </div>
                <button type="button" onClick={() => adicionarProduto(produto)}>
                  <Plus size={18} />
                  Adicionar
                </button>
              </article>
            ))}
          </div>

          <aside className="cart-panel">
            <h2>
              <ShoppingCart size={22} />
              Carrinho
            </h2>

            {carrinho.length === 0 ? (
              <p className="empty-cart">Nenhum alimento selecionado.</p>
            ) : (
              <div className="cart-list">
                {carrinho.map((item) => (
                  <article className="cart-item" key={item.id}>
                    <span>{item.nome}</span>
                    <div>
                      <button type="button" onClick={() => removerProduto(item)}>
                        <Minus size={14} />
                      </button>
                      <strong>{item.quantidade}</strong>
                      <button type="button" onClick={() => adicionarProduto(item)}>
                        <Plus size={14} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="cart-total">
              <span>Total</span>
              <strong>R$ {total.toFixed(2).replace(".", ",")}</strong>
            </div>

            <button className="finish-order" type="button" disabled={!carrinho.length} onClick={() => setPagamentoAberto(true)}>
              Finalizar pedido
            </button>
          </aside>
        </section>
      </main>

      <Rodape />
      <BotaoUsuario abrirConta={abrirLogin} />
    </>
  );
}
