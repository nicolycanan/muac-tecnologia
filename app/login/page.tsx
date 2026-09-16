"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F8F8F6] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-3xl p-8 shadow-2xl">
        <div className="flex justify-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white text-xl font-black text-black">
            M
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-2">Acesso Restrito</h1>
        <p className="text-zinc-500 text-sm text-center mb-8">
          Acesse o painel da MUAC Tecnologia.
        </p>

        <form action={formAction} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF5757] focus:ring-1 focus:ring-[#FF5757] transition"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF5757] focus:ring-1 focus:ring-[#FF5757] transition"
              placeholder="••••••••"
            />
          </div>

          {state?.error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#FF5757] text-white rounded-xl px-4 py-3 font-bold hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isPending ? "Verificando..." : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}