import { signIn } from "../lib/auth";

export default function () {
  return <button onClick={signIn}>Sign in with Google</button>;
}
