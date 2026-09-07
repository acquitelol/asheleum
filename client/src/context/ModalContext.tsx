import { createContext, useContext, useState } from "react";

type ModalContextType = {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  data: any;
  setData: React.Dispatch<React.SetStateAction<any>>;
};

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  const [data, setData] = useState(null);

  return (
    <ModalContext.Provider value={{ show, setShow, data, setData }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
