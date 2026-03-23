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
            
            // Update token when session is updated - refetch from DB
            if (trigger === "update") {
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
                    // Keep existing token if DB fetch fails
                }
            }
            
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
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
