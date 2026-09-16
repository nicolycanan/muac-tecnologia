import { redirect } from "next/navigation";
import { db } from "../../../src/db";
import { qrCodes, scans } from "../../../src/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import crypto from "crypto";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function DynamicRedirectPage({ params }: PageProps) {
  const { slug } = await params;

  // 1. Busca o QR Code no banco de dados pelo slug único
  const [qr] = await db
    .select()
    .from(qrCodes)
    .where(eq(qrCodes.slug, slug));

  // Se o QR Code não existir, exibe uma tela amigável sem expor dados internos
  if (!qr) {
    return (
      <main className="min-h-screen bg-[#0A0A0A] text-[#F8F8F6] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-3xl p-8 text-center shadow-2xl">
          <div className="text-4xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold mb-2">QR Code não encontrado</h1>
          <p className="text-zinc-500 text-sm">
            Este código não está cadastrado ou foi removido da plataforma MUAC Tecnologia.
          </p>
        </div>
      </main>
    );
  }

  // Se o QR Code estiver desativado pelo lojista
  if (!qr.isActive) {
    return (
      <main className="min-h-screen bg-[#0A0A0A] text-[#F8F8F6] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-3xl p-8 text-center shadow-2xl">
          <div className="text-4xl mb-4">⏳</div>
          <h1 className="text-2xl font-bold mb-2">Indisponível temporariamente</h1>
          <p className="text-zinc-500 text-sm">
            Este QR Code está temporariamente desativado pelo estabelecimento.
          </p>
        </div>
      </main>
    );
  }

  // Coleta dados para registrar o scan de forma anônima e segura (Fase 10)
  try {
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "";
    const ip = headersList.get("x-forwarded-for") || "unknown";

    // Cria um hash do IP para privacidade (nunca salvamos o IP puro)
    const ipHash = crypto.createHash("sha256").update(ip).digest("hex");

    // Identificação básica do tipo de dispositivo pelo User-Agent
    let deviceType = "desktop";
    if (/android/i.test(userAgent)) {
      deviceType = "android";
    } else if (/iphone|ipad|ipod/i.test(userAgent)) {
      deviceType = "ios";
    }

    // Registra o scan no banco de dados de forma assíncrona (não trava o redirect)
    await db.insert(scans).values({
      qrCodeId: qr.id,
      userAgent,
      deviceType,
      ipHash,
    });
  } catch (error) {
    console.error("Erro ao registrar scan:", error);
    // O erro no scan nunca deve impedir o cliente de ser redirecionado
  }

  // Redireciona imediatamente para o destino atual cadastrado
  redirect(qr.destinationUrl);
}