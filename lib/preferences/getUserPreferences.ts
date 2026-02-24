import type { UserPreferences } from "./types";
import { DEFAULT_PREFERENCES } from "./defaults";
import { User } from "@/prisma/generated/client";

export const getUserPreferences = (user: User | null): UserPreferences => {
  if (!user) return { ...DEFAULT_PREFERENCES };
  return {
    ...DEFAULT_PREFERENCES,
    ...(user.preferences as Partial<UserPreferences>),
  };
}
