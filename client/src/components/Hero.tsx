import { Company } from "@/types/company";

interface HeroProps {
  company: Company;
}

export default function Hero({ company }: HeroProps) {
  // Format the phone number for display if it exists
  const formattedPhone = company.phone || "(501) 555-1234";
  const rating = company.rating || 4.5;
  const reviewCount = company.reviewCount || 0;
  
  // Generate stars based on rating
  const stars = Array.from({ length: 5 }, (_, i) => (
    <span 
      key={i} 
      className={`material-icons ${i < Math.round(rating) ? "text-amber-500" : "text-gray-300"}`}
    >
      star
    </span>
  ));

  return (
    <section id="home" className="pt-24 md:pt-32 bg-gradient-to-r from-primary to-blue-800 text-white">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="inline-block px-3 py-1 bg-amber-500 text-white rounded-full text-sm font-semibold mb-4">
              {company.city}, {company.state}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              {company.name}
            </h1>
            <p className="text-lg md:text-xl mb-6 opacity-90">
              {company.description || 
                "Professional heating, ventilation, and air conditioning services for your home and business. We provide expert solutions to keep you comfortable all year round."}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href={`tel:${company.phone?.replace(/\D/g, '') || ''}`} 
                className="inline-flex items-center justify-center bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <span className="material-icons mr-2">phone</span>
                Call Now
              </a>
              <a 
                href="#contact" 
                className="inline-flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span className="material-icons mr-2">calendar_today</span>
                Schedule Service
              </a>
            </div>
            
            {(company.rating && company.rating > 0) && (
              <div className="flex items-center mt-8">
                <div className="flex">
                  {stars}
                </div>
                <span className="ml-2 font-semibold">{rating.toFixed(1)}</span>
                <span className="mx-2">|</span>
                <span>{reviewCount}</span> reviews on Google
              </div>
            )}
          </div>
          
          <div className="hidden md:block">
            <div className="relative">
              <div className="absolute -top-6 -left-6 bg-amber-500 w-20 h-20 rounded-full opacity-20"></div>
              <div className="absolute -bottom-6 -right-6 bg-blue-400 w-20 h-20 rounded-full opacity-20"></div>
              <img 
                src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=600" 
                alt="HVAC Technician" 
                className="w-full h-auto rounded-lg shadow-xl object-cover" 
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white text-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center">
              <span className="material-icons text-primary mr-3 text-3xl">verified</span>
              <div>
                <h3 className="font-semibold">Licensed & Insured</h3>
                <p className="text-sm opacity-75">Professional HVAC service</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="material-icons text-primary mr-3 text-3xl">schedule</span>
              <div>
                <h3 className="font-semibold">Fast Response</h3>
                <p className="text-sm opacity-75">Emergency service available</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="material-icons text-primary mr-3 text-3xl">local_offer</span>
              <div>
                <h3 className="font-semibold">Spring Specials</h3>
                <p className="text-sm opacity-75">Limited time maintenance offers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
