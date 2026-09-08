import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

type MediaContextType = {
  small: boolean;
  setSmall: Dispatch<SetStateAction<boolean>>;
};

const MediaContext = createContext<MediaContextType | null>(null);

export function MediaProvider({ children }: { children: React.ReactNode }) {
  const [small, setSmall] = useState(
    window.matchMedia("(max-width: 700px)").matches,
  );

  useEffect(() => {
    const media = window.matchMedia("(max-width: 700px)");
    const handler = () => setSmall(media.matches);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  return (
    <MediaContext.Provider value={{ small, setSmall }}>
      {children}
    </MediaContext.Provider>
  );
}

export function useMedia() {
  const context = useContext(MediaContext);

  if (!context) {
    throw new Error("useMedia must be used inside MediaProvider");
  }

  return context;
}
