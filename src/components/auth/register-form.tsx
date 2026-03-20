"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { register } from "@/actions/auth";
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

const RegisterSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const RegisterForm = () => {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
        setIsPending(true);
        try {
            const data = await register(values);
            if (data.error) {
                form.setError("email", { message: data.error });
                toast.error(data.error);
            } else if (data.success) {
                toast.success(data.success);
                router.push("/auth/signin");
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
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    disabled={isPending}
                                    placeholder="John Doe"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
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
                    Register
                </Button>
            </form>
        </Form>
    );
};
