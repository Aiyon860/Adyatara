"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const LoginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password is required"),
});

export const LoginForm = () => {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
        setIsPending(true);
        try {
            const result = await signIn("credentials", {
                redirect: false,
                email: values.email,
                password: values.password,
            });

            if (result?.error) {
                toast.error("Invalid credentials.");
            } else if (result?.ok) {
                toast.success("Successfully logged in.");
                window.location.href = "/dashboard";
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    disabled={isPending}
                                    placeholder="john.doe@example.com"
                                    type="email"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    disabled={isPending}
                                    placeholder="******"
                                    type="password"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button disabled={isPending} type="submit" className="w-full mt-4">
                    Sign In
                </Button>
            </form>
        </Form>
    );
};
