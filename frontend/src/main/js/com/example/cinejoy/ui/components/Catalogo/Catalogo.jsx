import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function Catalogo({ filmes, selecionarFilme, textoBusca }) {
  const [inicio, setInicio] = useState(0);
  const quantidadeVisivel = 3;
  const filmesVisiveis = [];

  for (let i = 0; i < quantidadeVisivel && i < filmes.length; i++) {
    const posicao = (inicio + i) % filmes.length;
    filmesVisiveis.push(filmes[posicao]);
  }

  function voltarPosters() {
    if (filmes.length === 0) {
      return;
    }

    if (inicio === 0) {
      setInicio(filmes.length - 1);
    } else {
      setInicio(inicio - 1);
    }
  }

  function avancarPosters() {
    if (filmes.length === 0) {
      return;
    }

    if (inicio === filmes.length - 1) {
      setInicio(0);
    } else {
      setInicio(inicio + 1);
    }
  }

  return (
    <section className="orange-band" id="catalogo">
      <div className="content-wrap">
        <div className="section-heading">
          <p>Confira | Pré-venda</p>
          <div className="arrow-group">
            <button type="button" aria-label="Anterior" onClick={voltarPosters}>
              <ChevronLeft size={19} />
            </button>
            <button type="button" aria-label="Próximo" onClick={avancarPosters}>
              <ChevronRight size={19} />
            </button>
          </div>
        </div>

        <div className="catalog-row">
          {filmesVisiveis.length === 0 ? (
            <p className="empty-message">
              {textoBusca ? "Nenhum filme encontrado." : "Nenhum filme cadastrado. Entre como funcionário para adicionar filmes."}
            </p>
          ) : filmesVisiveis.map((filme) => (
            <article className="catalog-card" key={filme.id}>
              <strong>{filme.titulo}</strong>
              <button type="button" onClick={() => selecionarFilme(filme)}>
                <img
                  src={filme.posterCatalogo || filme.imagem}
                  alt={`Pôster de ${filme.titulo}`}
                />
              </button>
              <small>
                {filme.genero.split("/")[0]} {filme.duracao}
              </small>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
