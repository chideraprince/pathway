import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { EducationInfo, UserProfile } from "@/types";

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  signup: (input: { name: string; email: string }) => void;
  login: (email: string) => void;
  logout: () => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
  updateEducation: (patch: Partial<EducationInfo>) => void;
}

const defaultProfile = (name: string, email: string): UserProfile => ({
  id: `user-${Date.now()}`,
  name,
  email,
  education: { level: "undergraduate", fieldOfStudy: "" },
  experienceYears: 0,
  interests: [],
  skills: [],
  targetCareerId: null,
  createdAt: new Date().toISOString(),
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      signup: ({ name, email }) =>
        set({ user: defaultProfile(name, email), isAuthenticated: true }),
      login: (email) =>
        set((state) => ({
          user: state.user ?? defaultProfile(email.split("@")[0] || "Student", email),
          isAuthenticated: true,
        })),
      logout: () => set({ isAuthenticated: false }),
      updateProfile: (patch) =>
        set((state) => (state.user ? { user: { ...state.user, ...patch } } : state)),
      updateEducation: (patch) =>
        set((state) =>
          state.user
            ? { user: { ...state.user, education: { ...state.user.education, ...patch } } }
            : state
        ),
    }),
    { name: "pathway-auth" }
  )
);
