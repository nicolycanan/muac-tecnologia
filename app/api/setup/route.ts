import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { qrCodes } from "@/src/db/schema";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers";
import { decrypt } from "@/src/lib/session";
type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    const session = await decrypt(sessionCookie);

    if (!session?.userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { name, destinationType, destinationUrl } = body;

    // Atualiza o QR code e marca isActive como true (ativando a placa automaticamente)
    const [updated] = await db
      .update(qrCodes)
      .set({
        name,
        destinationType,
        destinationUrl,
        isActive: true, // Ativa a placa ao preencher os dados reais
      })
      .where(and(eq(qrCodes.id, id), eq(qrCodes.userId, session.userId)))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "QR Code não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ success: true, updated });
  } catch (error) {
    console.error("Erro ao atualizar QR code:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}