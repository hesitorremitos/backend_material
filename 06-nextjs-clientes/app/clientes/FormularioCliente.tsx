"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Camino A: Client Component -> POST /api/clientes
export default function FormularioCliente() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const datos = Object.fromEntries(new FormData(form));
    const res = await fetch("/api/clientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });
    if (!res.ok) {
      setError((await res.json()).error ?? "Error");
      return;
    }
    setError("");
    form.reset();
    router.refresh(); // vuelve a ejecutar el Server Component
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <input name="nombre" placeholder="Nombre" required />
      <input name="email" type="email" placeholder="Email" required />
      <input name="telefono" placeholder="Teléfono (opcional)" />
      <button type="submit">Crear (API)</button>
      {error && <p style={{ color: "crimson", width: "100%" }}>{error}</p>}
    </form>
  );
}
