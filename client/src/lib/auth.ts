import { createAuthClient } from "better-auth/react";
import { API_URL, BASE_URL } from "@/lib/constants";

export const authClient = createAuthClient({
  baseURL: API_URL,
});

export async function signIn() {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: BASE_URL,
  });
}

export async function signOut() {
  await authClient.signOut({
    callbackURL: BASE_URL,
  });

  location.reload();
}
