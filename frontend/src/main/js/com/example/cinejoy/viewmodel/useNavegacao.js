import { useEffect, useState } from "react";

export function useNavegacao(usuario) {
  const [tela, setTela] = useState("inicio");
  const [filmeCompra, setFilmeCompra] = useState(null);
  const [loginAberto, setLoginAberto] = useState(false);

  useEffect(() => {
    function acompanharEndereco(evento) {
      const endereco = window.location.hash;
      if (endereco === "#cadastro") {
        setTela("cadastro");
      } else if (endereco === "#minha-conta" || endereco === "#meus-pedidos") {
        if (usuario) {
          setLoginAberto(false);
          if (usuario.papel === "Funcionario") setTela("funcionario");
          else if (endereco === "#minha-conta") setTela("conta");
          else setTela("pedidos");
        } else {
          setTela("inicio");
          setLoginAberto(true);
        }
      } else if (evento) {
        setTela("inicio");
      }
    }

    acompanharEndereco();
    window.addEventListener("hashchange", acompanharEndereco);
    return () => window.removeEventListener("hashchange", acompanharEndereco);
  }, [usuario]);

  function abrirTela(nome) {
    setTela(nome);
    if (nome !== "compra") setFilmeCompra(null);
    if (nome === "cadastro") window.location.hash = "#cadastro";
    if (nome === "conta") window.location.hash = "#minha-conta";
    if (nome === "pedidos") window.location.hash = "#meus-pedidos";
    if (nome === "funcionario") window.history.replaceState(null, "", "#top");
    window.scrollTo(0, 0);
  }

  function abrirCompra(filme) {
    setFilmeCompra(filme);
    abrirTela("compra");
  }

  function voltarParaPrincipal(secao = "#top") {
    setTela("inicio");
    setFilmeCompra(null);
    window.location.hash = secao;
    setTimeout(() => {
      document.querySelector(secao)?.scrollIntoView();
    }, 0);
  }

  return { tela, filmeCompra, loginAberto, setLoginAberto, abrirTela, abrirCompra, voltarParaPrincipal };
}
