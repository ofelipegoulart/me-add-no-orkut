import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const res = await fetch(`${process.env.API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        if (!res.ok) return null;

        const data = await res.json();

        let onboarded = false;
        try {
          const profileRes = await fetch(`${process.env.API_URL}/users/me`, {
            headers: { Authorization: `Bearer ${data.token}` },
          });
          if (profileRes.ok) {
            const profile = await profileRes.json();
            // User is onboarded only if birthDate is a valid, non-empty string
            onboarded = !!(profile.birthDate && profile.birthDate.trim());
          }
        } catch {
          // If profile check fails, treat as not onboarded
        }

        return {
          id: String(data.userId).replace(/-/g, "").substring(0, 8),
          name: data.name,
          email: data.email,
          jwt: data.token,
          onboarded,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.userId = user.id;
        token.name = user.name;
        token.email = user.email;
        token.jwt = user.jwt;
        token.onboarded = user.onboarded;
      }
      if (trigger === "update") {
        token.onboarded = true;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        userId: token.userId,
        name: token.name as string,
        email: token.email as string,
        jwt: token.jwt,
        onboarded: token.onboarded as boolean,
      };
      return session;
    },
  },
  pages: {
    signIn: "/account",
  },
  session: {
    strategy: "jwt",
    maxAge: 3 * 24 * 60 * 60,
  },
};
