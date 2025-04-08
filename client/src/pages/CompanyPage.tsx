import { useEffect, useState, useRef } from "react";
import { useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Company, Service, Review } from "@/types/company";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import SpringPromotion from "@/components/SpringPromotion";
import Reviews from "@/components/Reviews";
import Location from "@/components/Location";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/queryClient";

export default function CompanyPage() {
  const [, params] = useRoute("/:slug");
  const slug = params?.slug || "";
  const visitorSessionId = useRef<number | null>(null);
  const startTime = useRef<Date>(new Date());
  
  // Fetch company data based on slug
  const { data: company, isLoading, error } = useQuery<Company>({
    queryKey: [`/api/companies/${slug}`],
    enabled: !!slug,
  });

  // Record page visit mutation
  const recordVisitMutation = useMutation({
    mutationFn: async (data: { companyId: number, path: string }) => {
      const res = await apiRequest("POST", "/api/page-visit", data);
      return res.json();
    }
  });

  // Start visitor session mutation
  const startSessionMutation = useMutation({
    mutationFn: async (data: { companyId: number }) => {
      const res = await apiRequest("POST", "/api/visitor-session/start", data);
      return res.json();
    },
    onSuccess: (data) => {
      visitorSessionId.current = data.id;
    }
  });

  // End visitor session mutation
  const endSessionMutation = useMutation({
    mutationFn: async (data: { sessionId: number, duration: number }) => {
      const res = await apiRequest("POST", "/api/visitor-session/end", data);
      return res.json();
    }
  });

  // Update company pipeline stage mutation
  const updatePipelineStageMutation = useMutation({
    mutationFn: async (data: { companyId: number, stageUpdate: { pipelineStage: string } }) => {
      const res = await apiRequest("PATCH", `/api/companies/${data.companyId}`, data.stageUpdate);
      return res.json();
    }
  });

  // Reference to track if we've already recorded analytics for this company
  const analyticsRecorded = useRef(false);
  
  useEffect(() => {
    // Set page title when company data is loaded
    if (company && !analyticsRecorded.current) {
      // Cast company to the proper type to avoid TypeScript errors
      const companyData = company as Company;
      
      if (companyData.name) {
        // Set the flag to prevent duplicate analytics
        analyticsRecorded.current = true;
        
        document.title = companyData.name;
        
        // Record page visit
        recordVisitMutation.mutate({
          companyId: companyData.id,
          path: window.location.pathname
        });
        
        // Start visitor session
        startSessionMutation.mutate({
          companyId: companyData.id
        });
        
        // Update pipeline stage to "website_viewed" if currently in "website_sent" stage
        if (companyData.pipelineStage === "website_sent") {
          updatePipelineStageMutation.mutate({
            companyId: companyData.id,
            stageUpdate: { pipelineStage: "website_viewed" }
          });
        }
      }
    }
    
    // End session when user leaves the page
    return () => {
      if (visitorSessionId.current && company && analyticsRecorded.current) {
        const companyData = company as Company;
        const duration = Math.round((new Date().getTime() - startTime.current.getTime()) / 1000); // duration in seconds
        endSessionMutation.mutate({
          sessionId: visitorSessionId.current,
          duration: duration
        });
      }
    };
  }, [company]);

  // Mock services data - in a real implementation this would come from the API
  const services: Service[] = [
    {
      id: "1",
      title: "Air Conditioning",
      description: "Installation, repair, and maintenance services for all types of air conditioning systems. Stay cool during hot summers.",
      icon: "ac_unit",
      imageUrl: "https://images.unsplash.com/photo-1581270790627-5cde38cee3e9?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "2",
      title: "Heating Systems",
      description: "Expert furnace and heat pump services, including installation, repair, and regular maintenance to ensure reliable operation.",
      icon: "whatshot",
      imageUrl: "https://images.unsplash.com/photo-1643231996547-f9f8913e5a9d?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "3",
      title: "Indoor Air Quality",
      description: "Solutions to improve your home's air quality with purification systems, humidifiers, dehumidifiers, and ventilation services.",
      icon: "air",
      imageUrl: "https://images.unsplash.com/photo-1585011664466-b7bbe92f34ef?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "4",
      title: "Maintenance Plans",
      description: "Regular maintenance keeps your HVAC system running efficiently. Our affordable plans help prevent costly breakdowns.",
      icon: "build",
      imageUrl: "https://images.unsplash.com/photo-1537110394378-6c3d67b2cc36?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "5",
      title: "Commercial HVAC",
      description: "Specialized solutions for businesses and commercial properties. We understand the unique needs of commercial HVAC systems.",
      icon: "business",
      imageUrl: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "6",
      title: "Emergency Services",
      description: "24/7 emergency repair services when you need them most. Don't suffer through a heating or cooling emergency.",
      icon: "warning",
      imageUrl: "https://images.unsplash.com/photo-1517490232338-06b912a372b2?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=600"
    }
  ];

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Company Not Found</h1>
          <p className="text-gray-600 mb-6">
            We couldn't find the HVAC company you're looking for. Please check the URL and try again.
          </p>
          <a 
            href="/" 
            className="inline-flex items-center justify-center bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  // Cast company to the proper type to avoid TypeScript errors
  const typedCompany: Company = company as Company;
  
  return (
    <>
      <Header company={typedCompany} />
      <Hero company={typedCompany} />
      <About company={typedCompany} />
      <Services services={services} />
      <SpringPromotion />
      <Reviews company={typedCompany} />
      <Location company={typedCompany} />
      <Contact company={typedCompany} />
      <Footer company={typedCompany} />
      <ChatWidget company={typedCompany} />
    </>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Header Skeleton */}
      <div className="fixed w-full bg-white shadow-md z-50 py-3">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-64 hidden md:block" />
        </div>
      </div>
      
      {/* Hero Skeleton */}
      <div className="pt-24 md:pt-32 bg-primary">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Skeleton className="h-8 w-32 mb-4" />
              <Skeleton className="h-12 w-full mb-4" />
              <Skeleton className="h-24 w-full mb-6" />
              <div className="flex flex-col sm:flex-row gap-4">
                <Skeleton className="h-12 w-40" />
                <Skeleton className="h-12 w-40" />
              </div>
            </div>
            <div className="hidden md:block">
              <Skeleton className="h-80 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Loading Skeleton */}
      <div className="container mx-auto px-4 py-16">
        <div className="space-y-16">
          <div className="text-center">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-full max-w-2xl mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="h-96 w-full rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
