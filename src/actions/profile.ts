"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { profileSchema, passwordSchema, type ProfileFormValues, type PasswordFormValues } from "@/lib/validations/profile";
import { revalidatePath } from "next/cache";
import type { ApiResponse, UserProfile } from "@/types";
import bcrypt from "bcryptjs";

export async function updateProfile(
    values: ProfileFormValues
): Promise<ApiResponse<UserProfile>> {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        const validated = profileSchema.safeParse(values);

        if (!validated.success) {
            return {
                success: false,
                error: validated.error.issues[0]?.message ?? "Validation failed",
            };
        }

        const updatedUser = await db.user.update({
            where: { id: session.user.id },
            data: {
                name: validated.data.name,
                email: validated.data.email,
                bio: validated.data.bio,
                avatarUrl: validated.data.avatarUrl || null,
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                bio: true,
                avatarUrl: true,
                role: true,
            },
        });

        revalidatePath("/dashboard/profile");
        revalidatePath("/dashboard");

        return { success: true, data: updatedUser };
    } catch (error) {
        console.error("Failed to update profile:", error);
        return { success: false, error: "Failed to update profile" };
    }
}

export async function updatePassword(
    values: PasswordFormValues
): Promise<ApiResponse<null>> {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        const validated = passwordSchema.safeParse(values);

        if (!validated.success) {
            return {
                success: false,
                error: validated.error.issues[0]?.message ?? "Validation failed",
            };
        }

        // Get current user
        const user = await db.user.findUnique({
            where: { id: session.user.id },
            select: { password: true },
        });

        if (!user?.password) {
            return { 
                success: false, 
                error: "Cannot change password for OAuth accounts" 
            };
        }

        // Verify current password
        const passwordsMatch = await bcrypt.compare(
            validated.data.currentPassword,
            user.password
        );

        if (!passwordsMatch) {
            return { 
                success: false, 
                error: "Current password is incorrect" 
            };
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(validated.data.newPassword, 10);

        // Update password
        await db.user.update({
            where: { id: session.user.id },
            data: { password: hashedPassword },
        });

        return { success: true, data: null };
    } catch (error) {
        console.error("Failed to update password:", error);
        return { success: false, error: "Failed to update password" };
    }
}
