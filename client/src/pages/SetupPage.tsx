import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function SetupPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'initial' | 'creating-admin' | 'importing-data' | 'complete' | 'error'>('initial');
  const [error, setError] = useState<string | null>(null);

  const runSetup = async () => {
    setIsLoading(true);
    setStatus('creating-admin');
    setError(null);

    try {
      // Step 1: Create admin user
      toast({
        title: "Creating admin user...",
        description: "This may take a moment",
      });

      await apiRequest('POST', '/api/setup/create-admin', {});
      
      // Step 2: Import company data
      setStatus('importing-data');
      toast({
        title: "Importing company data...",
        description: "This may take several minutes",
      });

      await apiRequest('POST', '/api/setup/import-data', {});
      
      // Complete
      setStatus('complete');
      toast({
        title: "Setup complete!",
        description: "Your database has been initialized successfully",
      });
    } catch (err) {
      console.error('Setup error:', err);
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      toast({
        title: "Setup failed",
        description: "Please check console for details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Atlas Growth Setup</CardTitle>
          <CardDescription>
            Initialize your database with admin users and company data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {status === 'creating-admin' && isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              ) : status === 'complete' || status === 'importing-data' ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : status === 'error' ? (
                <AlertCircle className="h-5 w-5 text-red-500" />
              ) : (
                <div className="h-5 w-5 rounded-full border border-gray-300" />
              )}
              <div>
                <p className="font-medium">Create Admin User</p>
                <p className="text-sm text-gray-500">
                  Username: admin, Password: admin123
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {status === 'importing-data' && isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              ) : status === 'complete' ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : status === 'error' ? (
                <AlertCircle className="h-5 w-5 text-red-500" />
              ) : (
                <div className="h-5 w-5 rounded-full border border-gray-300" />
              )}
              <div>
                <p className="font-medium">Import Company Data</p>
                <p className="text-sm text-gray-500">
                  Loads companies from CSV files
                </p>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
                {error}
              </div>
            )}

            {status === 'complete' && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-800 text-sm">
                Setup complete! You can now <a href="/auth" className="text-blue-600 underline">log in</a> with:<br />
                Username: admin<br />
                Password: admin123
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          {status !== 'complete' ? (
            <Button 
              onClick={runSetup} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running Setup...
                </>
              ) : (
                <>Run Database Setup</>
              )}
            </Button>
          ) : (
            <Button 
              asChild 
              className="w-full"
            >
              <a href="/auth">Go to Login</a>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}