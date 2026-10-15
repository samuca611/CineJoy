export function pegarDatas(filmes, unidadeId) {
  const datas = [];
  for (const filme of filmes) {
    for (const sessao of filme.sessoes || []) {
      const mesmaUnidade = String(sessao.unidadeId) === String(unidadeId);
      if (mesmaUnidade && !datas.includes(sessao.data)) {
        datas.push(sessao.data);
      }
    }
  }
  return datas.sort((a, b) => converterData(a) - converterData(b));
}

export function converterData(texto) {
  const [dia, mes, ano] = texto.split("/").map(Number);
  return new Date(ano || new Date().getFullYear(), mes - 1, dia);
}
