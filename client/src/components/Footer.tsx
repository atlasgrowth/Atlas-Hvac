import { Company } from "@/types/company";
import { Link } from "wouter";

interface FooterProps {
  company: Company;
}

export default function Footer({ company }: FooterProps) {
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-4">
              <span className="material-icons text-primary mr-2">ac_unit</span>
              <h3 className="text-xl font-bold">{company.name}</h3>
            </div>
            
            <p className="opacity-75 mb-4">
              Professional heating, cooling, and air quality solutions for homes and businesses in {company.city} and surrounding areas.
            </p>
            
            <div className="flex space-x-3">
              <a href="#" className="bg-primary hover:bg-blue-700 w-9 h-9 rounded-full flex items-center justify-center transition-colors">
                <span className="material-icons text-sm">facebook</span>
              </a>
              <a href="#" className="bg-primary hover:bg-blue-700 w-9 h-9 rounded-full flex items-center justify-center transition-colors">
                <span className="material-icons text-sm">twitter</span>
              </a>
              <a href="#" className="bg-primary hover:bg-blue-700 w-9 h-9 rounded-full flex items-center justify-center transition-colors">
                <span className="material-icons text-sm">instagram</span>
              </a>
              <a href="#" className="bg-primary hover:bg-blue-700 w-9 h-9 rounded-full flex items-center justify-center transition-colors">
                <span className="material-icons text-sm">youtube</span>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#home" 
                  className="opacity-75 hover:opacity-100 hover:text-primary transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Home
                </a>
              </li>
              <li>
                <a 
                  href="#about" 
                  className="opacity-75 hover:opacity-100 hover:text-primary transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  About Us
                </a>
              </li>
              <li>
                <a 
                  href="#services" 
                  className="opacity-75 hover:opacity-100 hover:text-primary transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Services
                </a>
              </li>
              <li>
                <a 
                  href="#reviews" 
                  className="opacity-75 hover:opacity-100 hover:text-primary transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Reviews
                </a>
              </li>
              <li>
                <a 
                  href="#location" 
                  className="opacity-75 hover:opacity-100 hover:text-primary transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('location')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Location
                </a>
              </li>
              <li>
                <a 
                  href="#contact" 
                  className="opacity-75 hover:opacity-100 hover:text-primary transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Contact
                </a>
              </li>
              <li>
                <Link href="/login" className="opacity-75 hover:opacity-100 hover:text-primary transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#services" 
                  className="opacity-75 hover:opacity-100 hover:text-primary transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  AC Repair & Installation
                </a>
              </li>
              <li>
                <a 
                  href="#services" 
                  className="opacity-75 hover:opacity-100 hover:text-primary transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Heating Systems
                </a>
              </li>
              <li>
                <a 
                  href="#services" 
                  className="opacity-75 hover:opacity-100 hover:text-primary transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Indoor Air Quality
                </a>
              </li>
              <li>
                <a 
                  href="#services" 
                  className="opacity-75 hover:opacity-100 hover:text-primary transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Maintenance Plans
                </a>
              </li>
              <li>
                <a 
                  href="#services" 
                  className="opacity-75 hover:opacity-100 hover:text-primary transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Commercial HVAC
                </a>
              </li>
              <li>
                <a 
                  href="#services" 
                  className="opacity-75 hover:opacity-100 hover:text-primary transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Emergency Services
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="material-icons text-primary mr-3 mt-1">location_on</span>
                <address className="not-italic opacity-75">
                  {company.address || 'Contact us for address'}<br />
                  {company.city}, {company.state}
                </address>
              </li>
              <li className="flex items-start">
                <span className="material-icons text-primary mr-3 mt-1">phone</span>
                <a 
                  href={`tel:${company.phone?.replace(/\D/g, '') || ''}`} 
                  className="opacity-75 hover:opacity-100 hover:text-primary transition-colors"
                >
                  {company.phone}
                </a>
              </li>
              <li className="flex items-start">
                <span className="material-icons text-primary mr-3 mt-1">email</span>
                <a 
                  href={`mailto:info@${company.site?.replace(/^https?:\/\/(www\.)?/, '') || 'example.com'}`} 
                  className="opacity-75 hover:opacity-100 hover:text-primary transition-colors"
                >
                  info@{company.site?.replace(/^https?:\/\/(www\.)?/, '') || 'example.com'}
                </a>
              </li>
              <li className="flex items-start">
                <span className="material-icons text-primary mr-3 mt-1">schedule</span>
                <div className="opacity-75">
                  <div>Mon-Fri: 8AM-6PM</div>
                  <div>Sat: 9AM-2PM</div>
                  <div>Sun: Closed</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <hr className="border-gray-700 mb-6" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="opacity-75 text-sm mb-4 md:mb-0">
            © 2025 {company.name}. All rights reserved.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#" className="text-sm opacity-75 hover:opacity-100 hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm opacity-75 hover:opacity-100 hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-sm opacity-75 hover:opacity-100 hover:text-primary transition-colors">
              Sitemap
            </a>
            <a href="#" className="text-sm opacity-75 hover:opacity-100 hover:text-primary transition-colors">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
