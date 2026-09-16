import { redirect } from "next/navigation";
import { db } from "../../../src/db";
import { users } from "../../../src/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { decrypt } from "../../../src/lib/session";
import Sidebar from "../Sidebar";
import { deleteSession } from "../../../src/lib/session";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    redirect("/login");
  }

  // Busca os dados do usuário logado no banco
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.userId));

  async function handleLogout() {
    "use server";
    await deleteSession();
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F8F8F6] flex">
      {/* Sidebar Lateral */}
      <Sidebar logoutAction={handleLogout} />

      {/* Conteúdo Principal com margem à esquerda para acomodar a sidebar fixa no desktop */}
      <main className="flex-1 md:ml-64 p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Meu Perfil</h1>
          <p className="text-zinc-500 text-sm mt-1">Gerencie as informações da sua conta e credenciais de acesso.</p>
        </div>

        <div className="max-w-xl bg-zinc-900 border border-white/5 rounded-3xl p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-white/5">
            <div className="h-16 w-16 bg-[#FF5757] rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.email ? user.email.charAt(0).toUpperCase() : "A"}
            </div>
            <div>
              <h2 className="text-xl font-bold">Administrador MUAC</h2>
              <p className="text-zinc-500 text-sm">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1 font-semibold">E-mail de Acesso</label>
              <input
                type="email"
                disabled
                value={user?.email || ""}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-400 text-sm focus:outline-none cursor-not-allowed"
              />
              <span className="text-[11px] text-zinc-600 mt-1 block">O e-mail principal da conta é protegido por segurança.</span>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1 font-semibold">Tipo de Conta</label>
              <input
                type="text"
                disabled
                value="Administrador Master (SaaS)"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-400 text-sm focus:outline-none cursor-not-allowed"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/5">
            <p className="text-xs text-zinc-500">
              Sistema operando com criptografia segura em ambiente PostgreSQL e Drizzle ORM.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}