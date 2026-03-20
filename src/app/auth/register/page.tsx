import { RegisterForm } from "@/components/auth/register-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function RegisterPage() {
    return (
        <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4 mt-8">
            <Card className="w-full max-w-md gap-4">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Create an account</CardTitle>
                    <CardDescription>
                        Enter your information to register
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <RegisterForm />
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/auth/signin" className="underline text-primary">
                            Sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
