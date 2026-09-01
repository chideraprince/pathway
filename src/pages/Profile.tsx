import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Save } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Chip } from "@/components/ui/Chip";
import { careers } from "@/data/careers";
import { skills } from "@/data/skills";
import { useAuthStore } from "@/store/authStore";
import { useToastStore } from "@/store/toastStore";
import type { EducationInfo } from "@/types";

const interestOptions = ["Technology", "Business", "Creative", "Emerging & Cross-disciplinary"];
const commonSkillIds = skills.slice(0, 24).map((s) => s.id);

export default function Profile() {
  const { isAuthenticated, user, updateProfile, updateEducation } = useAuthStore();
  const push = useToastStore((s) => s.push);

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  const [name, setName] = useState(user.name);
  const [fieldOfStudy, setFieldOfStudy] = useState(user.education.fieldOfStudy);
  const [level, setLevel] = useState<EducationInfo["level"]>(user.education.level);
  const [experienceYears, setExperienceYears] = useState(user.experienceYears);
  const [interests, setInterests] = useState<string[]>(user.interests);
  const [userSkills, setUserSkills] = useState<string[]>(user.skills);
  const [targetCareerId, setTargetCareerId] = useState<string>(user.targetCareerId ?? "");

  const toggle = (list: string[], set: (v: string[]) => void, id: string) => {
    set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  };

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, experienceYears, interests, skills: userSkills, targetCareerId: targetCareerId || null });
    updateEducation({ fieldOfStudy, level });
    push("Profile updated", "success");
  };

  return (
    <div className="container-page max-w-2xl py-10 sm:py-12">
      <h1 className="text-3xl font-bold tracking-tight text-ink-900">Profile</h1>
      <p className="mt-2 text-ink-600">Keep your details up to date so recommendations stay relevant.</p>

      <form onSubmit={onSave} className="mt-8 space-y-6">
        <Card className="p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-400">Basics</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user.email} disabled className="bg-ink-50 text-ink-400" />
            </div>
            <div>
              <Label htmlFor="field">Field of study</Label>
              <Input id="field" value={fieldOfStudy} onChange={(e) => setFieldOfStudy(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="level">Education level</Label>
              <Select id="level" value={level} onChange={(e) => setLevel(e.target.value as EducationInfo["level"])}>
                <option value="high-school">High school</option>
                <option value="undergraduate">Undergraduate</option>
                <option value="graduate">Graduate</option>
                <option value="bootcamp">Bootcamp</option>
                <option value="self-taught">Self-taught</option>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="experience">Years of experience</Label>
              <Input id="experience" type="number" min={0} max={40} value={experienceYears} onChange={(e) => setExperienceYears(Number(e.target.value))} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-400">Interests</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {interestOptions.map((i) => (
              <Chip key={i} active={interests.includes(i)} onClick={() => toggle(interests, setInterests, i)}>{i}</Chip>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-400">Skills</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {commonSkillIds.map((id) => {
              const skill = skills.find((s) => s.id === id)!;
              return (
                <Chip key={id} active={userSkills.includes(id)} onClick={() => toggle(userSkills, setUserSkills, id)}>
                  {skill.name}
                </Chip>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-400">Target career</h2>
          <div className="mt-4">
            <Select value={targetCareerId} onChange={(e) => setTargetCareerId(e.target.value)}>
              <option value="">Not set</option>
              {careers.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </Select>
          </div>
        </Card>

        <Button type="submit" size="lg">
          <Save className="h-4 w-4" /> Save changes
        </Button>
      </form>
    </div>
  );
}
