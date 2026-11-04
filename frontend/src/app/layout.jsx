import "./globals.css";

export const metadata = {
  title: "CineJoy",
  description: "Site do cinema CineJoy"
};

export default function LayoutPrincipal({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
