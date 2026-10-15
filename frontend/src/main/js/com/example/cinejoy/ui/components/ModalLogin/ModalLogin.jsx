import { useState } from "react";

export default function ModalLogin({ abrirCadastro, fecharLogin, entrar }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  async function enviarLogin(evento) {
    evento.preventDefault();

    if (email === "" || senha === "") {
      setErro("Preencha email e senha.");
      return;
    }

    try {
      await entrar(email, senha);
      fecharLogin();
    } catch (erro) {
      setErro(erro.message);
    }
  }

  function irParaCadastro(evento) {
    evento.preventDefault();
    abrirCadastro();
  }

  return (
    <div className="login-overlay" onClick={fecharLogin}>
      <section className="login-modal" onClick={(evento) => evento.stopPropagation()}>
        <img src="/assets/logo-cinejoy-footer.png" alt="CineJoy" />

        <form className="login-form" onSubmit={enviarLogin}>
          <h2>Acesso por Email</h2>

          <label>
            <input
              type="email"
              placeholder="email"
              value={email}
              onChange={(evento) => setEmail(evento.target.value)}
            />
          </label>

          <label>
            <input
              type="password"
              placeholder="senha"
              value={senha}
              onChange={(evento) => setSenha(evento.target.value)}
            />
          </label>

          <a href="#recuperar-senha">esqueci a senha</a>

          {erro !== "" && <span className="login-error">{erro}</span>}

          <button className="login-button" type="submit">
            Entrar
          </button>
        </form>

        <p>
          Ou <a href="#cadastro" onClick={irParaCadastro}>Cadastre-se</a>
        </p>
      </section>
    </div>
  );
}
