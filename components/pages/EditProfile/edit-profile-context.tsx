"use client";

import { createContext, useContext, useState } from "react";

const DEFAULT_AVATAR = "/avatar/default.png";

type AvatarContextValue = {
  avatarSrc: string;
  isDefault: boolean;
  setAvatar: (base64: string) => void;
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

  async function setAvatar(base64: string) {
    setAvatarState(base64);
    try {
      await fetch("/api/profile/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: base64 }),
      });
    } catch {
      // keep local state even if upload fails
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
