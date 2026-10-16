import { useState } from "react";
import { salvarSala, excluirSala } from "../../../data/api/unidades.js";

export default function TelaSalas({ salas, unidades, atualizarDados }) {
  const vazio = { id: 0, unidadeId: "", numero: "" };
  const [formulario, setFormulario] = useState(vazio);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function salvar(evento) {
    evento.preventDefault();
    setSalvando(true);
    try {
      await salvarSala(formulario);
      await atualizarDados();
      setFormulario(vazio);
      setErro("");
    } catch (falha) { setErro(falha.message); }
    finally { setSalvando(false); }
  }

  async function excluir(id) {
    try {
      await excluirSala(id);
      await atualizarDados();
      setFormulario(vazio);
      setErro("");
    } catch (falha) { setErro(falha.message); }
  }

  return <main className="func-main single">
    <section className="func-panel">
      <h1>Salas das unidades</h1>
      <form className="func-form" onSubmit={salvar}>
        <label>Unidade<select required value={formulario.unidadeId}
          onChange={(e) => setFormulario({ ...formulario, unidadeId: e.target.value })}>
          <option value="">Selecione</option>
          {unidades.map((u) => <option key={u.id} value={u.id}>{u.nome}</option>)}
        </select></label>
        <label>Numero da sala<input required maxLength={10} value={formulario.numero}
          onChange={(e) => setFormulario({ ...formulario, numero: e.target.value })} /></label>
        <button disabled={salvando} type="submit">{formulario.id ? "Salvar" : "Adicionar"}</button>
        <button type="button" onClick={() => setFormulario(vazio)}>Limpar</button>
      </form>
      {erro && <p role="alert">{erro}</p>}
      {salas.map((sala) => <div className="func-info-grid" key={sala.id}>
        <span>{unidades.find((u) => u.id === sala.unidadeId)?.nome}<strong>Sala {sala.numero}</strong></span>
        <button type="button" onClick={() => setFormulario(sala)}>Editar</button>
        <button type="button" onClick={() => excluir(sala.id)}>Excluir</button>
      </div>)}
    </section>
  </main>;
}
