import { z } from "zod";

export const profileSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be at most 50 characters"),
    email: z
        .string()
        .email("Please enter a valid email address"),
    bio: z
        .string()
        .max(500, "Bio must be at most 500 characters")
        .optional(),
    avatarUrl: z
        .string()
        .refine(
            (val) => !val || val === "" || val.startsWith("/") || val.startsWith("http://") || val.startsWith("https://"),
            "Please enter a valid URL or path"
        )
        .optional()
        .or(z.literal("")),
});

export const passwordSchema = z.object({
    currentPassword: z
        .string()
        .min(1, "Current password is required"),
    newPassword: z
        .string()
        .min(8, "New password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z
        .string()
        .min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
export type PasswordFormValues = z.infer<typeof passwordSchema>;
