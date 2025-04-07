import { useState } from "react";
import { Company } from "@/types/company";
import { useToast } from "@/hooks/use-toast";

interface ContactProps {
  company: Company;
}

export default function Contact({ company }: ContactProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    message: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would send the form data to the backend
    console.log("Form submitted:", formData);
    
    toast({
      title: "Message Sent",
      description: "Thank you for your message. We'll get back to you soon!",
    });
    
    // Reset form
    setFormData({
      name: "",
      phone: "",
      email: "",
      service: "",
      message: "",
    });
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Contact Us</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Need HVAC service? Have questions? Contact us today and we'll get back to you quickly.
          </p>
          <div className="w-20 h-1 bg-white mx-auto mt-3"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white text-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-primary">Send Us a Message</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="name" className="block mb-1">Name *</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" 
                    required 
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block mb-1">Phone *</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" 
                    required 
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block mb-1">Email *</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" 
                  required 
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="service" className="block mb-1">Service Needed</label>
                <select 
                  id="service" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.service}
                  onChange={handleInputChange}
                >
                  <option value="">Select a Service</option>
                  <option value="ac-repair">AC Repair</option>
                  <option value="ac-install">AC Installation</option>
                  <option value="furnace-repair">Furnace Repair</option>
                  <option value="furnace-install">Furnace Installation</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="air-quality">Indoor Air Quality</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="message" className="block mb-1">Message</label>
                <textarea 
                  id="message" 
                  rows={4} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.message}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-primary hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
          
          <div>
            <div className="bg-white text-gray-800 rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4 text-primary">Schedule a Service</h3>
              
              <p className="mb-4">Ready to schedule your HVAC service? Call us directly or use our online scheduling system.</p>
              
              <a 
                href={`tel:${company.phone?.replace(/\D/g, '') || ''}`} 
                className="flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg font-semibold transition-colors mb-4"
              >
                <span className="material-icons mr-2">phone</span>
                Call to Schedule: {company.phone}
              </a>
              
              <a 
                href="#" 
                className="flex items-center justify-center bg-primary hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  toast({
                    title: "Online Scheduling",
                    description: "Our online scheduling system will be available soon!",
                  });
                }}
              >
                <span className="material-icons mr-2">calendar_today</span>
                Schedule Online
              </a>
            </div>
            
            <div className="bg-white text-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-primary">Emergency Service</h3>
              
              <p className="mb-4">HVAC emergency? We offer 24/7 emergency service for urgent heating and cooling issues.</p>
              
              <div className="flex items-start mb-4">
                <span className="material-icons text-amber-500 mr-3 mt-1">warning</span>
                <p>Call our emergency line for immediate assistance outside regular business hours.</p>
              </div>
              
              <a 
                href={`tel:${company.phone?.replace(/\D/g, '') || ''}`} 
                className="flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                <span className="material-icons mr-2">emergency</span>
                Emergency: {company.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
