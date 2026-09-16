"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Html5QrcodeScanner } from "html5-qrcode";
import Sidebar from "../Sidebar";
import Link from "next/link";

export default function ScanActivatePage() {
  const router = useRouter();
  const [manualSlug, setManualSlug] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 220, height: 220 },
      },
      false
    );

    scanner.render(
      (decodedText) => {
        try {
          const url = new URL(decodedText);
          const pathSegments = url.pathname.split("/");
          const slug = pathSegments[pathSegments.length - 1];
          if (slug) {
            scanner.clear();
            router.push(`/dashboard?search=${slug}`);
          }
        } catch {
          if (decodedText.includes("muac-") || decodedText.length > 0) {
            const parts = decodedText.split("/");
            const slug = parts[parts.length - 1];
            scanner.clear();
            router.push(`/dashboard?search=${slug}`);
          } else {
            setErrorMsg("Código inválido.");
          }
        }
      },
      (error) => {
        console.debug(error);
      }
    );

    return () => {
      scanner.clear().catch((err) => console.error(err));
    };
  }, [router]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualSlug.trim()) return;
    const cleanSlug = manualSlug.trim().replace("/q/", "").replace("http://", "").replace("https://", "");
    const parts = cleanSlug.split("/");
    const slug = parts[parts.length - 1];
    router.push(`/dashboard?search=${slug}`);
  };

  async function handleLogoutClient() {
    window.location.href = "/login";
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F8F8F6]">
      <Sidebar logoutAction={handleLogoutClient} />

      <main className="max-w-md mx-auto p-4 md:p-8 pt-28 space-y-6 w-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Ativação em Campo</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Aponte a câmera para o QR code ou digite o código da placa.
          </p>
        </div>

        {/* Visor da Câmera */}
        <div className="bg-zinc-900 border border-white/5 rel p-5 rounded-3xl shadow-xl space-y-4">
          <div id="reader" className="w-full overflow-hidden rounded-2xl bg-zinc-950 text-xs text-zinc-400" />

          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-center">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Entrada Manual Alternativa (Caso o navegador bloqueie a câmera por IP local) */}
        <div className="bg-zinc-900 border border-white/5 p-6 rounded-3xl shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-zinc-300">Busca Rápida por Código / Slug</h2>
          <form onSubmit={handleManualSubmit} className="space-y-3">
            <input
              type="text"
              value={manualSlug}
              onChange={(e) => setManualSlug(e.target.value)}
              placeholder="Ex: muac-58a084"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF5757]"
            />
            <button
              type="submit"
              className="w-full bg-[#FF5757] text-white py-3 rounded-xl font-bold text-sm hover:brightness-110 transition cursor-pointer"
            >
              Localizar e Ativar Placa
            </button>
          </form>
        </div>

        <div className="text-center">
          <Link href="/dashboard" className="text-xs text-zinc-400 hover:text-white underline">
            Voltar para o Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}