import { CalendarDays, MapPin, Search, Ticket, UserCircle, Utensils } from "lucide-react";
import { useState } from "react";

export default function Cabecalho({
  abrirAlimentacao,
  abrirIngresso,
  abrirInicio,
  abrirLogin,
  abrirProgramacao,
  buscarFilme = () => {},
  trocarUnidade = () => {},
  unidadeEscolhidaId,
  unidades = [],
  usuarioLogado
}) {
  const [textoBusca, setTextoBusca] = useState("");

  function clicarConta() {
    abrirLogin();
  }

  function enviarBusca(evento) {
    evento.preventDefault();
    buscarFilme(textoBusca);
  }

  const valorUnidade = unidadeEscolhidaId || (unidades[0] ? String(unidades[0].id) : "");

  return (
    <header className="site-header">
      <div className="account-strip">
        <button type="button" onClick={clicarConta}>
          <UserCircle size={17} />
          {usuarioLogado || "Entre/Cadastre-se"}
        </button>
      </div>

      <nav className="nav-shell" aria-label="Navegação principal">
        <button type="button" onClick={abrirAlimentacao}>
          <Utensils size={16} />
          Alimentação
        </button>
        <button type="button" onClick={abrirIngresso}>
          <Ticket size={16} />
          Ingresso
        </button>
        <div className="brand-mark">
          <button className="brand-logo-button" type="button" onClick={abrirInicio} aria-label="Inicio CineJoy">
            <img src="/assets/logo-cinejoy-header.png" alt="" />
          </button>

          <label className="cinema-field">
            <MapPin size={20} />
            <select value={valorUnidade} onChange={(evento) => trocarUnidade(evento.target.value)}>
              {unidades.length === 0 ? (
                <option value="">Seu Cinema</option>
              ) : unidades.map((unidade) => (
                <option value={unidade.id} key={unidade.id}>
                  {unidade.nome}
                </option>
              ))}
            </select>
          </label>
        </div>
        <form className="search-pill" onSubmit={enviarBusca}>
          <button type="submit" aria-label="Buscar filmes">
            <Search size={15} />
          </button>
          <input
            type="search"
            placeholder="Buscar"
            value={textoBusca}
            onChange={(evento) => setTextoBusca(evento.target.value)}
          />
        </form>
        <button type="button" onClick={abrirProgramacao}>
          <CalendarDays size={16} />
          Programação
        </button>
      </nav>
    </header>
  );
}
