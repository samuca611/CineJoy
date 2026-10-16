import { Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { useState } from "react";
import { requisicao } from "../../../data/api/requisicao.js";

function dataDoFormulario(data) {
  const [dia, mes, ano] = data.split("/");
  return `${ano || new Date().getFullYear()}-${mes}-${dia}`;
}

export default function TelaSessoes({ filmes, salas, unidades, atualizarDados }) {
  const vazio = { id: 0, filmeId: "", unidadeId: "", salaId: "", data: "", horario: "", formato: "2D", preco: 24 };
  const [formulario, setFormulario] = useState(vazio);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(0);
  const sessoes = filmes.flatMap((filme) => (filme.sessoes || []).map((sessao) => ({ ...sessao, filmeId: filme.id, titulo: filme.titulo })));
  const salasDaUnidade = salas.filter((sala) => sala.unidadeId === Number(formulario.unidadeId));

  function campo(nome, valor) {
    setFormulario({ ...formulario, [nome]: valor });
  }

  function limpar() {
    setFormulario(vazio);
    setErro("");
    setMensagem("");
    setExcluindo(0);
  }

  function editar(sessao) {
    limpar();
    const sala = salas.find((item) => item.id === sessao.salaId);
    setFormulario({
      id: sessao.id, filmeId: sessao.filmeId, unidadeId: sala?.unidadeId || "", salaId: sessao.salaId,
      data: dataDoFormulario(sessao.data), horario: sessao.horario, formato: sessao.formato, preco: sessao.preco
    });
  }

  async function salvar(evento) {
    evento.preventDefault();
    if (salvando) return;
    setSalvando(true);
    setErro("");
    setMensagem("");
    const [ano, mes, dia] = formulario.data.split("-");
    try {
      await requisicao("/sessoes" + (formulario.id ? "/" + formulario.id : ""), formulario.id ? "PUT" : "POST", {
        id: formulario.id, filmeId: Number(formulario.filmeId), salaId: Number(formulario.salaId),
        data: `${dia}/${mes}/${ano}`, horario: formulario.horario, formato: formulario.formato, preco: Number(formulario.preco)
      });
      await atualizarDados();
      setMensagem(formulario.id ? "Sessão atualizada." : "Sessão adicionada.");
      setFormulario(vazio);
    } catch (falha) {
      setErro(falha.message);
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(id) {
    if (salvando) return;
    setSalvando(true);
    setErro("");
    setMensagem("");
    try {
      await requisicao("/sessoes/" + id, "DELETE");
      await atualizarDados();
      if (formulario.id === id) setFormulario(vazio);
      setExcluindo(0);
      setMensagem("Sessão excluída.");
    } catch (falha) {
      setErro(falha.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <main className="func-main single">
      <section className="func-panel func-cadastros">
        <h1>Sessões dos filmes</h1>
        {(filmes.length === 0 || salas.length === 0) && <p role="status">Cadastre um filme e uma sala antes de adicionar sessões.</p>}
        <form className="func-form" onSubmit={salvar}>
          <label className="wide">Filme
            <select required disabled={salvando} value={formulario.filmeId} onChange={(evento) => campo("filmeId", evento.target.value)}>
              <option value="">Selecione o filme</option>
              {filmes.map((filme) => <option key={filme.id} value={filme.id}>{filme.titulo}</option>)}
            </select>
          </label>
          <label>Unidade
            <select required disabled={salvando} value={formulario.unidadeId}
              onChange={(evento) => setFormulario({ ...formulario, unidadeId: evento.target.value, salaId: "" })}>
              <option value="">Selecione a unidade</option>
              {unidades.map((unidade) => <option key={unidade.id} value={unidade.id}>{unidade.nome}</option>)}
            </select>
          </label>
          <label>Sala
            <select required disabled={salvando || !formulario.unidadeId} value={formulario.salaId} onChange={(evento) => campo("salaId", evento.target.value)}>
              <option value="">{!formulario.unidadeId ? "Selecione uma unidade primeiro" : salasDaUnidade.length ? "Selecione a sala" : "Nenhuma sala nesta unidade"}</option>
              {salasDaUnidade.map((sala) => <option key={sala.id} value={sala.id}>Sala {sala.numero}</option>)}
            </select>
          </label>
          <label>Data
            <input required type="date" min="1900-01-01" max="9999-12-31" disabled={salvando} value={formulario.data} onChange={(evento) => campo("data", evento.target.value)} />
          </label>
          <label>Horário
            <input required type="time" disabled={salvando} value={formulario.horario} onChange={(evento) => campo("horario", evento.target.value)} />
          </label>
          <label>Formato
            <select disabled={salvando} value={formulario.formato} onChange={(evento) => campo("formato", evento.target.value)}>
              <option>2D</option><option>3D</option>
            </select>
          </label>
          <label>Preço do ingresso (R$)
            <input required type="number" min="0.01" max="10000" step="0.01" disabled={salvando} value={formulario.preco} onChange={(evento) => campo("preco", evento.target.value)} />
          </label>
          <div className="func-form-acoes">
            <button disabled={salvando || filmes.length === 0 || salasDaUnidade.length === 0} type="submit">
              {formulario.id ? <Save size={20} /> : <Plus size={20} />}
              {salvando ? "Salvando..." : formulario.id ? "Salvar alterações" : "Adicionar sessão"}
            </button>
            <button className="func-secundario" type="button" disabled={salvando} onClick={limpar}>
              <X size={20} />{formulario.id ? "Cancelar edição" : "Limpar"}
            </button>
          </div>
        </form>
        {erro && <p role="alert">{erro}</p>}
        {mensagem && <p role="status">{mensagem}</p>}
        <section className="func-registros" aria-label="Sessões cadastradas">
          <h2>Sessões cadastradas</h2>
          {sessoes.length === 0 && <p>Nenhuma sessão cadastrada.</p>}
          {sessoes.map((sessao) => (
            <article className="func-registro" key={sessao.id}>
              <div className="func-registro-texto">
                <h3>{sessao.titulo}</h3>
                <p>{unidades.find((unidade) => unidade.id === sessao.unidadeId)?.nome} - Sala {sessao.sala}</p>
                <p>{sessao.data} às {sessao.horario} · {sessao.formato} · {Number(sessao.preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
              </div>
              <div className="func-registro-acoes">
                <button type="button" disabled={salvando} title="Editar sessão" aria-label={"Editar sessão de " + sessao.titulo} onClick={() => editar(sessao)}>
                  <Pencil size={20} />
                </button>
                <button type="button" disabled={salvando} title="Excluir sessão" aria-label={"Excluir sessão de " + sessao.titulo}
                  onClick={() => { setExcluindo(sessao.id); setErro(""); setMensagem(""); }}>
                  <Trash2 size={20} />
                </button>
              </div>
              {excluindo === sessao.id && <div className="func-confirmacao">
                <p>Excluir esta sessão da programação?</p>
                <button type="button" disabled={salvando} onClick={() => excluir(sessao.id)}>Confirmar exclusão</button>
                <button type="button" disabled={salvando} onClick={() => setExcluindo(0)}>Cancelar</button>
              </div>}
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
