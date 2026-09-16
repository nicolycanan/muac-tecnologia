const whatsappNumber = "5500000000000";

const whatsappMessage = encodeURIComponent(
  "Olá! Quero conhecer as soluções da Muac Tecnologia."
);

const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F8F8F6]">
      {/* HEADER */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#0A0A0A]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <a
            href="#"
            className="flex items-center gap-3"
            aria-label="Muac Tecnologia - início"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white text-sm font-black text-black">
              M
            </div>

            <div className="leading-none">
              <span className="block text-lg font-bold tracking-tight">
                muac
              </span>

              <span className="mt-1 block text-[9px] font-medium uppercase tracking-[0.25em] text-zinc-500">
                tecnologia
              </span>
            </div>
          </a>

          <nav
            className="hidden items-center gap-8 md:flex"
            aria-label="Navegação principal"
          >
            <a
              href="#solucoes"
              className="text-sm text-zinc-400 transition hover:text-white"
            >
              Soluções
            </a>

            <a
              href="#como-funciona"
              className="text-sm text-zinc-400 transition hover:text-white"
            >
              Como funciona
            </a>

            <a
              href="#para-quem"
              className="text-sm text-zinc-400 transition hover:text-white"
            >
              Para quem é
            </a>

            <a
              href="#faq"
              className="text-sm text-zinc-400 transition hover:text-white"
            >
              FAQ
            </a>
          </nav>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            Falar com a Muac
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden pt-20">
        {/* Grid de fundo */}
        <div
          className="absolute inset-0 opacity-100"
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(255,255,255,0.035) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(255,255,255,0.035) 1px,
                transparent 1px
              )
            `,
            backgroundSize: "48px 48px",
          }}
        />

        {/* Glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF5757]/10 blur-[140px]" />
        </div>

        <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl items-center px-6 py-20 lg:px-8">
          <div className="grid w-full items-center gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            {/* HERO TEXTO */}
            <div>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF5757]" />

                <span className="text-xs font-medium tracking-wide text-zinc-300">
                  Tecnologia para negócios locais
                </span>
              </div>

              <h1 className="max-w-3xl text-5xl font-bold leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                Seu negócio local{" "}
                <span className="text-zinc-500">
                  também pode ser digital.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-8 text-zinc-400 sm:text-xl">
                A Muac Tecnologia transforma pontos de contato do seu negócio
                em experiências digitais simples, profissionais e fáceis de
                usar.
              </p>

              <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-500">
                QR + NFC, Google, WhatsApp, sites, cardápios digitais e
                automações — soluções pensadas para quem atende clientes todos
                os dias.
              </p>

              {/* BOTÕES */}
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#FF5757] px-6 py-3.5 text-sm font-bold text-white transition hover:brightness-110"
                >
                  Pedir minha placa

                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="transition-transform group-hover:translate-x-1"
                  >
                    <path
                      d="M5 12H19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />

                    <path
                      d="M13 6L19 12L13 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>

                <a
                  href="#solucoes"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
                >
                  Conhecer soluções
                </a>
              </div>

              {/* BENEFÍCIOS */}
              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-zinc-500">
                <span className="flex items-center gap-2">
                  <span className="text-[#FF5757]">✓</span>
                  Soluções sob medida
                </span>

                <span className="flex items-center gap-2">
                  <span className="text-[#FF5757]">✓</span>
                  Atendimento direto
                </span>

                <span className="flex items-center gap-2">
                  <span className="text-[#FF5757]">✓</span>
                  Foco em negócios locais
                </span>
              </div>
            </div>

            {/* MOCKUP DA PLACA */}
            <div className="relative flex items-center justify-center">
              <div className="absolute h-80 w-80 rounded-full bg-[#FF5757]/10 blur-3xl" />

              <div className="relative w-full max-w-md">
                {/* TAG */}
                <div className="absolute -top-5 left-6 z-10 rounded-full border border-white/10 bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-300 shadow-2xl">
                  Produto de entrada
                </div>

                {/* CARD */}
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 p-5 shadow-2xl shadow-black/50">
                  <div className="flex min-h-[420px] flex-col items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
                    {/* TOPO */}
                    <div className="w-full">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
                          muac
                        </span>

                        <span className="rounded-full border border-zinc-700 px-3 py-1 text-[10px] uppercase tracking-widest text-zinc-500">
                          QR + NFC
                        </span>
                      </div>
                    </div>

                    {/* QR */}
                    <div className="flex flex-col items-center">
                      <div className="flex h-48 w-48 items-center justify-center rounded-2xl bg-white p-4">
                        <div className="grid h-full w-full grid-cols-7 gap-1">
                          <div className="col-span-2 row-span-2 bg-black" />
                          <div className="bg-white" />
                          <div className="bg-black" />
                          <div className="bg-black" />
                          <div className="bg-white" />
                          <div className="bg-black" />
                          <div className="col-span-2 row-span-2 bg-black" />

                          <div className="bg-black" />
                          <div className="bg-white" />
                          <div className="bg-black" />
                          <div className="bg-black" />
                          <div className="bg-white" />
                          <div className="bg-black" />
                          <div className="bg-black" />

                          <div className="bg-white" />
                          <div className="bg-black" />
                          <div className="bg-black" />
                          <div className="bg-white" />
                          <div className="bg-black" />
                          <div className="bg-black" />
                          <div className="bg-white" />

                          <div className="bg-black" />
                          <div className="bg-white" />
                          <div className="bg-black" />
                          <div className="bg-black" />
                          <div className="bg-white" />
                          <div className="bg-black" />
                          <div className="bg-black" />

                          <div className="bg-white" />
                          <div className="bg-black" />
                          <div className="bg-black" />
                          <div className="bg-white" />
                          <div className="bg-black" />
                          <div className="bg-white" />
                          <div className="bg-black" />

                          <div className="bg-black" />
                          <div className="bg-white" />
                          <div className="bg-black" />
                          <div className="bg-black" />
                          <div className="bg-white" />
                          <div className="bg-black" />
                          <div className="bg-black" />

                          <div className="col-span-2 row-span-2 bg-black" />
                          <div className="bg-white" />
                          <div className="bg-black" />
                          <div className="bg-black" />
                          <div className="bg-white" />
                        </div>
                      </div>

                      <p className="mt-5 text-center text-sm font-semibold text-white">
                        Avalie ou conheça nosso negócio
                      </p>

                      <p className="mt-1 text-center text-xs text-zinc-500">
                        Aponte a câmera ou aproxime seu celular
                      </p>
                    </div>

                    {/* RODAPÉ DA PLACA */}
                    <div className="flex w-full items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-zinc-600">
                          tecnologia
                        </p>

                        <p className="mt-1 text-xs text-zinc-500">
                          QR Code + NFC
                        </p>
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-700">
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7 7H10V10H7V7Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />

                          <path
                            d="M14 7H17V10H14V7Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />

                          <path
                            d="M7 14H10V17H7V14Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />

                          <path
                            d="M14 14H15.5V15.5H14V14Z"
                            fill="currentColor"
                          />

                          <path
                            d="M17 14H18V18H14V17H17V14Z"
                            fill="currentColor"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* INFORMAÇÕES DO PRODUTO */}
                  <div className="flex items-end justify-between px-2 pb-1 pt-5">
                    <div>
                      <p className="text-xs text-zinc-500">
                        Placa Inteligente
                      </p>

                      <p className="mt-1 text-sm font-semibold text-white">
                        QR + NFC
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-zinc-500">
                        a partir de
                      </p>

                      <p className="text-xl font-bold text-white">
                        R$ 79,90
                      </p>
                    </div>
                  </div>
                </div>

                {/* CARD FLUTUANTE */}
                <div className="absolute -bottom-7 -left-7 hidden rounded-2xl border border-white/10 bg-zinc-900/95 p-4 shadow-xl backdrop-blur-md sm:block">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF5757]/10 text-[#FF5757]">
                      ★
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-white">
                        Mais avaliações reais
                      </p>

                      <p className="mt-1 text-[11px] text-zinc-500">
                        Facilite o próximo passo do cliente
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* INDICADOR */}
        <div className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-zinc-600 sm:flex">
          <span className="text-[9px] uppercase tracking-[0.3em]">
            explorar
          </span>

          <span className="h-8 w-px bg-gradient-to-b from-zinc-600 to-transparent" />
        </div>
      </section>

      {/* SOLUÇÕES */}
      <section
        id="solucoes"
        className="border-t border-white/10 bg-[#0A0A0A] px-6 py-32"
      >
        <div className="mx-auto max-w-7xl">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#FF5757]">
            Soluções
          </span>

          <h2 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
            Tecnologia que acompanha o crescimento do seu negócio.
          </h2>

          <p className="mt-6 max-w-2xl text-zinc-500">
            Essa seção será desenvolvida na próxima etapa do projeto.
          </p>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section
        id="como-funciona"
        className="border-t border-white/10 px-6 py-32"
      >
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold">
            Como funciona
          </h2>
        </div>
      </section>

      {/* PARA QUEM É */}
      <section
        id="para-quem"
        className="border-t border-white/10 px-6 py-32"
      >
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold">
            Para quem é
          </h2>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        className="border-t border-white/10 px-6 py-32"
      >
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold">
            FAQ
          </h2>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#0A0A0A] px-6 py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-center">
          <p className="text-center text-xs text-zinc-500">
            Desenvolvido por{" "}
            <span className="font-medium text-zinc-300">
              Muac Tecnologia
            </span>
          </p>
        </div>
      </footer>
    </main>
  );
}