"use client";

import { useRouter } from "next/navigation";

// Editar (PATCH) y eliminar (DELETE) vía API — Camino A
export default function AccionesCliente({ id, nombre }: { id: string; nombre: string }) {
  const router = useRouter();

  async function editar() {
    const nuevo = prompt("Nuevo nombre:", nombre);
    if (!nuevo) return;
    await fetch(`/api/clientes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre: nuevo }),
    });
    router.refresh();
  }

  async function eliminar() {
    if (!confirm(`¿Eliminar a ${nombre}?`)) return;
    await fetch(`/api/clientes/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <>
      <button onClick={editar}>Editar</button> <button onClick={eliminar}>Eliminar</button>
    </>
  );
}
