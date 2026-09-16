import { redirect } from "next/navigation";
import { db } from "../../../../src/db";
import { qrCodes, scans } from "../../../../src/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { cookies } from "next/headers";
import { decrypt, deleteSession } from "../../../../src/lib/session";
import DownloadButton from "./DownloadButton";
import Sidebar from "../../Sidebar";
import EditQrForm from "./EditQrForm";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function QrCodeDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    redirect("/login");
  }

  // Busca o QR code garantindo isolamento de dados
  const [qr] = await db
    .select()
    .from(qrCodes)
    .where(and(eq(qrCodes.id, id), eq(qrCodes.userId, session.userId)));

  if (!qr) {
    redirect("/dashboard");
  }

  // Busca os scans associados a este QR code
  const qrScans = await db
    .select()
    .from(scans)
    .where(eq(scans.qrCodeId, qr.id))
    .orderBy(desc(scans.scannedAt))
    .limit(10);

  const publicUrl = `http://localhost:3000/q/${qr.slug}`;
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(publicUrl)}`;

  const sanitizedBusinessName = qr.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-");

  const fileName = `qrcode - ${sanitizedBusinessName}.png`;

  async function handleLogout() {
    "use server";
    await deleteSession();
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F8F8F6]">
      {/* Sidebar / Menu Gaveta Responsivo */}
      <Sidebar logoutAction={handleLogout} />

      {/* Main Content */}
      <main className="max-w-xl mx-auto p-4 md:p-8 pt-24 space-y-8 w-full">
        <EditQrForm
          qrId={qr.id}
          initialName={qr.name}
          initialType={qr.destinationType}
          initialUrl={qr.destinationUrl}
          initialIsActive={qr.isActive}
          publicUrl={publicUrl}
          qrCodeImageUrl={qrCodeImageUrl}
          fileName={fileName}
          downloadButton={<DownloadButton imageUrl={qrCodeImageUrl} fileName={fileName} />}
          qrScansCount={qrScans.length}
          recentScans={qrScans}
        />
      </main>
    </div>
  );
}