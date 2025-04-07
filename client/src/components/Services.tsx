import { Service } from "@/types/company";

interface ServicesProps {
  services: Service[];
}

export default function Services({ services }: ServicesProps) {
  // If no services are provided, use these default services
  const defaultServices: Service[] = [
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

  const displayServices = services.length > 0 ? services : defaultServices;

  return (
    <section id="services" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Our Services</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive heating, cooling, and air quality solutions for your home or business.
          </p>
          <div className="w-20 h-1 bg-primary mx-auto mt-3"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayServices.map((service) => (
            <div 
              key={service.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={service.imageUrl} 
                  alt={service.title} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className={`material-icons text-primary mr-2`}>{service.icon}</span>
                  <h3 className="text-xl font-semibold">{service.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <a 
                  href="#contact" 
                  className="text-primary font-semibold flex items-center hover:text-blue-700 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Learn More <span className="material-icons ml-1">arrow_forward</span>
                </a>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-lg mb-6">Ready for your spring HVAC maintenance? Don't wait until summer to ensure your system is ready for the heat!</p>
          <a 
            href="#contact" 
            className="inline-flex items-center justify-center bg-primary hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span className="material-icons mr-2">event</span>
            Schedule Your Service
          </a>
        </div>
      </div>
    </section>
  );
}
