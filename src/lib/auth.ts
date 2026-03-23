import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { authConfig } from "./auth.config";
import type { Role } from "@/generated/prisma/client";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name: string | null;
            email: string | null;
            image: string | null;
            avatarUrl: string | null;
            bio: string | null;
            role: Role;
        };
    }

    interface User {
        role: Role;
        avatarUrl?: string | null;
        bio?: string | null;
    }
}

import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        ...authConfig.providers,
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await db.user.findUnique({
                    where: { email: credentials.email as string },
                });

                if (!user || !user.password) return null;

                const passwordsMatch = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                );

                if (passwordsMatch) return user;
                return null;
            },
        }),
    ],
    // @ts-expect-error -- adapter type mismatch between @auth/prisma-adapter and next-auth@beta
    adapter: PrismaAdapter(db),
    session: {
        strategy: "jwt",
    },
});
