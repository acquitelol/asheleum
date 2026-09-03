import { useEffect, useState } from "react";
import { authClient } from "./lib/auth";

function App() {
  const [user, setUser] = useState<any>(null);
  const [tagName, setTagName] = useState("");
  const [tags, setTags] = useState<any[]>([]);

  async function createTag() {
    const res = await fetch("http://localhost:3000/api/tags", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name: tagName,
      }),
    });

    const data = await res.json();
    console.log(data);
    setTagName("");
    getTags();
  }

  async function getTags() {
    fetch("http://localhost:3000/api/tags", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setTags(data));
  }

  async function signIn() {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "http://localhost:5173",
    });
  }

  async function signOut() {
    await authClient.signOut({
      callbackURL: "http://localhost:5173",
    });

    setUser(null);
  }

  useEffect(() => {
    fetch("http://localhost:3000/api/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setUser(data.user));

    getTags();
  }, []);

  return (
    <main>
      {user ? (
        <>
          <p>Signed in as {user.name}</p>
          <button onClick={signOut}>Sign out</button>
        </>
      ) : (
        <button onClick={signIn}>Sign in with Google</button>
      )}

      <div>
        <input
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
          placeholder="Tag name"
        />

        <button onClick={createTag}>Create tag</button>
      </div>

      <div>
        <h2>Your tags</h2>

        {tags.map((tag) => (
          <div key={tag.id}>{tag.name}</div>
        ))}
      </div>
    </main>
  );
}

export default App;
