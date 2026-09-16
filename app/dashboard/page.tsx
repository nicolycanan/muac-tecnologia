import { redirect } from "next/navigation";
import Link from "next/link";
import { deleteSession } from "../../src/lib/session";
import { db } from "../../src/db";
import { qrCodes, scans } from "../../src/db/schema";
import { eq, desc } from "drizzle-orm";
import { cookies } from "next/headers";
import { decrypt } from "../../src/lib/session";
import { randomBytes } from "crypto";
import Sidebar from "./Sidebar";
import QrCodeList from "./QrCodeList"; // Componente client para busca em tempo real

type PageProps = {
  searchParams: Promise<{ search?: string }>;
};

export default async function DashboardPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const initialSearch = resolvedSearchParams.search || "";

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    redirect("/login");
  }

  // Server Action para gerar lote flexível de placas (1 a 50)
  async function generateBatchAction(formData: FormData) {
    "use server";
    const rawCount = parseInt(formData.get("count") as string) || 10;
    const count = Math.min(Math.max(rawCount, 1), 50);
    
    const currentSessionCookie = (await cookies()).get("session")?.value;
    const currentSession = await decrypt(currentSessionCookie);

    if (!currentSession?.userId) return;

    for (let i = 0; i < count; i++) {
      const batchSlug = `muac-${randomBytes(3).toString("hex")}`;
      await db.insert(qrCodes).values({
        userId: currentSession.userId,
        name: `Placa Em Estoque (${batchSlug})`,
        slug: batchSlug,
        destinationType: "url",
        destinationUrl: "https://muactechnology.com.br",
        isActive: false,
      });
    }

    redirect("/dashboard");
  }

  // Busca todos os QR codes do usuário logado
  const userQrCodes = await db
    .select()
    .from(qrCodes)
    .where(eq(qrCodes.userId, session.userId))
    .orderBy(desc(qrCodes.createdAt));

  const totalQrCodes = userQrCodes.length;
  const activeQrCodes = userQrCodes.filter((qr) => qr.isActive).length;
  const stockQrCodes = totalQrCodes - activeQrCodes;

  // Estatísticas globais de scans
  const qrCodeIds = userQrCodes.map((qr) => qr.id);
  let totalScansCount = 0;
  let uniquePlatesScannedCount = 0;

  if (qrCodeIds.length > 0) {
    const allScans = await db
      .select({
        id: scans.id,
        qrCodeId: scans.qrCodeId,
      })
      .from(scans);

    const userScans = allScans.filter((s) => qrCodeIds.includes(s.qrCodeId));
    totalScansCount = userScans.length;

    const distinctScannedIds = new Set(userScans.map((s) => s.qrCodeId));
    uniquePlatesScannedCount = distinctScannedIds.size;
  }

  async function handleLogout() {
    "use server";
    await deleteSession();
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F8F8F6]">
      {/* Header Limpo */}
      <Sidebar logoutAction={handleLogout} />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-4 md:p-8 pt-28 space-y-8 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Olá, Administrador</h1>
            <p className="text-zinc-500 text-sm mt-1">Gerencie seu parque de placas inteligentes e operações.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Botão de Ativação por Câmera / Atalho */}
            <Link
              href="/dashboard/scan-activate"
              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 px-4 py-2.5 rounded-2xl font-semibold text-xs transition flex items-center gap-2 active:scale-95"
            >
              <span className="text-base">📷</span>
              <span>Escanear Placa</span>
            </Link>

            {/* Geração de Lotes */}
            <form action={generateBatchAction} className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-1.5 rounded-2xl">
              <input
                type="number"
                name="count"
                defaultValue={10}
                min={1}
                max={50}
                title="Quantidade de placas (1 a 50)"
                className="w-14 bg-zinc-950 text-white text-center text-xs font-bold rounded-lg py-2 border border-zinc-800 focus:outline-none focus:border-[#FF5757]"
              />
              <button
                type="submit"
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Gerar Lote
              </button>
            </form>

            <Link
              href="/dashboard/qr-codes/new"
              className="bg-[#FF5757] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:brightness-110 transition flex items-center gap-2"
            >
              <span>+ Novo QR Code</span>
            </Link>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-zinc-900 border border-white/5 rounded-2xl p-5 shadow-sm">
            <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Total de Placas</p>
            <p className="text-3xl font-bold">{totalQrCodes}</p>
          </div>
          <div className="bg-zinc-900 border border-white/5 rounded-2xl p-5 shadow-sm">
            <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Placas Ativas</p>
            <p className="text-3xl font-bold text-green-400">{activeQrCodes}</p>
          </div>
          <div className="bg-zinc-900 border border-white/5 rounded-2xl p-5 shadow-sm">
            <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Em Estoque</p>
            <p className="text-3xl font-bold text-amber-400">{stockQrCodes}</p>
          </div>
          <div className="bg-zinc-900 border border-white/5 rounded-2xl p-5 shadow-sm">
            <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Total de Scans</p>
            <p className="text-3xl font-bold text-[#FF5757]">{totalScansCount}</p>
            <span className="text-[10px] text-zinc-500 mt-1 block">
              {uniquePlatesScannedCount} placas diferentes já lidas
            </span>
          </div>
        </div>

        {/* Lista com Pesquisa em Tempo Real (Client Component) */}
        <QrCodeList qrCodes={userQrCodes} initialSearch={initialSearch} />
      </main>
    </div>
  );
}