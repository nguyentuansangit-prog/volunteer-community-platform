import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { authConfig } from "./auth.config";
import { prisma } from "@/lib/prisma";
import { consumeAuthLimit } from "@/lib/auth-rate-limit";

class AuthRateLimited extends CredentialsSignin {
  code = "rate_limited";
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,

  providers: [
    Credentials({
      async authorize(credentials) {
        // Also protects server-action signIn calls, not only the HTTP route.
        if (!(await consumeAuthLimit("login-global", "all", 200, 60_000)).allowed) throw new AuthRateLimited();
        const parsedCredentials = z
          .object({
            email: z.string().trim().toLowerCase().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.data;
        if (!(await consumeAuthLimit("login-account", email, 20, 900_000)).allowed) throw new AuthRateLimited();

        const user = await prisma.user.findFirst({
          where: {
            email: { equals: email, mode: "insensitive" },
          },
        });

        if (!user || user.status !== "ACTIVE") {
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          password,
          user.password
        );

        if (!passwordMatch) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as
          | "VOLUNTEER"
          | "ORGANIZER"
          | "ADMIN";
      }

      return session;
    },
  },
});
