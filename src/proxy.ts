import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Force NextAuth to use edge-compatible config here
export default NextAuth(authConfig).auth;

export const config = {
    matcher: ["/dashboard/:path*"],
};
