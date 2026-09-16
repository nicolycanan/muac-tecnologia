"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { db } from "@/src/db";
import { qrCodes } from "@/src/db/schema";
import { decrypt } from "@/src/lib/session";
import { cookies } from "next/headers";
import { randomBytes } from "crypto";

const createQrSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres.").max(255),
  destinationType: z.enum(["google", "whatsapp", "url"]),
  destinationUrl: z.string().url("Insira uma URL válida (ex: https://...)."),
});

export async function createQrAction(
  prevState: Record<string, unknown> | null,
  formData: FormData
) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    return { error: "Sessão expirada. Faça login novamente." };
  }

  const rawData = {
    name: formData.get("name"),
    destinationType: formData.get("destinationType"),
    destinationUrl: formData.get("destinationUrl"),
  };

  const parsed = createQrSchema.safeParse(rawData);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message || "Dados inválidos.";
    return { error: firstError };
  }

  const { name, destinationType, destinationUrl } = parsed.data;

  let finalUrl = destinationUrl;
  if (destinationType === "whatsapp") {
    const cleanNumber = destinationUrl.replace(/\D/g, "");
    if (cleanNumber.length >= 10 && !destinationUrl.startsWith("http")) {
      finalUrl = `https://wa.me/${cleanNumber}`;
    }
  }

  const slug = randomBytes(3).toString("hex");

  try {
    await db.insert(qrCodes).values({
      userId: session.userId,
      name,
      slug,
      destinationType,
      destinationUrl: finalUrl,
      isActive: true,
    });
  } catch (error) {
    console.error("Erro ao criar QR Code:", error);
    return { error: "Erro interno ao salvar no banco de dados." };
  }

  redirect("/dashboard");
}