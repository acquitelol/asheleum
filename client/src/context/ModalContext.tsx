import { createContext, useContext, useState } from "react";

type ModalContextType = {
  data: Record<string, any> & { show: boolean };
  setData: React.Dispatch<React.SetStateAction<ModalContextType["data"]>>;
};

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<ModalContextType["data"]>({ show: false });

  return (
    <ModalContext.Provider value={{ data, setData }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModal must be used inside ModalProvider");
  }

  return context;
}
