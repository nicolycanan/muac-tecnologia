"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { db } from "../../src/db";
import { users } from "../../src/db/schema";
import { eq } from "drizzle-orm";
import { createSession } from "../../src/lib/session";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido."),
  password: z.string().min(1, "A senha é obrigatória."),
});

export async function loginAction(prevState: any, formData: FormData) {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { error: "Por favor, preencha os dados corretamente." };
  }

  const { email, password } = parsed.data;

  try {
    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
      return { error: "Credenciais inválidas." };
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return { error: "Credenciais inválidas." };
    }

    // Cria o cookie de sessão seguro
    await createSession(user.id);
  } catch (error) {
    console.error("Erro no login:", error);
    return { error: "Ocorreu um erro ao tentar fazer login." };
  }

  // Redireciona para o painel se der tudo certo
  redirect("/dashboard");
}