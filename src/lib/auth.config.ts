import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";
import { db } from "@/lib/db";

export const authConfig = {
    providers: [GitHub, Google],
    pages: {
        signIn: "/auth/signin",
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.avatarUrl = user.avatarUrl;
                token.bio = user.bio;
            }
            
            // Update token when session is updated
            if (trigger === "update" && session) {
                // Use the data passed from update() call directly
                // This ensures immediate sync without waiting for DB
                if (session.name !== undefined) token.name = session.name;
                if (session.email !== undefined) token.email = session.email;
                if (session.avatarUrl !== undefined) token.avatarUrl = session.avatarUrl;
                if (session.bio !== undefined) token.bio = session.bio;
            } else if (trigger === "update") {
                // Fallback: refetch from DB if no session data provided
                try {
                    const dbUser = await db.user.findUnique({
                        where: { id: token.id as string },
                        select: {
                            name: true,
                            email: true,
                            avatarUrl: true,
                            bio: true,
                        },
                    });
                    
                    if (dbUser) {
                        token.name = dbUser.name;
                        token.email = dbUser.email;
                        token.avatarUrl = dbUser.avatarUrl;
                        token.bio = dbUser.bio;
                    }
                } catch (error) {
                    console.error("Failed to refetch user data:", error);
                }
            }
            
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name ?? null;
                // @ts-expect-error - email type mismatch between next-auth base and our augmentation
                session.user.email = token.email ?? null;
                // @ts-expect-error - role is dynamically added
                session.user.role = token.role;
                // @ts-expect-error - avatarUrl is dynamically added
                session.user.avatarUrl = token.avatarUrl;
                // @ts-expect-error - bio is dynamically added
                session.user.bio = token.bio;
            }
            return session;
        },
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
            const isOnExplore = nextUrl.pathname.startsWith("/explore");

            if (isOnDashboard || isOnExplore) {
                if (isLoggedIn) return true;
                return false;
            }

            return true;
        },
    },
} satisfies NextAuthConfig;
