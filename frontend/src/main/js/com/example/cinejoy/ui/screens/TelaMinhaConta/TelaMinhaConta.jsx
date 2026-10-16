import { useEffect, useState } from "react";
import { RefreshCw, Save } from "lucide-react";
import { buscarMinhaConta, salvarMinhaConta } from "../../../data/api/usuarios.js";

export default function TelaMinhaConta({ estados, aoSalvar, pedirLogin }) {
  const [formulario, setFormulario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  async function carregar() {
    setCarregando(true);
    setErro("");
    try {
      const dados = await buscarMinhaConta();
      setFormulario({ ...dados, dataNascimento: dados.dataNascimento.slice(0, 10) });
    } catch (falha) {
      if (falha.status === 401) pedirLogin();
      else setErro(falha.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  function mudar(campo, valor) {
    setMensagem("");
    setFormulario({ ...formulario, [campo]: valor });
  }

  function mudarEstado(sigla) {
    const estado = estados.find((item) => item.sigla === sigla);
    setMensagem("");
    setFormulario({ ...formulario, estadoSigla: sigla, estadoNome: estado?.nome || "" });
  }

  async function salvar(evento) {
    evento.preventDefault();
    if (salvando) return;
    setSalvando(true);
    setErro("");
    setMensagem("");
    try {
      const dados = await salvarMinhaConta({
        nome: formulario.nome,
        dataNascimento: formulario.dataNascimento,
        telefone: formulario.telefone,
        estadoNome: formulario.estadoNome,
        estadoSigla: formulario.estadoSigla,
        cidadeNome: formulario.cidadeNome
      });
      setFormulario({ ...dados, dataNascimento: dados.dataNascimento.slice(0, 10) });
      aoSalvar(dados);
      setMensagem("Dados atualizados.");
    } catch (falha) {
      if (falha.status === 401) pedirLogin();
      else setErro(falha.message);
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) return <p role="status">Carregando sua conta...</p>;
  if (!formulario) return <div className="conta-aviso">
    <p role="alert">{erro}</p>
    <button type="button" onClick={carregar}><RefreshCw size={18} /> Tentar novamente</button>
  </div>;

  return <form className="conta-formulario" onSubmit={salvar} aria-label="Dados da minha conta">
    <fieldset disabled={salvando}>
      <label>CPF<input value={formulario.cpf} readOnly /></label>
      <label>Nome completo<input value={formulario.nome} onChange={(e) => mudar("nome", e.target.value)} maxLength={100} autoComplete="name" required /></label>
      <label>Email<input type="email" value={formulario.email} readOnly /></label>
      <label>Login<input value={formulario.userLogin} readOnly /></label>
      <label>Data de nascimento<input type="date" value={formulario.dataNascimento} onChange={(e) => mudar("dataNascimento", e.target.value)} autoComplete="bday" required /></label>
      <label>Telefone<input type="tel" value={formulario.telefone} onChange={(e) => mudar("telefone", e.target.value.replace(/\D/g, ""))} maxLength={11} pattern="[0-9]{10,11}" autoComplete="tel-national" /></label>
      <label>Estado<select value={formulario.estadoSigla} onChange={(e) => mudarEstado(e.target.value)} required>
        <option value="">Selecione</option>
        {formulario.estadoSigla && !estados.some((estado) => estado.sigla === formulario.estadoSigla) &&
          <option value={formulario.estadoSigla}>{formulario.estadoNome}</option>}
        {estados.map((estado) => <option key={estado.sigla} value={estado.sigla}>{estado.nome}</option>)}
      </select></label>
      <label>Cidade<input value={formulario.cidadeNome} onChange={(e) => mudar("cidadeNome", e.target.value)} maxLength={80} autoComplete="address-level2" required /></label>
    </fieldset>
    {erro && <p role="alert">{erro}</p>}
    {mensagem && <p role="status">{mensagem}</p>}
    <button type="submit" disabled={salvando}><Save size={19} /> {salvando ? "Salvando..." : "Salvar alteracoes"}</button>
  </form>;
}
