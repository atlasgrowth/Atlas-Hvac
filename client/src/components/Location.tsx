import { Company } from "@/types/company";

interface LocationProps {
  company: Company;
}

export default function Location({ company }: LocationProps) {
  // Create Google Maps URL from latitude and longitude if available
  const mapsUrl = company.latitude && company.longitude
    ? `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d${company.longitude}!3d${company.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM40zMCcwMC4wIk4gOTDCsDAwJzAwLjAiVw!5e0!3m2!1sen!2sus!4v1617734687105!5m2!1sen!2sus`
    : `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d52250.50188283436!2d-92.31216529177924!3d34.72641597909534!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87d2a134a11f569b%3A0x3405f5100df35b17!2sLittle%20Rock%2C%20AR!5e0!3m2!1sen!2sus!4v1617734687105!5m2!1sen!2sus`;

  // Create directions URL
  const directionsUrl = company.latitude && company.longitude
    ? `https://www.google.com/maps/dir/?api=1&destination=${company.latitude},${company.longitude}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${company.address || ''} ${company.city || ''} ${company.state || ''}`)}`;

  return (
    <section id="location" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Our Location</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Serving {company.city} and surrounding areas with quality HVAC services.
          </p>
          <div className="w-20 h-1 bg-primary mx-auto mt-3"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="material-icons text-primary mr-3 mt-1">location_on</span>
                  <div>
                    <h4 className="font-semibold">Address</h4>
                    <address className="not-italic text-gray-600">
                      {company.address || 'Contact us for address'}<br />
                      {company.city}, {company.state}
                    </address>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="material-icons text-primary mr-3 mt-1">phone</span>
                  <div>
                    <h4 className="font-semibold">Phone</h4>
                    <p className="text-gray-600">
                      <a 
                        href={`tel:${company.phone?.replace(/\D/g, '') || ''}`} 
                        className="hover:text-primary transition-colors"
                      >
                        {company.phone}
                      </a>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="material-icons text-primary mr-3 mt-1">email</span>
                  <div>
                    <h4 className="font-semibold">Email</h4>
                    <p className="text-gray-600">
                      <a 
                        href={`mailto:info@${company.site?.replace(/^https?:\/\/(www\.)?/, '') || 'example.com'}`} 
                        className="hover:text-primary transition-colors"
                      >
                        info@{company.site?.replace(/^https?:\/\/(www\.)?/, '') || 'example.com'}
                      </a>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="material-icons text-primary mr-3 mt-1">schedule</span>
                  <div>
                    <h4 className="font-semibold">Hours</h4>
                    <p className="text-gray-600">Monday - Friday: 8:00 AM - 6:00 PM</p>
                    <p className="text-gray-600">Saturday: 9:00 AM - 2:00 PM</p>
                    <p className="text-gray-600">Sunday: Closed (Emergency Service Available)</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Service Area</h3>
              <p className="mb-4 text-gray-600">We proudly serve {company.city} and the following surrounding areas:</p>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <span className="material-icons text-primary mr-2">location_city</span>
                  <span>North Little Rock</span>
                </div>
                <div className="flex items-center">
                  <span className="material-icons text-primary mr-2">location_city</span>
                  <span>Bryant</span>
                </div>
                <div className="flex items-center">
                  <span className="material-icons text-primary mr-2">location_city</span>
                  <span>Benton</span>
                </div>
                <div className="flex items-center">
                  <span className="material-icons text-primary mr-2">location_city</span>
                  <span>Maumelle</span>
                </div>
                <div className="flex items-center">
                  <span className="material-icons text-primary mr-2">location_city</span>
                  <span>Sherwood</span>
                </div>
                <div className="flex items-center">
                  <span className="material-icons text-primary mr-2">location_city</span>
                  <span>Jacksonville</span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="rounded-lg overflow-hidden shadow-md h-[450px]">
              <iframe 
                src={mapsUrl} 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                title="Google Maps"
              ></iframe>
            </div>
            
            <div className="mt-6 flex">
              <a 
                href={directionsUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex-1 bg-primary hover:bg-blue-700 text-white text-center py-3 rounded-l-lg font-semibold transition-colors flex items-center justify-center"
              >
                <span className="material-icons mr-2">directions</span>
                Get Directions
              </a>
              <a 
                href="#contact" 
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-center py-3 rounded-r-lg font-semibold transition-colors flex items-center justify-center"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span className="material-icons mr-2">phone</span>
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
