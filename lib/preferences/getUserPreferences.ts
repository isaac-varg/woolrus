import type { UserPreferences } from "./types";
import { DEFAULT_PREFERENCES } from "./defaults";
import { User } from "@/prisma/generated/client";

export const getUserPreferences = (user: User): UserPreferences => {
  return {
    ...DEFAULT_PREFERENCES,
    ...(user.preferences as Partial<UserPreferences>),
  };
}
