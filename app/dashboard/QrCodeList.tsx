"use client";

import { useState } from "react";
import Link from "next/link";

type QrCodeItem = {
  id: string;
  name: string;
  slug: string;
  destinationType: string;
  isActive: boolean;
};

type QrCodeListProps = {
  qrCodes: QrCodeItem[];
  initialSearch: string;
};

export default function QrCodeList({ qrCodes, initialSearch }: QrCodeListProps) {
  const [search, setSearch] = useState(initialSearch);

  // Filtra em tempo real conforme o usuário digita
  const filtered = qrCodes.filter(
    (qr) =>
      qr.name.toLowerCase().includes(search.toLowerCase()) ||
      qr.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
      {/* Header do Container com Barra de Pesquisa Instantânea */}
      <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-lg font-bold">Placas e QR Codes Cadastrados</h2>
        
        <div className="w-full sm:w-72 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar por nome ou slug..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF5757] transition"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>
      
      {/* Corpo com Frame Fixo e Rolagem Interna */}
      <div className="max-h-[480px] overflow-y-auto divide-y divide-white/5">
        {qrCodes.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="h-16 w-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-lg font-bold mb-2">Você ainda não possui QR Codes.</h3>
            <p className="text-zinc-500 text-sm max-w-sm mb-6">
              Gere um lote para enviar à gráfica ou crie seu primeiro QR code personalizado.
            </p>
            <Link
              href="/dashboard/qr-codes/new"
              className="bg-[#FF5757] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:brightness-110 transition inline-block"
            >
              Criar QR Code
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 text-sm">
            Nenhum resultado encontrado para &quot;{search}&quot;.
          </div>
        ) : (
          filtered.map((qr) => (
            <div key={qr.id} className="p-5 flex items-center justify-between hover:bg-zinc-850/50 transition">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-bold text-base text-white">{qr.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold ${qr.isActive ? 'bg-green-500/10 text-green-400 border border-green-500/25' : 'bg-amber-500/10 text-amber-400 border border-amber-500/25'}`}>
                    {qr.isActive ? "Ativo" : "Em Estoque"}
                  </span>
                </div>
                
                <p className="text-xs text-zinc-500">
                  Slug: <span className="text-zinc-300 font-mono">/q/{qr.slug}</span> • Tipo: <span className="text-zinc-300 uppercase">{qr.destinationType}</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={`/dashboard/qr-codes/${qr.id}`}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3.5 py-2 rounded-xl text-xs font-semibold transition"
                >
                  Gerenciar / Ativar
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}