import { useState } from "react";
import BotaoUsuario from "../../components/BotaoUsuario/BotaoUsuario.jsx";
import Cabecalho from "../../components/Cabecalho/Cabecalho.jsx";
import Catalogo from "../../components/Catalogo/Catalogo.jsx";
import Heroi from "../../components/Heroi/Heroi.jsx";
import ModalLogin from "../../components/ModalLogin/ModalLogin.jsx";
import Programacao from "../../components/Programacao/Programacao.jsx";
import Rodape from "../../components/Rodape/Rodape.jsx";
import AreaUsuario from "../../components/AreaUsuario/AreaUsuario.jsx";
import TelaAlimentacao from "../TelaAlimentacao/TelaAlimentacao.jsx";
import TelaCadastro from "../TelaCadastro/TelaCadastro.jsx";
import TelaCompraIngresso from "../TelaCompraIngresso/TelaCompraIngresso.jsx";
import TelaFuncionario from "../TelaFuncionario/TelaFuncionario.jsx";
import TelaMinhaConta from "../TelaMinhaConta/TelaMinhaConta.jsx";
import TelaMeusPedidos from "../TelaMeusPedidos/TelaMeusPedidos.jsx";
import { useCineJoyViewModel } from "../../../viewmodel/useCineJoyViewModel.js";

export default function PaginaInicial() {
  const cineJoy = useCineJoyViewModel();
  const [textoBusca, setTextoBusca] = useState("");

  const filmesDaBusca = cineJoy.filmes.filter((filme) => {
    const texto = [filme.titulo, filme.genero, filme.descricao, filme.direcao, filme.elenco]
      .join(" ").toLowerCase();
    return texto.includes(textoBusca.toLowerCase()) && filme.sessoes.some((sessao) =>
      String(sessao.unidadeId) === String(cineJoy.unidadeEscolhidaId));
  });

  function abrirLogin() {
    if (!cineJoy.usuario) cineJoy.setLoginAberto(true);
    else cineJoy.abrirTela(cineJoy.usuario.papel === "Funcionario" ? "funcionario" : "conta");
  }

  function abrirCadastro() {
    cineJoy.setLoginAberto(false);
    cineJoy.abrirTela("cadastro");
  }

  function buscarFilme(texto) {
    setTextoBusca(texto.trim());
    cineJoy.voltarParaPrincipal(texto.trim() ? "#catalogo" : "#top");
  }

  function abrirAlimentacao() {
    if (cineJoy.tela === "inicio" || cineJoy.tela === "compra") {
      cineJoy.abrirTela("alimentacao");
    } else {
      cineJoy.voltarParaPrincipal(cineJoy.tela === "alimentacao" ? "#top" : "#alimentacao");
    }
  }

  const cabecalho = {
    abrirAlimentacao,
    abrirIngresso: () => cineJoy.voltarParaPrincipal("#ingresso"),
    abrirInicio: () => cineJoy.voltarParaPrincipal(),
    abrirLogin,
    abrirProgramacao: () => cineJoy.voltarParaPrincipal("#programacao"),
    buscarFilme,
    trocarUnidade: cineJoy.setUnidadeEscolhidaId,
    unidadeEscolhidaId: cineJoy.unidadeEscolhidaId,
    unidades: cineJoy.unidades,
    usuarioLogado: cineJoy.usuarioLogado
  };

  function mostrarTela() {
    if (cineJoy.tela === "funcionario" && cineJoy.usuario?.papel === "Funcionario") {
      return <TelaFuncionario
        filmes={cineJoy.filmes} ingressos={cineJoy.ingressos} logs={cineJoy.logs}
        produtos={cineJoy.produtos} salas={cineJoy.salas} unidades={cineJoy.unidades}
        usuario={cineJoy.usuario} sair={cineJoy.sair} atualizarDados={cineJoy.carregarDados}
        gravarFilme={cineJoy.gravarFilme} removerFilme={cineJoy.removerFilme}
        gravarProduto={cineJoy.gravarProduto} removerProduto={cineJoy.removerProduto}
        gravarUnidade={cineJoy.gravarUnidade} removerUnidade={cineJoy.removerUnidade}
        alterarStatus={cineJoy.alterarStatus}
      />;
    }

    if ((cineJoy.tela === "conta" || cineJoy.tela === "pedidos") && cineJoy.usuario) {
      return <AreaUsuario
        cabecalho={cabecalho} aba={cineJoy.tela}
        abrirConta={() => cineJoy.abrirTela("conta")}
        abrirPedidos={() => cineJoy.abrirTela("pedidos")}
        sair={cineJoy.sair} voltarInicio={cabecalho.abrirInicio}
      >
        {cineJoy.tela === "conta" ? (
          <TelaMinhaConta estados={cineJoy.estados} aoSalvar={cineJoy.atualizarConta} pedirLogin={cineJoy.pedirNovoLogin} />
        ) : (
          <TelaMeusPedidos pedirLogin={cineJoy.pedirNovoLogin} voltarInicio={() => cineJoy.voltarParaPrincipal("#catalogo")} />
        )}
      </AreaUsuario>;
    }

    if (cineJoy.tela === "cadastro") {
      return <TelaCadastro
        {...cabecalho}
        cadastrarUsuario={cineJoy.cadastrarNovoUsuario}
        cidades={cineJoy.cidades} estados={cineJoy.estados}
        voltarInicio={cabecalho.abrirInicio}
      />;
    }

    if (cineJoy.tela === "alimentacao") {
      return <TelaAlimentacao
        {...cabecalho}
        produtos={cineJoy.produtos} registrarIngresso={cineJoy.registrarIngresso}
        voltarInicio={cabecalho.abrirInicio}
      />;
    }

    if (cineJoy.tela === "compra" && cineJoy.filmeCompra) {
      return <TelaCompraIngresso
        {...cabecalho}
        filme={cineJoy.filmes.find((filme) => filme.id === cineJoy.filmeCompra.id) || cineJoy.filmeCompra}
        produtos={cineJoy.produtos} registrarIngresso={cineJoy.registrarIngresso}
        unidadeEscolhida={cineJoy.unidadeEscolhida} voltarInicio={cabecalho.abrirInicio}
      />;
    }

    return <>
      <Cabecalho {...cabecalho} />
      <main>
        <Heroi />
        <Catalogo filmes={filmesDaBusca} selecionarFilme={cineJoy.abrirCompra} textoBusca={textoBusca} />
        <Programacao
          filmes={filmesDaBusca} produtos={cineJoy.produtos} textoBusca={textoBusca}
          unidadeEscolhida={cineJoy.unidadeEscolhida} unidades={cineJoy.unidades}
          datas={cineJoy.datas} dataEscolhida={cineJoy.dataEscolhida}
          selecionarFilme={cineJoy.abrirCompra} trocarData={cineJoy.setDataEscolhida}
        />
      </main>
      <Rodape />
      <BotaoUsuario abrirConta={abrirLogin} />
    </>;
  }

  return <>
    {cineJoy.erroApi && <p role="alert">{cineJoy.erroApi}</p>}
    {mostrarTela()}
    {cineJoy.loginAberto && <ModalLogin
      abrirCadastro={abrirCadastro}
      fecharLogin={() => cineJoy.setLoginAberto(false)}
      entrar={cineJoy.entrar}
    />}
  </>;
}
