import { ArrowLeft, LogOut, ReceiptText, UserRound } from "lucide-react";
import Cabecalho from "../Cabecalho/Cabecalho.jsx";
import Rodape from "../Rodape/Rodape.jsx";

export default function AreaUsuario({ cabecalho, aba, abrirConta, abrirPedidos, sair, voltarInicio, children }) {
  return <>
    <Cabecalho {...cabecalho} />
    <main className="area-usuario">
      <section className="food-banner" aria-label="Espaço para pôster"></section>
      <section className="conta-conteudo">
        <div className="conta-titulo">
          <button type="button" className="conta-voltar" onClick={voltarInicio} title="Voltar para início" aria-label="Voltar para início">
            <ArrowLeft size={22} />
          </button>
          <h1>{aba === "conta" ? "Minha conta" : "Meus pedidos"}</h1>
        </div>
        <nav className="conta-abas" aria-label="Área do usuário">
          <button type="button" aria-current={aba === "conta" ? "page" : undefined} onClick={abrirConta}>
            <UserRound size={18} /> Minha conta
          </button>
          <button type="button" aria-current={aba === "pedidos" ? "page" : undefined} onClick={abrirPedidos}>
            <ReceiptText size={18} /> Meus pedidos
          </button>
          <button type="button" className="conta-sair" onClick={sair}><LogOut size={18} /> Sair</button>
        </nav>
        {children}
      </section>
    </main>
    <Rodape />
  </>;
}
