"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        signOut({ callbackUrl: "/account" });
      }}
    >
      Sair
    </a>
  );
}
