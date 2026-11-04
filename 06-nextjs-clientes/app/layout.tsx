import Link from "next/link";
import type { ReactNode } from "react";

export const metadata = { title: "Clientes — Next.js + Prisma" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body style={{ fontFamily: "system-ui, sans-serif", maxWidth: 800, margin: "0 auto", padding: 16 }}>
        <nav style={{ display: "flex", gap: 16, borderBottom: "1px solid #ddd", paddingBottom: 8 }}>
          <Link href="/">Inicio</Link>
          <Link href="/clientes">Clientes</Link>
          <a href="/api/clientes">API JSON</a>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
