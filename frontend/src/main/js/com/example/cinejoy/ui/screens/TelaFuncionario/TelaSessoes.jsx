import { useState } from "react";
import { requisicao } from "../../../data/api/requisicao.js";

export default function TelaSessoes({ filmes, salas, unidades, atualizarDados }) {
  const vazio = { id: 0, filmeId: "", salaId: "", data: "", horario: "", formato: "2D", preco: 24 };
  const [formulario, setFormulario] = useState(vazio);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const sessoes = filmes.flatMap((filme) => filme.sessoes.map((s) => ({ ...s, titulo: filme.titulo })));
  function campo(nome, valor) { setFormulario({ ...formulario, [nome]: valor }); }

  async function salvar(evento) {
    evento.preventDefault();
    setSalvando(true);
    try {
      await requisicao("/sessoes" + (formulario.id ? "/" + formulario.id : ""), formulario.id ? "PUT" : "POST", {
        ...formulario, filmeId: Number(formulario.filmeId), salaId: Number(formulario.salaId), preco: Number(formulario.preco)
      });
      await atualizarDados();
      setFormulario(vazio);
      setErro("");
    } catch (falha) { setErro(falha.message); }
    finally { setSalvando(false); }
  }

  async function excluir(id) {
    try {
      await requisicao("/sessoes/" + id, "DELETE");
      await atualizarDados();
      setFormulario(vazio);
      setErro("");
    } catch (falha) { setErro(falha.message); }
  }

  return <main className="func-main single"><section className="func-panel">
    <h1>Sessoes dos filmes</h1>
    <form className="func-form" onSubmit={salvar}>
      <label>Filme<select required value={formulario.filmeId} onChange={(e) => campo("filmeId", e.target.value)}>
        <option value="">Selecione</option>
        {filmes.map((f) => <option key={f.id} value={f.id}>{f.titulo}</option>)}
      </select></label>
      <label>Sala<select required value={formulario.salaId} onChange={(e) => campo("salaId", e.target.value)}>
        <option value="">Selecione</option>
        {salas.map((s) => <option key={s.id} value={s.id}>{unidades.find((u) => u.id === s.unidadeId)?.nome} - Sala {s.numero}</option>)}
      </select></label>
      <label>Data<input required placeholder="DD/MM/AAAA" value={formulario.data} onChange={(e) => campo("data", e.target.value)} /></label>
      <label>Horario<input required type="time" value={formulario.horario} onChange={(e) => campo("horario", e.target.value)} /></label>
      <label>Formato<select value={formulario.formato} onChange={(e) => campo("formato", e.target.value)}>
        <option>2D</option><option>3D</option>
      </select></label>
      <label>Preco<input required type="number" min="0.01" step="0.01" value={formulario.preco} onChange={(e) => campo("preco", e.target.value)} /></label>
      <button disabled={salvando} type="submit">{formulario.id ? "Salvar" : "Adicionar"}</button>
      <button type="button" onClick={() => setFormulario(vazio)}>Limpar</button>
    </form>
    {erro && <p role="alert">{erro}</p>}
    {sessoes.map((s) => <div key={s.id} className="func-info-grid">
      <span>{s.titulo}<strong>{s.data} - {s.horario} - Sala {s.sala}</strong></span>
      <button type="button" onClick={() => setFormulario(s)}>Editar</button>
      <button type="button" onClick={() => excluir(s.id)}>Excluir</button>
    </div>)}
  </section></main>;
}
