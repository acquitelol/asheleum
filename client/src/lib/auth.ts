import { createAuthClient } from "better-auth/react";
import { API_URL } from "@/lib/constants";

export const authClient = createAuthClient({
  baseURL: API_URL,
});

export async function signIn() {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: window.location.origin,
  });
}

export async function signOut() {
  await authClient.signOut({
    callbackURL: window.location.origin,
  });

  location.reload();
}
