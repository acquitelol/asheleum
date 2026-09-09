import Button from "@/components/Button";
import Navigation from "@/components/navigation/Navigation";
import { useAuth } from "@/context/AuthContext";
import { deleteAccount, signOut } from "@/lib/auth";
import styles from "./Account.module.css";
import AccountInput from "@/components/Account/AccountInput";
import TrashIcon from "@/components/icons/TrashIcon";
import SignOutIcon from "@/components/icons/SignOutIcon";
import ExportIcon from "@/components/icons/ExportIcon";
import ImportIcon from "@/components/icons/ImportIcon";
import { useMedia } from "@/context/MediaContext";
import { useAlbums } from "@/context/AlbumContext";
import { useTags } from "@/context/TagContext";
import { exportData } from "@/lib/export";
import { importData } from "@/lib/import";
import { createElement, useState } from "react";
import LoadingIcon from "@/components/icons/LoadingIcon";

export default function () {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const { albums, setAlbums } = useAlbums();
  const { tags, setTags } = useTags();
  const { small } = useMedia();
  const { user } = useAuth();

  return (
    <div>
      <main>
        <div className={styles.titleContainer}>
          <h1>Account</h1>
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.content}>
            <div className={styles.header}>
              <img className={styles.image} src={user.image} />
              <div className={styles.name}>
                <AccountInput name={"Name"} value={user.name} />
              </div>
            </div>
            <div className={styles.rows}>
              <AccountInput name={"Email"} value={user.email} />
              <AccountInput name={"ID"} value={user.id} />
              <AccountInput
                name={"Created"}
                value={new Date(user.createdAt).toLocaleString()}
              />
            </div>
          </div>
          <div className={`${styles.content} ${styles.buttonsContainer}`}>
            <h2>Account:</h2>
            <div className={styles.buttons}>
              <Button
                onClick={() => exportData(albums, tags)}
                kind={"positive"}
                border
                className={styles.button}
              >
                <ExportIcon size={20} />
                Export{small ? "" : " Data"}
              </Button>
              <Button
                onClick={() =>
                  importData(
                    [...albums],
                    [...tags],
                    setAlbums,
                    setTags,
                    setLoading,
                  )
                }
                kind={"positive"}
                border
                className={styles.button}
                style={{
                  opacity: loading ? 0.5 : 1,
                  pointerEvents: loading ? "none" : "auto",
                }}
              >
                {createElement(loading ? LoadingIcon : ImportIcon, {
                  size: 20,
                })}
                {loading ? "Loading" : "Import"}
                {small ? "" : " Data"}
              </Button>
            </div>
            <Button
              onClick={signOut}
              kind={"neutral"}
              className={styles.button}
              style={{ marginTop: "1em" }}
              border
            >
              <SignOutIcon size={20} />
              Sign out
            </Button>
            <h2 style={{ marginTop: "0.5em" }}>Danger Zone:</h2>
            <Button
              onClick={() => setShow((p) => !p)}
              kind={"negative"}
              border
              className={styles.button}
              style={{ marginTop: "1em" }}
            >
              <TrashIcon size={20} />
              Delete account
            </Button>
          </div>
        </div>
      </main>
      <div
        className={styles.modalOverlay}
        style={{
          opacity: show ? 1 : 0,
          pointerEvents: show ? "auto" : "none",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
        }}
      >
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h1>Delete account?</h1>
            <p style={{ marginBlock: "1em", fontSize: "1.2em" }}>
              Are you sure you want to delete your account? This is a permanent
              decision and will delete your account and all associated data with
              it. This means your tags and albums will be{" "}
              <span style={{ color: "var(--color-danger)" }}>
                deleted permanently.
              </span>{" "}
              This action cannot be undone.
            </p>
            <Button
              onClick={deleteAccount}
              kind={"negative"}
              border
              className={styles.button}
            >
              <TrashIcon size={20} />
              Delete account
            </Button>
          </div>
        </div>
      </div>
      <Navigation />
    </div>
  );
}
