import Button from "@/components/Button";
import Navigation from "@/components/navigation/Navigation";
import { signOut } from "@/lib/auth";

export default function () {
  return (
    <div>
      <Navigation />
      <h1>Hello world from Account!</h1>
      <Button onClick={signOut} type={"positive"}>
        Sign out
      </Button>
    </div>
  );
}
