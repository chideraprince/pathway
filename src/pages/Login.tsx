import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { useAuthStore } from "@/store/authStore";
import { useToastStore } from "@/store/toastStore";

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const push = useToastStore((s) => s.push);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || "student@example.com");
    push("Welcome back!", "success");
    navigate("/dashboard");
  };

  return (
    <div className="container-page flex min-h-[70vh] max-w-md flex-col justify-center py-16">
      <div className="mb-6 flex flex-col items-center text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <LogIn className="h-5 w-5" />
        </span>
        <h1 className="mt-4 text-2xl font-bold text-ink-900">Log in to Pathway</h1>
        <p className="mt-1.5 text-sm text-ink-500">Prototype auth — any email and password will work.</p>
      </div>
      <Card className="p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" className="w-full">Log in</Button>
        </form>
      </Card>
      <p className="mt-5 text-center text-sm text-ink-500">
        New to Pathway?{" "}
        <Link to="/signup" className="focus-ring rounded font-medium text-brand-600 hover:text-brand-700">
          Create an account
        </Link>
      </p>
    </div>
  );
}
