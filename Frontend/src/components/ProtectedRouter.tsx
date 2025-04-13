import { useAuth } from "@/context/UserAuthProvider";
import { PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router-dom";
type ProtectedRouterProps = PropsWithChildren;
function ProtectedRouter({ children }: ProtectedRouterProps) {
  const currentUser = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (currentUser?.user == undefined) navigate("/signin");
  }, [navigate, currentUser?.user]);
  return children;
}
export default ProtectedRouter;
