"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BigSoftShell } from "@/components/ui/boxes/BigSoftShell";
import { AlbumPhotosEditSection } from "@/components/pages/Albums/AlbumPhotosEditSection";
import { uploadAlbumPhoto } from "@/lib/album-service";

type UploadStatus = "uploading" | "done" | "error";

type UploadingPhoto = {
  id: string;
  name: string;
  sizeKB: number;
  status: UploadStatus;
  previewUrl: string;
  serverId?: string;
  serverUrl?: string;
};

function formatSizeKB(sizeKB: number) {
  if (sizeKB >= 1024) return `${(sizeKB / 1024).toFixed(1)} MB`;
  return `${sizeKB} KB`;
}

export function AlbumsMeuAlbumPage({
  albumId,
  homeHref = "/",
  albumListHref = "/",
  albumHref = "/",
  isOwner = true,
}: {
  albumId: string;
  homeHref?: string;
  albumListHref?: string;
  albumHref?: string;
  isOwner?: boolean;
}) {
  const router = useRouter();
  const [uploadingPhotos, setUploadingPhotos] = useState<UploadingPhoto[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const newPhotos: UploadingPhoto[] = files.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      sizeKB: Math.max(1, Math.round(file.size / 1024)),
      status: "uploading",
      previewUrl: URL.createObjectURL(file),
    }));

    setUploadingPhotos((prev) => [...prev, ...newPhotos]);

    newPhotos.forEach((photo, index) => {
      uploadAlbumPhoto(albumId, files[index])
        .then((uploaded) => {
          setUploadingPhotos((prev) =>
            prev.map((p) =>
              p.id === photo.id
                ? { ...p, status: "done", serverId: uploaded.id, serverUrl: uploaded.url }
                : p,
            ),
          );
        })
        .catch((err) => {
          console.error("Falha ao enviar foto:", err);
          setUploadingPhotos((prev) =>
            prev.map((p) => (p.id === photo.id ? { ...p, status: "error" } : p)),
          );
        });
    });

    e.target.value = "";
  }

  function handleRemoveUploadingPhoto(id: string) {
    setUploadingPhotos((prev) => prev.filter((photo) => photo.id !== id));
  }

  function handleBackToUpload() {
    setUploadingPhotos([]);
    setShowEditor(false);
  }

  function handleSaved() {
    setUploadingPhotos([]);
    setShowEditor(false);
    router.push(albumHref);
  }

  const totalPictures = uploadingPhotos.length;
  const totalSizeKB = uploadingPhotos.reduce((sum, photo) => sum + photo.sizeKB, 0);
  const doneUploads = uploadingPhotos.filter((p) => p.status === "done");
  const isUploading = uploadingPhotos.some((p) => p.status === "uploading");

  if (showEditor) {
    return (
      <AlbumPhotosEditSection
        albumId={albumId}
        homeHref={homeHref}
        albumListHref={albumListHref}
        albumHref={albumHref}
        photos={doneUploads.map((photo) => ({
          id: photo.serverId!,
          src: photo.serverUrl || photo.previewUrl,
          caption: "",
        }))}
        onCancel={handleBackToUpload}
        onSaved={handleSaved}
      />
    );
  }

  if (!isOwner) {
    return (
      <BigSoftShell>
        <div className="orkut-edit-page">
          <h2 className="orkut-subtitle mb-4!">Meu álbum</h2>
          <p className="m-0 text-[12px] text-black">nenhuma foto neste álbum ainda.</p>
        </div>
      </BigSoftShell>
    );
  }

  return (
    <BigSoftShell>
      <div className="orkut-edit-page">
        <div className="flex items-baseline justify-between">
          <h2 className="orkut-subtitle mb-4!">enviar fotos</h2>
          <a href="#" className="text-[11px] text-orkut-link">
            Problemas? Use o programa de envio simples »
          </a>
        </div>
        <p className="m-0 text-[12px] leading-4 text-black">
          Você pode enviar vários arquivos JPG, GIF ou PNG. (Tamanho maximo
          de 10MB por foto.)
        </p>

        <div className="orkut-divider" style={{ marginTop: 8, marginBottom: 8 }} />

        <input
          ref={fileInputRef}
          id="album-photo-file"
          type="file"
          accept=".jpg,.jpeg,.gif,.png"
          multiple
          className="hidden"
          onChange={handleFilesSelected}
        />

        <div>
          <button
            type="button"
            className="orkut-blue-button"
            onClick={() => fileInputRef.current?.click()}
          >
            adicionar fotos
          </button>
        </div>

        {uploadingPhotos.length > 0 && (
          <>
            <div className="mt-3">
              <table className="w-full border-collapse text-[12px]">
                <thead>
                  <tr className="bg-orkut-panel">
                    <th className="border border-orkut-border px-2 py-1 text-left">
                      Foto
                    </th>
                    <th className="border border-orkut-border px-2 py-1 text-left">
                      Tamanho
                    </th>
                    <th className="border border-orkut-border px-2 py-1 text-left">
                      Remover
                    </th>
                    <th className="border border-orkut-border px-2 py-1 text-left">
                      Andamento
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {uploadingPhotos.map((photo) => (
                    <tr key={photo.id}>
                      <td className="border border-orkut-border px-2 py-1">
                        {photo.name}
                      </td>
                      <td className="border border-orkut-border px-2 py-1">
                        {formatSizeKB(photo.sizeKB)}
                      </td>
                      <td className="border border-orkut-border px-2 py-1 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveUploadingPhoto(photo.id)}
                          aria-label="remover foto"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/icons/i_remove.gif" alt="" width={16} height={16} />
                        </button>
                      </td>
                      <td className="border border-orkut-border px-2 py-1">
                        {photo.status === "error" ? (
                          <span className="text-red-600">falha no envio</span>
                        ) : (
                          <div className="orkut-upload-progress">
                            <div
                              className="orkut-upload-progress-fill"
                              style={{ width: photo.status === "done" ? "100%" : "40%" }}
                            />
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td
                      colSpan={3}
                      className="bg-orkut-panel border border-orkut-border px-2 py-1 text-[11px] text-black font-bold"
                    >
                      Total de fotos: {totalPictures}. Tamanho total:{" "}
                      {formatSizeKB(totalSizeKB)}.
                    </td>
                    <td className="border border-orkut-border px-2 py-1">
                      <div className="orkut-upload-progress">
                        <div
                          className="orkut-upload-progress-fill"
                          style={{
                            width: `${(doneUploads.length / totalPictures) * 100}%`,
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="orkut-blue-button"
                disabled={isUploading || doneUploads.length === 0}
                onClick={() => setShowEditor(true)}
              >
                enviar fotos
              </button>
              <div className="text-[11px] leading-4">
                <p className="m-0 text-[#808080]">
                  Número de fotos que você pode enviar para este álbum: 100
                </p>
                <p className="m-0 text-[#808080]">
                  Número de fotos que podem ser enviadas à sua conta: 9938
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </BigSoftShell>
  );
}
