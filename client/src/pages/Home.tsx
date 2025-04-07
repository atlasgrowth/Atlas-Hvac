import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Company } from "@/types/company";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  // Set page title
  useEffect(() => {
    document.title = "HVAC Business Profile Management";
  }, []);

  // Fetch all companies
  const { data: companies, isLoading, error } = useQuery<Company[]>({
    queryKey: ["/api/companies"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">HVAC Business Profiles</h1>
            <p className="text-xl text-gray-600">
              Professional HVAC contractors across the United States
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="p-0">
                  <Skeleton className="h-40 w-full" />
                </CardHeader>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
                <CardFooter className="border-t p-4">
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Business Profiles</h1>
          <p className="text-gray-600 mb-6">
            We couldn't load the HVAC company profiles. Please try again later.
          </p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-primary hover:bg-blue-700 text-white"
          >
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">HVAC Business Profiles</h1>
          <p className="text-xl text-gray-600">
            Professional HVAC contractors across the United States
          </p>
        </div>
        
        {companies && companies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {companies.map((company: Company) => (
              <Card key={company.id} className="overflow-hidden transition-transform hover:scale-105">
                <CardHeader className="p-0">
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={company.photo || "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=600"} 
                      alt={company.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="mb-2 text-primary">{company.name}</CardTitle>
                  <CardDescription className="mb-4">
                    {company.description || "Professional HVAC services for residential and commercial properties."}
                  </CardDescription>
                  <div className="flex items-center mb-2">
                    <span className="material-icons text-gray-500 mr-2">location_on</span>
                    <span className="text-gray-700">{company.city}, {company.state}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="material-icons text-gray-500 mr-2">phone</span>
                    <span className="text-gray-700">{company.phone || "Contact for details"}</span>
                  </div>
                  {(company.rating && company.rating > 0) && (
                    <div className="flex items-center mt-2">
                      <div className="flex">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span 
                            key={i} 
                            className={`material-icons text-sm ${i < Math.round(company.rating || 0) ? "text-amber-500" : "text-gray-300"}`}
                          >
                            star
                          </span>
                        ))}
                      </div>
                      <span className="ml-1 text-gray-700">
                        {(company.rating || 0).toFixed(1)} ({company.reviewCount || 0} reviews)
                      </span>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t p-4">
                  <Link 
                    href={`/${company.slug}`} 
                    className="w-full"
                  >
                    <Button 
                      className="w-full bg-primary hover:bg-blue-700"
                    >
                      View Profile
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">No Companies Found</h2>
            <p className="text-gray-600">
              There are currently no HVAC companies in our directory.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
