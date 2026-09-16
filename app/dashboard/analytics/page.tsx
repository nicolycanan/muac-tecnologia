import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "../../../src/db";
import { qrCodes, scans } from "../../../src/db/schema";
import { eq, desc } from "drizzle-orm";
import { cookies } from "next/headers";
import { decrypt, deleteSession } from "../../../src/lib/session";
import Sidebar from "../Sidebar";

export default async function AnalyticsPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    redirect("/login");
  }

  // 1. Busca todos os QR codes do usuário logado
  const userQrCodes = await db
    .select()
    .from(qrCodes)
    .where(eq(qrCodes.userId, session.userId));

  const qrCodeIds = userQrCodes.map((qr) => qr.id);

  if (qrCodeIds.length === 0) {
    async function handleLogout() {
      "use server";
      await deleteSession();
      redirect("/login");
    }

    return (
      <div className="min-h-screen bg-[#0A0A0A] text-[#F8F8F6]">
        <Sidebar logoutAction={handleLogout} />
        <main className="max-w-4xl mx-auto p-6 pt-32 text-center">
          <h1 className="text-2xl font-bold mb-4">Nenhum dado analítico disponível</h1>
          <p className="text-zinc-500 mb-6">Cadastre ou ative QR codes para começar a visualizar relatórios.</p>
          <Link href="/dashboard" className="bg-[#FF5757] text-white px-5 py-2.5 rounded-xl font-bold">
            Voltar ao Dashboard
          </Link>
        </main>
      </div>
    );
  }

  // 2. Busca todos os scans de todas as placas do usuário
  const allScans = await db
    .select()
    .from(scans)
    .orderBy(desc(scans.scannedAt));

  const userScans = allScans.filter((s) => qrCodeIds.includes(s.qrCodeId));

  // 3. Filtros temporais (Últimos 7 dias e Últimos 30 dias)
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const scansLast7Days = userScans.filter((s) => new Date(s.scannedAt) >= sevenDaysAgo).length;
  const scansLast30Days = userScans.filter((s) => new Date(s.scannedAt) >= thirtyDaysAgo).length;
  const totalScans = userScans.length;

  // 4. Montagem do Ranking de Performance por Estabelecimento (QR Code)
  const qrScanCounts: Record<string, number> = {};
  userScans.forEach((s) => {
    qrScanCounts[s.qrCodeId] = (qrScanCounts[s.qrCodeId] || 0) + 1;
  });

  const ranking = userQrCodes
    .map((qr) => ({
      ...qr,
      scanCount: qrScanCounts[qr.id] || 0,
    }))
    .sort((a, b) => b.scanCount - a.scanCount);

  async function handleLogout() {
    "use server";
    await deleteSession();
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F8F8F6]">
      {/* Sidebar / Menu Gaveta Responsivo */}
      <Sidebar logoutAction={handleLogout} />

      {/* Main Content com espaçamento superior limpo */}
      <main className="max-w-5xl mx-auto p-4 md:p-8 pt-24 space-y-8 w-full">
        <div>
          <h1 className="text-3xl font-bold">Relatórios e Performance</h1>
          <p className="text-zinc-500 text-sm mt-1">Acompanhe o engajamento temporal e o ranking dos estabelecimentos.</p>
        </div>

        {/* Métricas Temporais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6 shadow-xl">
            <p className="text-zinc-500 text-xs uppercase tracking-wider mb-2">Scans nos Últimos 7 Dias</p>
            <p className="text-4xl font-extrabold text-[#FF5757]">{scansLast7Days}</p>
            <span className="text-xs text-zinc-500 mt-2 block">Volume recente da semana</span>
          </div>

          <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6 shadow-xl">
            <p className="text-zinc-500 text-xs uppercase tracking-wider mb-2">Scans nos Últimos 30 Dias</p>
            <p className="text-4xl font-extrabold text-white">{scansLast30Days}</p>
            <span className="text-xs text-zinc-500 mt-2 block">Consolidado do último mês</span>
          </div>

          <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6 shadow-xl">
            <p className="text-zinc-500 text-xs uppercase tracking-wider mb-2">Total Histórico de Scans</p>
            <p className="text-4xl font-extrabold text-green-400">{totalScans}</p>
            <span className="text-xs text-zinc-500 mt-2 block">Desde a ativação das placas</span>
          </div>
        </div>

        {/* Ranking de Performance dos Estabelecimentos */}
        <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">Ranking de Performance</h2>
              <p className="text-zinc-500 text-sm">Estabelecimentos ordenados por volume de leituras</p>
            </div>
            <span className="text-xs bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full font-semibold">
              {userQrCodes.length} Placas Totais
            </span>
          </div>

          <div className="divide-y divide-white/5 bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
            {ranking.map((qr, index) => (
              <div key={qr.id} className="p-5 flex items-center justify-between hover:bg-zinc-900 transition">
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === 0 ? 'bg-amber-500 text-black' :
                    index === 1 ? 'bg-zinc-300 text-black' :
                    index === 2 ? 'bg-amber-700 text-white' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {index + 1}
                  </div>

                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white text-base">{qr.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold ${qr.isActive ? 'bg-green-500/10 text-green-400 border border-green-500/25' : 'bg-amber-500/10 text-amber-400 border border-amber-500/25'}`}>
                        {qr.isActive ? "Ativo" : "Em Estoque"}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Slug: <span className="text-zinc-400 font-mono">/q/{qr.slug}</span> • Tipo: <span className="uppercase text-zinc-400">{qr.destinationType}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-extrabold text-[#FF5757]">{qr.scanCount}</span>
                  <span className="text-[10px] text-zinc-500 uppercase block tracking-wider">Scans</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}