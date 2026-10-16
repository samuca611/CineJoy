import { useEffect, useState } from "react";
import {
  adicionarFilme, adicionarProduto, adicionarUnidade, buscarDadosDaHome,
  buscarLocalidades, cadastrarUsuario, comprarIngresso, editarFilme,
  editarProduto, editarUnidade, excluirFilme, excluirProduto, excluirUnidade,
  loginUsuario, sairDaConta, buscarSalas, atualizarStatusPedido
} from "../data/api/api.js";
import { pegarDatas } from "../data/model/datas.js";
import { useNavegacao } from "./useNavegacao.js";

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
  const [usuario, setUsuario] = useState(null);
  const navegacao = useNavegacao(usuario);
  const datas = pegarDatas(filmes, unidadeEscolhidaId);
  const usuarioLogado = usuario?.nome || "";
  const unidadeEscolhida = unidades.find((u) => String(u.id) === String(unidadeEscolhidaId)) || unidades[0] || null;

  useEffect(() => {
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
    navegacao.setLoginAberto(false);
    if (conta.papel === "Funcionario") {
      navegacao.abrirTela("funcionario");
    } else if (navegacao.tela === "cadastro") {
      navegacao.voltarParaPrincipal();
    }
    await carregarDados();
  }

  async function sair() {
    try {
      await sairDaConta();
      setUsuario(null);
      navegacao.setLoginAberto(false);
      navegacao.voltarParaPrincipal();
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
      navegacao.setLoginAberto(false);
      navegacao.voltarParaPrincipal();
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

  function atualizarConta(conta) {
    setUsuario((atual) => atual && atual.id === conta.id ? { ...atual, nome: conta.nome } : atual);
  }

  function pedirNovoLogin() {
    setUsuario(null);
    navegacao.abrirTela("inicio");
    navegacao.setLoginAberto(true);
    setErroApi("Sua sessão expirou. Entre novamente.");
  }

  return {
    ...navegacao,
    dataEscolhida, datas, erroApi, estados, cidades, filmes,
    ingressos, logs, produtos, salas,
    unidadeEscolhida, unidadeEscolhidaId, unidades, usuarioLogado,
    usuario, cadastrarNovoUsuario, entrar, sair, carregarDados,
    gravarFilme, removerFilme, gravarProduto, removerProduto,
    gravarUnidade, removerUnidade, alterarStatus, registrarIngresso,
    setDataEscolhida, setUnidadeEscolhidaId, atualizarConta, pedirNovoLogin
  };
}
