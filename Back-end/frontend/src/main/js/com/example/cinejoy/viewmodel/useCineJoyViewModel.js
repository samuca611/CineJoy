import { useEffect, useState } from "react";
import {
  adicionarFilme, adicionarProduto, adicionarUnidade, buscarDadosDaHome,
  buscarLocalidades, cadastrarUsuario, comprarIngresso, editarFilme,
  editarProduto, editarUnidade, excluirFilme, excluirProduto, excluirUnidade,
  loginUsuario, sairDaConta, buscarSalas, atualizarStatusPedido
} from "../data/api/api.js";
import { pegarDatas } from "../data/model/datas.js";

export function useCineJoyViewModel() {
  const [filmes, setFilmes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [salas, setSalas] = useState([]);
  const [unidadeEscolhidaId, setUnidadeEscolhidaId] = useState("");
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [ingressos, setIngressos] = useState([]);
  const [logs, setLogs] = useState([]);
  const [erroApi, setErroApi] = useState("");
  const [dataEscolhida, setDataEscolhida] = useState("");
  const [loginAberto, setLoginAberto] = useState(false);
  const [filmeCompra, setFilmeCompra] = useState(null);
  const [telaAlimentacao, setTelaAlimentacao] = useState(false);
  const [telaCadastro, setTelaCadastro] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [telaFuncionario, setTelaFuncionario] = useState(false);
  const datas = pegarDatas(filmes, unidadeEscolhidaId);
  const usuarioLogado = usuario?.nome || "";
  const unidadeEscolhida = unidades.find((u) => String(u.id) === String(unidadeEscolhidaId)) || unidades[0] || null;

  useEffect(() => {
    setTelaCadastro(window.location.hash === "#cadastro");
    carregarDados().catch((erro) => setErroApi(erro.message));
    buscarLocalidades().then((dados) => {
      setEstados(dados.estados);
      setCidades(dados.cidades);
    }).catch((erro) => setErroApi(erro.message));
  }, []);

  useEffect(() => {
    if (datas.length && !datas.includes(dataEscolhida)) setDataEscolhida(datas[0]);
  }, [datas, dataEscolhida]);

  useEffect(() => {
    if (unidades.length && !unidades.some((u) => String(u.id) === String(unidadeEscolhidaId)))
      setUnidadeEscolhidaId(String(unidades[0].id));
  }, [unidades, unidadeEscolhidaId]);

  async function carregarDados() {
    const dados = await buscarDadosDaHome();
    setFilmes(dados.filmes);
    setProdutos(dados.produtos);
    setUnidades(dados.unidades);
    setUsuario(dados.usuario);
    setIngressos(dados.ingressos);
    setLogs(dados.logs);
    setSalas(await buscarSalas());
    setErroApi("");
    return dados;
  }

  async function entrar(email, senha) {
    const conta = await loginUsuario(email, senha);
    setUsuario(conta);
    setTelaFuncionario(conta.papel === "Funcionario");
    setTelaCadastro(false);
    setLoginAberto(false);
    await carregarDados();
  }

  async function sair() {
    try {
      await sairDaConta();
      setUsuario(null);
      setTelaFuncionario(false);
      setFilmeCompra(null);
      await carregarDados();
    } catch (erro) { setErroApi(erro.message); }
  }

  async function registrarIngresso(dados) {
    const pedido = await comprarIngresso(dados);
    await carregarDados();
    return pedido;
  }

  async function cadastrarNovoUsuario(dados) {
    try {
      const conta = await cadastrarUsuario(dados);
      setUsuario(conta);
      setTelaCadastro(false);
      setLoginAberto(false);
      window.location.hash = "#top";
      await carregarDados();
      return { deuCerto: true };
    } catch (erro) {
      return { deuCerto: false, mensagem: erro.message };
    }
  }

  async function gravarFilme(filme, incluir) {
    try {
      let salvo;
      if (incluir) {
        salvo = await adicionarFilme(filme);
      } else {
        salvo = await editarFilme(filme);
      }

      const dados = await carregarDados();
      return dados.filmes.find((item) => item.id === salvo.id);
    } catch (erro) {
      setErroApi(erro.message);
      return null;
    }
  }

  async function removerFilme(id) {
    try {
      await excluirFilme(id);
      await carregarDados();
      return true;
    } catch (erro) {
      setErroApi(erro.message);
      return false;
    }
  }

  async function gravarProduto(produto, incluir) {
    try {
      let salvo;
      if (incluir) {
        salvo = await adicionarProduto(produto);
      } else {
        salvo = await editarProduto(produto);
      }

      const dados = await carregarDados();
      return dados.produtos.find((item) => item.id === salvo.id);
    } catch (erro) {
      setErroApi(erro.message);
      return null;
    }
  }

  async function removerProduto(id) {
    try {
      await excluirProduto(id);
      await carregarDados();
      return true;
    } catch (erro) {
      setErroApi(erro.message);
      return false;
    }
  }

  async function gravarUnidade(unidade, incluir) {
    try {
      let salvo;
      if (incluir) {
        salvo = await adicionarUnidade(unidade);
      } else {
        salvo = await editarUnidade(unidade);
      }

      const dados = await carregarDados();
      return dados.unidades.find((item) => item.id === salvo.id);
    } catch (erro) {
      setErroApi(erro.message);
      return null;
    }
  }

  async function removerUnidade(id) {
    try {
      await excluirUnidade(id);
      await carregarDados();
      return true;
    } catch (erro) {
      setErroApi(erro.message);
      return false;
    }
  }

  async function alterarStatus(pedidoId, status) {
    try {
      await atualizarStatusPedido(pedidoId, status);
      await carregarDados();
    } catch (erro) {
      setErroApi(erro.message);
    }
  }

  function irParaSecao(secao) {
    window.location.hash = secao;
    document.querySelector(secao)?.scrollIntoView();
  }

  function voltarParaPrincipal(secao) {
    setTelaAlimentacao(false);
    setTelaCadastro(false);
    setFilmeCompra(null);
    setTimeout(() => irParaSecao(secao), 0);
  }

  return {
    dataEscolhida, datas, erroApi, estados, cidades, filmes, filmeCompra,
    ingressos, logs, loginAberto, produtos, salas, telaAlimentacao, telaCadastro,
    telaFuncionario, unidadeEscolhida, unidadeEscolhidaId, unidades, usuarioLogado,
    usuario, cadastrarNovoUsuario, entrar, sair, carregarDados, irParaSecao,
    gravarFilme, removerFilme, gravarProduto, removerProduto,
    gravarUnidade, removerUnidade, alterarStatus, registrarIngresso,
    setDataEscolhida, setFilmeCompra, setLoginAberto, setTelaAlimentacao,
    setTelaCadastro, setTelaFuncionario, setUnidadeEscolhidaId,
    voltarParaPrincipal
  };
}
