"use client";

import { useState } from "react";

type EditQrFormProps = {
  qrId: string;
  initialName: string;
  initialType: string;
  initialUrl: string;
  initialIsActive: boolean;
  publicUrl: string;
  qrCodeImageUrl: string;
  fileName: string;
  downloadButton: React.ReactNode;
  qrScansCount: number;
  recentScans: Array<{ id: string; deviceType: string | null; scannedAt: Date }>;
};

export default function EditQrForm({
  qrId,
  initialName,
  initialType,
  initialUrl,
  initialIsActive,
  publicUrl,
  qrCodeImageUrl,
  fileName,
  downloadButton,
  qrScansCount,
  recentScans,
}: EditQrFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const [destinationType, setDestinationType] = useState(initialType);
  const [destinationUrl, setDestinationUrl] = useState(initialUrl);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/qr-codes/${qrId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, destinationType, destinationUrl }),
      });

      if (res.ok) {
        window.location.reload();
      } else {
        alert("Erro ao atualizar o QR code.");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 w-full">
      {/* Card Principal */}
      <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8 shadow-xl text-center flex flex-col items-center relative">
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-6 right-6 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs px-3.5 py-2 rounded-xl font-semibold transition cursor-pointer"
          >
            ✏️ Editar / Ativar Placa
          </button>
        )}

        <div className="w-full flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-left">{name}</h1>
          <span
            className={`text-xs px-3 py-1 rounded-full uppercase tracking-wider font-semibold ${
              initialIsActive
                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
            }`}
          >
            {initialIsActive ? "Ativo" : "Em Estoque (Não Ativado)"}
          </span>
        </div>

        {/* QR Code Visual Box */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-6 inline-block">
          <img src={qrCodeImageUrl} alt={`QR Code para ${name}`} className="w-48 h-48 object-contain" />
        </div>

        {/* MODO DE EDIÇÃO ATIVO */}
        {isEditing ? (
          <form onSubmit={handleUpdate} className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-6 text-left space-y-4 mb-6">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-900">
              <span className="text-sm font-bold text-white">Configurar Placa Física</span>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-zinc-400 hover:text-white bg-zinc-900 px-2.5 py-1 rounded-lg text-xs font-bold"
              >
                ✕ Fechar (X)
              </button>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1">Nome do Estabelecimento</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF5757]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1">Tipo de Destino</label>
              <select
                value={destinationType}
                onChange={(e) => setDestinationType(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF5757]"
              >
                <option value="whatsapp">WhatsApp</option>
                <option value="google">Google (Avaliações / Local)</option>
                <option value="url">URL Personalizada</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1">Link ou WhatsApp de Destino</label>
              <input
                type="text"
                value={destinationUrl}
                onChange={(e) => setDestinationUrl(e.target.value)}
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF5757]"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#FF5757] text-white py-2.5 rounded-xl font-bold text-sm hover:brightness-110 transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Salvando..." : "Salvar Alterações"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-zinc-800 text-zinc-300 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-700 transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 mb-6 text-left space-y-2">
            <div>
              <span className="text-xs text-zinc-500 uppercase tracking-wider block">URL Pública da Placa</span>
              <span className="text-sm font-mono text-zinc-300 break-all">{publicUrl}</span>
            </div>
            <div className="pt-2 border-t border-zinc-900">
              <span className="text-xs text-zinc-500 uppercase tracking-wider block">Destino Atual ({destinationType})</span>
              <span className="text-sm text-[#FF5757] font-medium break-all">{destinationUrl}</span>
            </div>
          </div>
        )}

        <div className="w-full flex flex-col sm:flex-row gap-3">
          {downloadButton}
          <a
            href="/dashboard"
            className="flex-1 bg-zinc-800 text-zinc-300 px-4 py-3 rounded-xl font-bold hover:bg-zinc-700 transition text-center flex items-center justify-center"
          >
            Voltar ao Dashboard
          </a>
        </div>
      </div>

      {/* Analytics Básico */}
      <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Analytics de Acessos</h2>
          <div className="text-right">
            <span className="text-xs text-zinc-500 block uppercase tracking-wider">Total de Scans</span>
            <span className="text-2xl font-bold text-[#FF5757]">{qrScansCount}</span>
          </div>
        </div>

        {recentScans.length === 0 ? (
          <div className="text-center py-8 text-zinc-500 text-sm border border-dashed border-zinc-800 rounded-2xl">
            Nenhum acesso registrado ainda. Escaneie o QR code para testar!
          </div>
        ) : (
          <div className="space-y-3">
            <span className="text-xs text-zinc-500 uppercase tracking-wider block mb-2">Últimos Acessos</span>
            <div className="divide-y divide-white/5 bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
              {recentScans.map((scan) => (
                <div key={scan.id} className="p-4 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-[#FF5757]" />
                    <span className="text-zinc-300 uppercase text-xs font-semibold px-2 py-0.5 bg-zinc-900 rounded border border-zinc-800">
                      {scan.deviceType || "desconhecido"}
                    </span>
                  </div>
                  <span className="text-zinc-500 text-xs">
                    {new Date(scan.scannedAt).toLocaleString("pt-BR", {
                      dateStyle: "short",
                      timeStyle: "medium",
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}