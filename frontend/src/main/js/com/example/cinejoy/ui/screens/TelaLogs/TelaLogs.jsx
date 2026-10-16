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
  return <main className="func-main single">
    <section className="func-panel logs-panel">
      <div className="logs-heading">
        <h1><ClipboardList size={24} /> Logs dos CineJoyfuls</h1>
        <span>{logs.length} {logs.length === 1 ? "registro" : "registros"}</span>
      </div>
      {logs.length === 0 ? (
        <p className="logs-empty">Nenhuma atividade registrada.</p>
      ) : (
        <div className="logs-lista">
          <table className="logs-table" aria-label="Atividades dos funcionarios">
            <thead><tr>
              <th scope="col">Funcionario</th>
              <th scope="col">Atividade</th>
              <th scope="col">Situacao</th>
              <th scope="col">Data e hora <small>Brasilia</small></th>
            </tr></thead>
            <tbody>{logs.map((log) => {
              const data = formatarData(log.data);
              return <tr key={log.id}>
                <td data-label="Funcionario">{log.funcionario}</td>
                <td data-label="Atividade">{log.tarefa}</td>
                <td data-label="Situacao"><span className="log-status">
                  {log.status === "Concluido" && <CheckCircle2 size={16} />}{log.status}
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
