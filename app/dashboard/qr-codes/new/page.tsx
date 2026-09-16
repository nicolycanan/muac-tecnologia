"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createQrAction } from "./actions";

export default function NewQrCodePage() {
  const [state, formAction, isPending] = useActionState(createQrAction, null);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F8F8F6]">
      {/* Header */}
      <header className="border-b border-white/10 bg-zinc-950 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black font-bold text-sm">
            M
          </div>
          <span className="font-bold tracking-tight">Novo QR Code</span>
        </div>

        <Link
          href="/dashboard"
          className="text-sm text-zinc-400 hover:text-white transition"
        >
          Voltar ao Dashboard
        </Link>
      </header>

      {/* Main Form */}
      <main className="max-w-xl mx-auto p-6 mt-10">
        <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8 shadow-xl">
          <h1 className="text-2xl font-bold mb-2">Criar Novo QR Code</h1>
          <p className="text-zinc-500 text-sm mb-8">
            Configure o destino da sua placa física. Você poderá alterá-lo quando quiser depois.
          </p>

          <form action={formAction} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2" htmlFor="name">
                Nome de Identificação (Ex: Restaurante - Mesa 01)
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Ex: Balcão Principal"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF5757] focus:ring-1 focus:ring-[#FF5757] transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2" htmlFor="destinationType">
                Tipo de Destino
              </label>
              <select
                id="destinationType"
                name="destinationType"
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF5757] focus:ring-1 focus:ring-[#FF5757] transition"
              >
                <option value="whatsapp">WhatsApp</option>
                <option value="google">Google (Avaliações / Local)</option>
                <option value="url">URL Personalizada (Site / Cardápio)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2" htmlFor="destinationUrl">
                URL de Destino ou Número do WhatsApp
              </label>
              <input
                id="destinationUrl"
                name="destinationUrl"
                type="text"
                required
                placeholder="https://wa.me/5511999999999 ou https://seusite.com"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF5757] focus:ring-1 focus:ring-[#FF5757] transition"
              />
              <p className="text-xs text-zinc-500 mt-2">
                Para WhatsApp, insira o link completo ou o número com DDD. Para outros, insira o link completo com https://.
              </p>
            </div>

            {state?.error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                {state.error}
              </div>
            )}

            <div className="flex items-center gap-4 pt-4">
              <Link
                href="/dashboard"
                className="w-1/2 text-center bg-zinc-800 text-zinc-300 px-4 py-3 rounded-xl font-bold hover:bg-zinc-700 transition"
              >
                Cancelar
              </Link>

              <button
                type="submit"
                disabled={isPending}
                className="w-1/2 bg-[#FF5757] text-white px-4 py-3 rounded-xl font-bold hover:brightness-110 transition disabled:opacity-50"
              >
                {isPending ? "Salvando..." : "Salvar QR Code"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}