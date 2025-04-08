import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  path: string;
  component: React.ComponentType;
}

export function ProtectedRoute({
  path,
  component: Component
}: ProtectedRouteProps) {
  const { user, isLoading, refetchUser } = useAuth();
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  // Attempt to refetch user data a few times if not authenticated
  useEffect(() => {
    if (!isLoading && !user && retryCount < maxRetries) {
      const timer = setTimeout(() => {
        console.log(`Retrying authentication (${retryCount + 1}/${maxRetries})...`);
        refetchUser();
        setRetryCount(prev => prev + 1);
      }, 1000); // Wait 1 second between retries
      
      return () => clearTimeout(timer);
    }
  }, [user, isLoading, retryCount, refetchUser]);

  return (
    <Route path={path}>
      {() => {
        // Show loading while initial loading or during retry attempts
        if (isLoading || (!user && retryCount < maxRetries)) {
          return (
            <div className="flex flex-col items-center justify-center min-h-screen">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-slate-500">Verifying authentication...</p>
            </div>
          );
        }

        // If still no user after retries, redirect to auth page
        if (!user) {
          return <Redirect to="/auth" />;
        }

        return <Component />;
      }}
    </Route>
  );
}