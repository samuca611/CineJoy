import { Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { useState } from "react";
import { salvarSala, excluirSala } from "../../../data/api/unidades.js";

export default function TelaSalas({ salas, unidades, atualizarDados }) {
  const vazio = { id: 0, unidadeId: "", numero: "" };
  const [formulario, setFormulario] = useState(vazio);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(0);

  function limpar() {
    setFormulario(vazio);
    setErro("");
    setMensagem("");
    setExcluindo(0);
  }

  async function salvar(evento) {
    evento.preventDefault();
    if (salvando) return;
    setSalvando(true);
    setErro("");
    setMensagem("");
    try {
      await salvarSala({ ...formulario, numero: formulario.numero.trim() });
      await atualizarDados();
      setMensagem(formulario.id ? "Sala atualizada." : "Sala adicionada.");
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
      await excluirSala(id);
      await atualizarDados();
      if (formulario.id === id) setFormulario(vazio);
      setExcluindo(0);
      setMensagem("Sala excluída.");
    } catch (falha) {
      setErro(falha.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <main className="func-main single">
      <section className="func-panel func-cadastros">
        <h1>Salas das unidades</h1>
        {unidades.length === 0 && <p role="status">Cadastre uma unidade antes de adicionar salas.</p>}
        <form className="func-form" onSubmit={salvar}>
          <label>Unidade
            <select required disabled={salvando} value={formulario.unidadeId}
              onChange={(evento) => setFormulario({ ...formulario, unidadeId: evento.target.value })}>
              <option value="">Selecione a unidade</option>
              {unidades.map((unidade) => <option key={unidade.id} value={unidade.id}>{unidade.nome}</option>)}
            </select>
          </label>
          <label>Número da sala
            <input required maxLength={10} pattern=".*\S.*" disabled={salvando} value={formulario.numero}
              onChange={(evento) => setFormulario({ ...formulario, numero: evento.target.value })} />
          </label>
          <div className="func-form-acoes">
            <button disabled={salvando || unidades.length === 0} type="submit">
              {formulario.id ? <Save size={20} /> : <Plus size={20} />}
              {salvando ? "Salvando..." : formulario.id ? "Salvar alterações" : "Adicionar sala"}
            </button>
            <button className="func-secundario" type="button" disabled={salvando} onClick={limpar}>
              <X size={20} />{formulario.id ? "Cancelar edição" : "Limpar"}
            </button>
          </div>
        </form>
        {erro && <p role="alert">{erro}</p>}
        {mensagem && <p role="status">{mensagem}</p>}
        <section className="func-registros" aria-label="Salas cadastradas">
          <h2>Salas cadastradas</h2>
          {salas.length === 0 && <p>Nenhuma sala cadastrada.</p>}
          {salas.map((sala) => (
            <article className="func-registro" key={sala.id}>
              <div className="func-registro-texto">
                <h3>Sala {sala.numero}</h3>
                <p>{unidades.find((unidade) => unidade.id === sala.unidadeId)?.nome || "Unidade indisponível"}</p>
              </div>
              <div className="func-registro-acoes">
                <button type="button" disabled={salvando} title="Editar sala" aria-label={"Editar sala " + sala.numero}
                  onClick={() => { limpar(); setFormulario({ id: sala.id, unidadeId: sala.unidadeId, numero: sala.numero }); }}>
                  <Pencil size={20} />
                </button>
                <button type="button" disabled={salvando} title="Excluir sala" aria-label={"Excluir sala " + sala.numero}
                  onClick={() => { setExcluindo(sala.id); setErro(""); setMensagem(""); }}>
                  <Trash2 size={20} />
                </button>
              </div>
              {excluindo === sala.id && <div className="func-confirmacao">
                <p>Excluir a sala {sala.numero}? Suas sessões deixarão de aparecer na programação.</p>
                <button type="button" disabled={salvando} onClick={() => excluir(sala.id)}>Confirmar exclusão</button>
                <button type="button" disabled={salvando} onClick={() => setExcluindo(0)}>Cancelar</button>
              </div>}
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
