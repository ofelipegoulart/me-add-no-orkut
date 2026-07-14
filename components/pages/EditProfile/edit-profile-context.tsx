"use client";

import { createContext, useContext, useState } from "react";

const DEFAULT_AVATAR = "/avatar/i_nophoto128.gif";

type AvatarContextValue = {
  avatarSrc: string;
  isDefault: boolean;
  setAvatar: (file: File) => void;
  removeAvatar: () => void;
};

const AvatarContext = createContext<AvatarContextValue | null>(null);

export function EditProfileProvider({
  initialAvatar,
  children,
}: {
  initialAvatar: string;
  children: React.ReactNode;
}) {
  const [avatar, setAvatarState] = useState(initialAvatar || "");

  const avatarSrc = avatar || DEFAULT_AVATAR;
  const isDefault = !avatar || avatar === DEFAULT_AVATAR;

  async function setAvatar(file: File) {
    // Preview otimista imediato enquanto o upload acontece.
    const previewUrl = URL.createObjectURL(file);
    setAvatarState(previewUrl);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/profile/avatar", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.avatar) {
          // Troca o preview local pela URL definitiva retornada pelo backend.
          setAvatarState(data.avatar);
          URL.revokeObjectURL(previewUrl);
        }
      }
    } catch {
      // keep local preview even if upload fails
    }
  }

  async function removeAvatar() {
    setAvatarState("");
    try {
      await fetch("/api/profile/avatar", { method: "DELETE" });
    } catch {
      // keep local state even if delete fails
    }
  }

  return (
    <AvatarContext value={{ avatarSrc, isDefault, setAvatar, removeAvatar }}>
      {children}
    </AvatarContext>
  );
}

export function useAvatarContext() {
  return useContext(AvatarContext);
}
