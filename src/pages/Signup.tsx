import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useAuthStore } from "@/store/authStore";
import { useToastStore } from "@/store/toastStore";
import type { EducationInfo } from "@/types";

export default function Signup() {
  const navigate = useNavigate();
  const { signup, updateEducation } = useAuthStore();
  const push = useToastStore((s) => s.push);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [educationLevel, setEducationLevel] = useState<EducationInfo["level"]>("undergraduate");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signup({ name: name || "New Student", email: email || "student@example.com" });
    updateEducation({ fieldOfStudy, level: educationLevel });
    push("Account created", "success");
    navigate("/dashboard");
  };

  return (
    <div className="container-page flex min-h-[70vh] max-w-md flex-col justify-center py-16">
      <div className="mb-6 flex flex-col items-center text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <UserPlus className="h-5 w-5" />
        </span>
        <h1 className="mt-4 text-2xl font-bold text-ink-900">Create your Pathway account</h1>
        <p className="mt-1.5 text-sm text-ink-500">Prototype auth — your data stays in this browser.</p>
      </div>
      <Card className="p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input id="name" required placeholder="Jordan Lee" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="field">Field of study</Label>
              <Input id="field" placeholder="e.g. Computer Science" value={fieldOfStudy} onChange={(e) => setFieldOfStudy(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="level">Education level</Label>
              <Select id="level" value={educationLevel} onChange={(e) => setEducationLevel(e.target.value as EducationInfo["level"])}>
                <option value="high-school">High school</option>
                <option value="undergraduate">Undergraduate</option>
                <option value="graduate">Graduate</option>
                <option value="bootcamp">Bootcamp</option>
                <option value="self-taught">Self-taught</option>
              </Select>
            </div>
          </div>
          <Button type="submit" className="w-full">Create account</Button>
        </form>
      </Card>
      <p className="mt-5 text-center text-sm text-ink-500">
        Already have an account?{" "}
        <Link to="/login" className="focus-ring rounded font-medium text-brand-600 hover:text-brand-700">
          Log in
        </Link>
      </p>
    </div>
  );
}
