import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { SignInForm } from "@/components/SignInForm";

export default async function SignInPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>
        <SignInForm />
      </div>
    </div>
  );
} 