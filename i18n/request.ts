import { getRequestConfig } from "next-intl/server";
import { auth } from "@/auth";
import { getUserByEmail } from "@/actions/user/getUserByEmail";
import { getUserPreferences } from "@/lib/preferences/getUserPreferences";
import type { Locale } from "@/lib/preferences/types";

export default getRequestConfig(async () => {
  const session = await auth();
  let locale: Locale = "en";

  if (session?.user?.email) {
    const user = await getUserByEmail(session.user.email);
    if (user) {
      const preferences = getUserPreferences(user);
      locale = preferences.locale;
    }
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
