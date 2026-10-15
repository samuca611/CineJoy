import { useState } from "react";
import BotaoUsuario from "../../components/BotaoUsuario/BotaoUsuario.jsx";
import Cabecalho from "../../components/Cabecalho/Cabecalho.jsx";
import Catalogo from "../../components/Catalogo/Catalogo.jsx";
import Heroi from "../../components/Heroi/Heroi.jsx";
import ModalLogin from "../../components/ModalLogin/ModalLogin.jsx";
import Programacao from "../../components/Programacao/Programacao.jsx";
import Rodape from "../../components/Rodape/Rodape.jsx";
import TelaAlimentacao from "../TelaAlimentacao/TelaAlimentacao.jsx";
import TelaCadastro from "../TelaCadastro/TelaCadastro.jsx";
import TelaCompraIngresso from "../TelaCompraIngresso/TelaCompraIngresso.jsx";
import TelaFuncionario from "../TelaFuncionario/TelaFuncionario.jsx";
import { useCineJoyViewModel } from "../../../viewmodel/useCineJoyViewModel.js";

export default function PaginaInicial() {
  const cineJoy = useCineJoyViewModel();
  return <>
    {cineJoy.erroApi && <p role="alert">{cineJoy.erroApi}</p>}
    <Conteudo cineJoy={cineJoy} />
  </>;
}

function Conteudo({ cineJoy }) {
  const [textoBusca, setTextoBusca] = useState("");

  const busca = textoBusca.toLowerCase();
  const filmesDaBusca = cineJoy.filmes.filter((filme) => {
    const dadosDoFilme = [
      filme.titulo,
      filme.genero,
      filme.descricao,
      filme.direcao,
      filme.elenco
    ].join(" ").toLowerCase();

    return dadosDoFilme.includes(busca) && filme.sessoes.some((s) =>
      String(s.unidadeId) === String(cineJoy.unidadeEscolhidaId));
  });

  function abrirLogin() {
    if (!cineJoy.usuarioLogado) {
      cineJoy.setLoginAberto(true);
    } else if (cineJoy.usuario.papel === "Funcionario") {
      cineJoy.setTelaFuncionario(true);
    } else if (window.confirm("Sair da sua conta?")) {
      cineJoy.sair();
    }
  }

  function abrirCadastro() {
    cineJoy.setLoginAberto(false);
    cineJoy.setTelaAlimentacao(false);
    cineJoy.setFilmeCompra(null);
    cineJoy.setTelaCadastro(true);
  }

  function abrirInicio() {
    cineJoy.setTelaCadastro(false);
    cineJoy.irParaSecao("#top");
  }

  function voltarParaPrincipal(secao) {
    cineJoy.setTelaCadastro(false);
    cineJoy.voltarParaPrincipal(secao);
  }

  function buscarFilme(texto) {
    setTextoBusca(texto.trim());
    cineJoy.setTelaCadastro(false);
    cineJoy.setTelaAlimentacao(false);
    cineJoy.setFilmeCompra(null);

    setTimeout(() => {
      cineJoy.irParaSecao(texto.trim() === "" ? "#top" : "#catalogo");
    }, 0);
  }

  if (cineJoy.telaFuncionario) {
    return (
      <TelaFuncionario
        filmes={cineJoy.filmes}
        ingressos={cineJoy.ingressos}
        logs={cineJoy.logs}
        gravarFilme={cineJoy.gravarFilme}
        removerFilme={cineJoy.removerFilme}
        gravarProduto={cineJoy.gravarProduto}
        removerProduto={cineJoy.removerProduto}
        gravarUnidade={cineJoy.gravarUnidade}
        removerUnidade={cineJoy.removerUnidade}
        alterarStatus={cineJoy.alterarStatus}
        produtos={cineJoy.produtos}
        salas={cineJoy.salas}
        usuario={cineJoy.usuario}
        atualizarDados={cineJoy.carregarDados}
        sair={cineJoy.sair}
        unidades={cineJoy.unidades}
      />
    );
  }

  if (cineJoy.telaCadastro) {
    return (
      <TelaCadastro
        abrirAlimentacao={() => voltarParaPrincipal("#alimentacao")}
        abrirIngresso={() => voltarParaPrincipal("#ingresso")}
        abrirInicio={abrirInicio}
        abrirLogin={abrirLogin}
        abrirProgramacao={() => voltarParaPrincipal("#programacao")}
        buscarFilme={buscarFilme}
        cadastrarUsuario={cineJoy.cadastrarNovoUsuario}
        cidades={cineJoy.cidades}
        estados={cineJoy.estados}
        trocarUnidade={cineJoy.setUnidadeEscolhidaId}
        unidadeEscolhidaId={cineJoy.unidadeEscolhidaId}
        unidades={cineJoy.unidades}
        usuarioLogado={cineJoy.usuarioLogado}
        voltarInicio={abrirInicio}
      />
    );
  }

  if (cineJoy.telaAlimentacao) {
    return (
      <>
        <TelaAlimentacao
          abrirAlimentacao={() => cineJoy.voltarParaPrincipal("#top")}
          abrirIngresso={() => cineJoy.voltarParaPrincipal("#ingresso")}
          abrirInicio={() => cineJoy.voltarParaPrincipal("#top")}
          abrirLogin={abrirLogin}
          abrirProgramacao={() => cineJoy.voltarParaPrincipal("#programacao")}
          buscarFilme={buscarFilme}
          produtos={cineJoy.produtos}
          registrarIngresso={cineJoy.registrarIngresso}
          trocarUnidade={cineJoy.setUnidadeEscolhidaId}
          unidadeEscolhidaId={cineJoy.unidadeEscolhidaId}
          unidades={cineJoy.unidades}
          usuarioLogado={cineJoy.usuarioLogado}
          voltarInicio={() => cineJoy.voltarParaPrincipal("#top")}
        />
        {cineJoy.loginAberto && (
          <ModalLogin
            abrirCadastro={abrirCadastro}
            fecharLogin={() => cineJoy.setLoginAberto(false)}
            entrar={cineJoy.entrar}
          />
        )}
      </>
    );
  }

  if (cineJoy.filmeCompra) {
    return (
      <>
        <TelaCompraIngresso
          abrirAlimentacao={() => {
            cineJoy.setFilmeCompra(null);
            cineJoy.setTelaAlimentacao(true);
          }}
          abrirIngresso={() => cineJoy.voltarParaPrincipal("#ingresso")}
          abrirInicio={() => cineJoy.voltarParaPrincipal("#top")}
          abrirLogin={abrirLogin}
          abrirProgramacao={() => cineJoy.voltarParaPrincipal("#programacao")}
          buscarFilme={buscarFilme}
          filme={cineJoy.filmes.find((filme) => filme.id === cineJoy.filmeCompra.id) || cineJoy.filmeCompra}
          produtos={cineJoy.produtos}
          registrarIngresso={cineJoy.registrarIngresso}
          trocarUnidade={cineJoy.setUnidadeEscolhidaId}
          unidadeEscolhida={cineJoy.unidadeEscolhida}
          unidadeEscolhidaId={cineJoy.unidadeEscolhidaId}
          unidades={cineJoy.unidades}
          usuarioLogado={cineJoy.usuarioLogado}
          voltarInicio={() => cineJoy.voltarParaPrincipal("#top")}
        />
        {cineJoy.loginAberto && (
          <ModalLogin
            abrirCadastro={abrirCadastro}
            fecharLogin={() => cineJoy.setLoginAberto(false)}
            entrar={cineJoy.entrar}
          />
        )}
      </>
    );
  }

  return (
    <>
      <Cabecalho
        abrirAlimentacao={() => cineJoy.setTelaAlimentacao(true)}
        abrirIngresso={() => cineJoy.irParaSecao("#ingresso")}
        abrirInicio={() => cineJoy.irParaSecao("#top")}
        abrirLogin={abrirLogin}
        abrirProgramacao={() => cineJoy.irParaSecao("#programacao")}
        buscarFilme={buscarFilme}
        trocarUnidade={cineJoy.setUnidadeEscolhidaId}
        unidadeEscolhidaId={cineJoy.unidadeEscolhidaId}
        unidades={cineJoy.unidades}
        usuarioLogado={cineJoy.usuarioLogado}
      />
      <main>
        <Heroi />
        <Catalogo filmes={filmesDaBusca} selecionarFilme={cineJoy.setFilmeCompra} textoBusca={textoBusca} />
        <Programacao
          filmes={filmesDaBusca}
          produtos={cineJoy.produtos}
          textoBusca={textoBusca}
          unidadeEscolhida={cineJoy.unidadeEscolhida}
          unidades={cineJoy.unidades}
          datas={cineJoy.datas}
          dataEscolhida={cineJoy.dataEscolhida}
          selecionarFilme={cineJoy.setFilmeCompra}
          trocarData={cineJoy.setDataEscolhida}
        />
      </main>
      <Rodape />
      <BotaoUsuario />
      {cineJoy.loginAberto && (
        <ModalLogin
          abrirCadastro={abrirCadastro}
          fecharLogin={() => cineJoy.setLoginAberto(false)}
          entrar={cineJoy.entrar}
        />
      )}
    </>
  );
}
