import { CheckCircle2, ClipboardList } from "lucide-react";

function formatarData(valor) {
  if (!valor) return { dia: "--", hora: "--", original: "" };
  const temFuso = /(Z|[+-]\d{2}:\d{2})$/i.test(valor);
  const original = temFuso ? valor : valor + "Z";
  const data = new Date(original);
  if (Number.isNaN(data.getTime())) return { dia: "--", hora: "--", original: "" };
  return {
    dia: data.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" }),
    hora: data.toLocaleTimeString("pt-BR", { timeZone: "America/Sao_Paulo" }),
    original
  };
}

export default function TelaLogs({ logs }) {
  return <main className="func-conteudo coluna-unica">
    <section className="func-painel painel-logs">
      <div className="titulo-logs">
        <h1><ClipboardList size={24} /> Logs dos CineJoyfuls</h1>
        <span>{logs.length} {logs.length === 1 ? "registro" : "registros"}</span>
      </div>
      {logs.length === 0 ? (
        <p className="logs-vazios">Nenhuma atividade registrada.</p>
      ) : (
        <div className="logs-lista">
          <table className="tabela-logs" aria-label="Atividades dos funcionários">
            <thead><tr>
              <th scope="col">Funcionário</th>
              <th scope="col">Atividade</th>
              <th scope="col">Situação</th>
              <th scope="col">Data e hora <small>Brasília</small></th>
            </tr></thead>
            <tbody>{logs.map((log) => {
              const data = formatarData(log.data);
              return <tr key={log.id}>
                <td data-label="Funcionário">{log.funcionario}</td>
                <td data-label="Atividade">{log.tarefa}</td>
                <td data-label="Situação"><span className="situacao-log">
                  {log.status === "Concluido" && <CheckCircle2 size={16} />}{log.status === "Concluido" ? "Concluído" : log.status}
                </span></td>
                <td data-label="Data e hora"><time dateTime={data.original || undefined}>
                  <span>{data.dia}</span><small>{data.hora}</small>
                </time></td>
              </tr>;
            })}</tbody>
          </table>
        </div>
      )}
    </section>
  </main>;
}
