import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react";

type PathContextType = {
  path: string;
  setPath: Dispatch<SetStateAction<string>>;
};
const PathContext = createContext<PathContextType>({
  path: "",
  setPath: () => null,
});
type PathContextProviderType = PropsWithChildren;
export default function PathContextProvider({
  children,
}: PathContextProviderType) {
  const [path, setPath] = useState("");
  return (
    <PathContext.Provider value={{ path, setPath }}>
      {children}
    </PathContext.Provider>
  );
}

const usePath = () => {
  const context = useContext(PathContext);
  if (!context) throw new Error("Path Context not found");
  return context;
};
export { usePath };
