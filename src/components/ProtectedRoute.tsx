import { Navigate } from "react-router-dom";
import { useSession } from "@/store/session";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user } = useSession();
  if (!user) return <Navigate to="/auth" replace />;
  return children;
}
