import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { converterData } from "../../../data/model/datas.js";

function AbasDeData({ datas, dataEscolhida, trocarData }) {
  function mudarData(passo) {
    if (!datas.length) return;
    const atual = Math.max(0, datas.indexOf(dataEscolhida));
    trocarData(datas[(atual + passo + datas.length) % datas.length]);
  }

  return (
    <div className="abas-datas">
      <button type="button" aria-label="Data anterior" onClick={() => mudarData(-1)}>
        <ChevronLeft size={16} />
      </button>

      {datas.map((data) => (
        <button
          className={dataEscolhida === data ? "ativo" : ""}
          key={data}
          onClick={() => trocarData(data)}
          type="button"
        >
          <span>{converterData(data).toLocaleDateString("pt-BR", { weekday: "short" })}</span>
          <strong>{data}</strong>
        </button>
      ))}

      <button type="button" aria-label="Próxima data" onClick={() => mudarData(1)}>
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

function FilmeDaLista({ filme, selecionarFilme }) {
  return (
    <article className="item-filme" onClick={() => selecionarFilme(filme)}>
      <img src={filme.imagem} alt={`Pôster de ${filme.titulo}`} />

      <div className="dados-filme">
        <h3>{filme.titulo}</h3>
        <p>
          {filme.duracao} {filme.genero}
        </p>
        <p>
          <strong>Direção:</strong> {filme.direcao || "Não informada"}
        </p>
        <p>
          <strong>Elenco:</strong> {filme.elenco || "Não informado"}
        </p>
      </div>
    </article>
  );
}

function ordemDoFilme(filme) {
  const titulo = filme.titulo.toLowerCase();

  if (titulo.includes("aranha")) return 1;
  if (titulo.includes("odisseia")) return 2;
  if (titulo.includes("blurry")) return 3;
  return 4;
}

export default function Programacao({ filmes, produtos, textoBusca, unidadeEscolhida, unidades, datas, dataEscolhida, trocarData, selecionarFilme }) {
  const filmesDoDia = filmes
    .map((filme) => {
      return {
        ...filme,
        sessoes: (filme.sessoes || []).filter((sessao) => sessao.data === dataEscolhida &&
          sessao.unidadeId === unidadeEscolhida?.id)
      };
    })
    .filter((filme) => filme.sessoes.length > 0);

  const filmesParaMostrar = filmesDoDia;
  const filmesOrdenados = [...filmesParaMostrar].sort((a, b) => {
    return ordemDoFilme(a) - ordemDoFilme(b);
  });
  const produto = produtos[0];
  const unidade = unidadeEscolhida || unidades[0];

  return (
    <section className="faixa-programacao" id="programacao">
      <div className="conteudo-central area-programacao">
        {produto && (
          <aside className="destaque-alimento" id="alimentacao">
            <img src={produto.imagem || "/assets/pipoca.jpg"} alt={produto.nome} />
            <div>
              <p>Alimentação</p>
              <h2>{produto.nome}</h2>
              <span>{produto.descricao}</span>
            </div>
          </aside>
        )}

        <div className="schedule-panel" id="ingresso">
          <div className="titulo-secao compacto">
            <p>Em cartaz | Em breve</p>
            <span className="localizacao">
              <MapPin size={15} />
              {unidade ? unidade.nome : "Nenhuma unidade cadastrada"}
            </span>
          </div>

          <AbasDeData
            datas={datas}
            dataEscolhida={dataEscolhida}
            trocarData={trocarData}
          />

          <div className="lista-filmes">
            {filmesOrdenados.length === 0 ? (
              <p className="mensagem-vazia">
                {textoBusca ? "Nenhum filme encontrado na busca." : "Nenhum filme cadastrado para a programação."}
              </p>
            ) : filmesOrdenados.slice(0, 3).map((filme) => (
              <FilmeDaLista filme={filme} key={filme.id} selecionarFilme={selecionarFilme} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
