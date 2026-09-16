import Link from "next/link";

type HeaderProps = {
  logoutAction: () => Promise<void>;
};

export default function Sidebar({ logoutAction }: HeaderProps) {
  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-white/10 px-4 md:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black font-extrabold text-sm shadow-sm">
          M
        </div>
        <span className="font-bold tracking-tight text-white text-sm md:text-base">MUAC Tecnologia</span>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/profile"
          className="text-xs text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl font-semibold transition"
        >
          👤 Perfil
        </Link>
        <Link
          href="/dashboard/analytics"
          className="text-xs text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl font-semibold transition hidden sm:inline-block"
        >
          📊 Analytics
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="text-xs text-red-400 hover:text-red-300 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-xl font-semibold transition cursor-pointer"
          >
            Sair
          </button>
        </form>
      </div>
    </header>
  );
}