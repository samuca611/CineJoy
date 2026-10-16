import { UserRound } from "lucide-react";

export default function BotaoUsuario({ abrirConta }) {
  return (
    <button className="floating-user" type="button" aria-label="Abrir conta" title="Abrir conta" onClick={abrirConta}>
      <UserRound size={20} />
    </button>
  );
}
