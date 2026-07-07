"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useAvatarContext } from "@/components/pages/EditProfile/edit-profile-context";

const DEFAULT_AVATAR = "/avatar/default.png";

export default function AvatarUpload({
  avatarUrl,
  showAddPhoto = false,
  profileHref,
}: {
  avatarUrl?: string;
  showAddPhoto?: boolean;
  profileHref?: string;
}) {
  const ctx = useAvatarContext();

  const displayAvatar = ctx ? ctx.avatarSrc : (avatarUrl || DEFAULT_AVATAR);
  const isDefault = ctx ? ctx.isDefault : (!avatarUrl || avatarUrl === DEFAULT_AVATAR);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [filePath, setFilePath] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFilePath(file.name);

    if (ctx) {
      ctx.setAvatar(file);
    }
    setDialogOpen(false);
  }

  function handleRemove() {
    if (ctx) {
      ctx.removeAvatar();
    }
  }

  return (
    <>
      <div className="relative inline-block">
        {profileHref ? (
          <a href={profileHref}>
            <img
              src={displayAvatar}
              alt=""
              width={120}
              height={120}
              className="mx-auto block"
            />
          </a>
        ) : (
          <img
            src={displayAvatar}
            alt=""
            width={120}
            height={120}
            className="mx-auto block"
          />
        )}
      </div>

      {showAddPhoto && (
        <div className="text-[11px] text-center mt-1">
          {isDefault ? (
            <a
              href="#"
              className="text-orkut-link"
              onClick={(e) => {
                e.preventDefault();
                setDialogOpen(true);
              }}
            >
              Adicionar Foto
            </a>
          ) : (
            <>
              <a
                href="#"
                className="text-orkut-link"
                onClick={(e) => {
                  e.preventDefault();
                  setDialogOpen(true);
                }}
              >
                Alterar Foto
              </a>
              <span className="text-[#999]"> | </span>
              <a
                href="#"
                className="text-orkut-link"
                onClick={(e) => {
                  e.preventDefault();
                  handleRemove();
                }}
              >
                Remover Foto
              </a>
            </>
          )}
        </div>
      )}

      {dialogOpen &&
        createPortal(
          <div className="upload-photo-overlay" onClick={() => setDialogOpen(false)}>
            <div className="upload-photo" onClick={(e) => e.stopPropagation()}>
              <h2 className="upload-photo-title">Upload de Foto</h2>

              <div className="upload-photo-file-row">
                <input
                  type="text"
                  className="xp-file-path"
                  value={filePath}
                  readOnly
                />
                <button className="xp-btn" onClick={() => fileInputRef.current?.click()}>
                  Arquivo...
                </button>
                <button
                  className="xp-btn"
                  onClick={() => setDialogOpen(false)}
                >
                  Fechar
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.gif,.bmp,.png"
                className="hidden"
                onChange={handleFileChange}
              />

              <p className="upload-photo-notice">
                Você pode <strong>enviar</strong> arquivos JPG, GIF, BMP ou PNG
                (tamanho máximo de 10MB). Não envie fotos que contenham imagens
                de personagens de desenho animado, pessoas famosas, nudez,
                trabalho artístico ou material protegido por direitos autorais. O
                tamanho mínimo de imagem é de 32x32.
              </p>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
