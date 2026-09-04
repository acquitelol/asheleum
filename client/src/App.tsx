import { useEffect, useMemo, useState } from "react";
import { authClient } from "./lib/auth";

function App() {
  const [user, setUser] = useState<any>(null);
  const [tagName, setTagName] = useState("");
  const [albumUrl, setAlbumUrl] = useState("");
  const [tags, setTags] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [tagFilter, setTagFilter] = useState<string[]>([]);

  const filteredAlbums = useMemo(
    () =>
      tagFilter.length
        ? albums.filter((album) =>
            tagFilter.every((tagId) =>
              album.tags.some((tag) => tag.id === tagId),
            ),
          )
        : albums,
    [albums, tagFilter],
  );

  async function createTag() {
    const res = await fetch("http://localhost:3000/api/tag", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name: tagName,
      }),
    });

    const data = await res.json().catch(console.error);
    console.log(data);
    setTagName("");
    getTags();
  }

  async function createAlbum() {
    const res = await fetch("http://localhost:3000/api/album", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ url: albumUrl }),
    });

    setAlbumUrl("");
    getAlbums();

    const data = await res.json().catch(console.error);
    console.log(data);
  }

  async function setTag(tagId: string, albumId: string) {
    const res = await fetch("http://localhost:3000/api/album_tag", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ tagId, albumId }),
    });

    const data = await res.json().catch(console.error);
    console.log(data);
    getAlbums();
  }

  async function getTags() {
    fetch("http://localhost:3000/api/tags", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setTags(data));
  }

  async function getAlbums() {
    fetch("http://localhost:3000/api/albums", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        return data;
      })
      .then((data) => setAlbums(data))
      .catch(console.error);
  }

  async function deleteTag(tagId: string) {
    const res = await fetch(`http://localhost:3000/api/tag/${tagId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    setTags((tags) => tags.filter((tag) => tag.id !== tagId));
    setAlbums((albums) =>
      albums.map((album) => ({
        ...album,
        tags: album.tags.filter((tag) => tag.id !== tagId),
      })),
    );
  }

  async function deleteAlbum(albumId: string) {
    const res = await fetch(`http://localhost:3000/api/album/${albumId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Failed to delete album");
    }

    setAlbums((albums) => albums.filter((album) => album.id !== albumId));
  }

  async function deleteAlbumTag(tagId: string, albumId: string) {
    const res = await fetch("http://localhost:3000/api/album_tag", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        albumId,
        tagId,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to delete album tag");
    }

    setAlbums((albums) =>
      albums.map((album) =>
        album.id === albumId
          ? {
              ...album,
              tags: album.tags.filter((tag) => tag.id !== tagId),
            }
          : album,
      ),
    );
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
    location.reload();
  }

  useEffect(() => {
    fetch("http://localhost:3000/api/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setUser(data.user));

    getTags();
    getAlbums();
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

      {user ? (
        <>
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

            {tags.length ? (
              tags.map((tag) => (
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <div key={tag.id}>{tag.name}</div>
                  <button onClick={() => deleteTag(tag.id)}>Delete</button>
                </div>
              ))
            ) : (
              <p>No tags found</p>
            )}
          </div>

          <div>
            <input
              value={albumUrl}
              onChange={(e) => setAlbumUrl(e.target.value)}
              placeholder="Album URL"
            />

            <button onClick={createAlbum}>Add album</button>
          </div>

          <div>
            <h2>Filter by tags</h2>
            {tags.length ? (
              tags.map((tag) => (
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <div key={tag.id}>{tag.name}</div>
                  <button
                    onClick={() =>
                      setTagFilter((tags) =>
                        tags.includes(tag.id)
                          ? tags.filter((tagId) => tagId !== tag.id)
                          : [...tags, tag.id],
                      )
                    }
                  >
                    {tagFilter.includes(tag.id) ? "Deselect" : "Select"}
                  </button>
                </div>
              ))
            ) : (
              <p>No tags found</p>
            )}
          </div>

          <div>
            <h2>Your albums</h2>
            {filteredAlbums.length ? (
              filteredAlbums.map(
                (
                  { id, name, artist, type, url, cover, tags: albumTags },
                  i,
                ) => (
                  <div key={i}>
                    <h2>{name}</h2>
                    <h3>{artist}</h3>
                    <h3>{type}</h3>
                    <a href={url} target="_blank">
                      Open
                    </a>
                    <img src={cover} style={{ width: "2em" }} />
                    {albumTags.length ? (
                      <>
                        <h3>Your tags</h3>
                        {albumTags.map((tag) => (
                          <div
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            <div key={tag.id}>{tag.name}</div>
                            <button onClick={() => deleteAlbumTag(tag.id, id)}>
                              Delete tag
                            </button>
                          </div>
                        ))}
                      </>
                    ) : (
                      <p>No tags found</p>
                    )}
                    {tags.length ? (
                      <div>
                        <h3>Add tag</h3>
                        {tags.map((tag) => (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                            }}
                          >
                            <div key={tag.id}>{tag.name}</div>
                            <button onClick={() => setTag(tag.id, id)}>
                              Add
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <></>
                    )}
                    <button onClick={() => deleteAlbum(id)}>
                      Delete album
                    </button>
                    <hr />
                  </div>
                ),
              )
            ) : (
              <p>No albums found</p>
            )}
          </div>
        </>
      ) : null}
    </main>
  );
}

export default App;
