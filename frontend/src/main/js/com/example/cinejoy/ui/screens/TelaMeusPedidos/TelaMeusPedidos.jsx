import { useEffect, useState } from "react";
import { RefreshCw, Ticket } from "lucide-react";
import { buscarMeusPedidos } from "../../../data/api/pedidos.js";

function dinheiro(valor) {
  return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function TelaMeusPedidos({ pedirLogin, voltarInicio }) {
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  async function carregar() {
    setCarregando(true);
    setErro("");
    try {
      setPedidos(await buscarMeusPedidos());
    } catch (falha) {
      if (falha.status === 401) pedirLogin();
      else setErro(falha.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  return <section className="meus-pedidos" aria-label="Historico de compras" aria-busy={carregando}>
    <div className="pedidos-ferramentas">
      <span>{carregando ? "Carregando pedidos..." : pedidos.length + (pedidos.length === 1 ? " pedido" : " pedidos")}</span>
      <button type="button" onClick={carregar} disabled={carregando} title="Atualizar pedidos" aria-label="Atualizar pedidos"><RefreshCw size={20} /></button>
    </div>
    {erro && <p role="alert">{erro}</p>}
    {!carregando && !erro && pedidos.length === 0 && <div className="conta-aviso">
      <p>Nenhum pedido encontrado.</p>
      <button type="button" onClick={voltarInicio}><Ticket size={18} /> Ver filmes</button>
    </div>}
    {!carregando && !erro && pedidos.map((pedido) => <article className="pedido-item" key={pedido.id}>
      <header className="pedido-cabecalho">
        <div><h2>Pedido #{pedido.id}</h2><time dateTime={pedido.criadoEm}>{new Date(pedido.criadoEm).toLocaleString("pt-BR")}</time></div>
        <span className="pedido-situacao">{pedido.status === "Simulado" ? "Pagamento simulado" : "Pagamento pendente"}</span>
      </header>
      {pedido.ingressos.length > 0 && <section className="pedido-ingressos">
        <img src={pedido.ingressos[0].imagem || "/assets/ingresso.png"} alt={pedido.ingressos[0].filme} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/assets/ingresso.png"; }} />
        <div><h3>Ingressos</h3><ul>{pedido.ingressos.map((ingresso) => <li key={ingresso.id}>
          <strong>{ingresso.filme}</strong>
          <span>{ingresso.unidade} · Sala {ingresso.sala}</span>
          <span>{ingresso.data} às {ingresso.horario} · Assento {ingresso.assento}</span>
          <span>{dinheiro(ingresso.preco)}</span>
        </li>)}</ul></div>
      </section>}
      {pedido.alimentos.length > 0 && <section className="pedido-alimentos"><h3>Alimentos</h3>
        <ul>{pedido.alimentos.map((item) => <li key={item.produtoId}><span>{item.quantidade} × {item.nome}</span><strong>{dinheiro(item.quantidade * item.preco)}</strong></li>)}</ul>
      </section>}
      <footer className="pedido-total"><span>{pedido.formaPagamento}</span><strong>Total {dinheiro(pedido.total)}</strong></footer>
    </article>)}
  </section>;
}
