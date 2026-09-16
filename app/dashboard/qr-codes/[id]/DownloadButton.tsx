"use client";

import React, { useState } from "react";

type DownloadButtonProps = {
  imageUrl: string;
  fileName: string;
};

export default function DownloadButton({ imageUrl, fileName }: DownloadButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true);
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Erro ao baixar QR code:", error);
      alert("Não foi possível baixar a imagem automaticamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="flex-1 bg-[#FF5757] text-white px-4 py-3 rounded-xl font-bold hover:brightness-110 transition disabled:opacity-50 text-center cursor-pointer"
    >
      {loading ? "Baixando..." : "Baixar PNG"}
    </button>
  );
}