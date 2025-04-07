import { Company } from "@/types/company";

interface AboutProps {
  company: Company;
}

export default function About({ company }: AboutProps) {
  return (
    <section id="about" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">About Our Company</h2>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <h3 className="text-2xl font-semibold mb-4">
              {company.name}
            </h3>
            <p className="mb-4 leading-relaxed">
              With years of experience serving the {company.city} area, we pride ourselves on delivering reliable heating and cooling solutions tailored to the unique needs of each customer.
            </p>
            
            <p className="mb-4 leading-relaxed">
              Our team of certified technicians is committed to providing exceptional service, using the latest tools and technology to ensure your HVAC systems operate at peak efficiency all year round.
            </p>
            
            <p className="mb-6 leading-relaxed">
              As we move into spring 2025, we're helping homeowners prepare their cooling systems for the warmer months ahead while offering comprehensive maintenance services to extend the life of your equipment.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="flex items-center">
                <span className="material-icons text-primary mr-2">check_circle</span>
                <span>Professional Team</span>
              </div>
              <div className="flex items-center">
                <span className="material-icons text-primary mr-2">check_circle</span>
                <span>Quality Service</span>
              </div>
              <div className="flex items-center">
                <span className="material-icons text-primary mr-2">check_circle</span>
                <span>Fair Pricing</span>
              </div>
              <div className="flex items-center">
                <span className="material-icons text-primary mr-2">check_circle</span>
                <span>Satisfaction Guaranteed</span>
              </div>
            </div>
          </div>
          
          <div className="order-1 md:order-2">
            <div className="relative h-[400px] overflow-hidden rounded-lg shadow-xl">
              <img 
                src={company.photo || "https://images.unsplash.com/photo-1626808642875-0aa545482dfb?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=600"} 
                alt="HVAC Professional Team" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
