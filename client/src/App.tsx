import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import NotFound from "@/pages/not-found";
import CompanyPage from "@/pages/CompanyPage";
import Home from "@/pages/Home";
import AdminDashboard from "@/pages/AdminDashboard";
import AuthPage from "@/pages/AuthPage";
import SetupPage from "@/pages/SetupPage";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={AdminDashboard} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/setup" component={SetupPage} />
      <Route path="/directory" component={Home} />
      <Route path="/:slug" component={CompanyPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
