import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Company } from "@/types/company";

interface HeaderProps {
  company: Company;
}

export default function Header({ company }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header 
      className={`fixed w-full bg-white shadow-md z-50 transition-all duration-300 ${
        isScrolled ? "py-2" : "py-3"
      }`}
      id="header"
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <span className="material-icons text-primary mr-2">ac_unit</span>
          <h1 className="text-xl md:text-2xl font-bold text-primary">
            {company.name || "HVAC Service Provider"}
          </h1>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li>
              <a 
                href="#home" 
                className="text-neutral-dark hover:text-primary transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("home");
                }}
              >
                Home
              </a>
            </li>
            <li>
              <a 
                href="#about" 
                className="text-neutral-dark hover:text-primary transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("about");
                }}
              >
                About
              </a>
            </li>
            <li>
              <a 
                href="#services" 
                className="text-neutral-dark hover:text-primary transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("services");
                }}
              >
                Services
              </a>
            </li>
            <li>
              <a 
                href="#reviews" 
                className="text-neutral-dark hover:text-primary transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("reviews");
                }}
              >
                Reviews
              </a>
            </li>
            <li>
              <a 
                href="#location" 
                className="text-neutral-dark hover:text-primary transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("location");
                }}
              >
                Location
              </a>
            </li>
            <li>
              <a 
                href="#contact" 
                className="text-neutral-dark hover:text-primary transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("contact");
                }}
              >
                Contact
              </a>
            </li>
            <li>
              <Link 
                href="/login" 
                className="text-primary font-semibold hover:text-blue-700 transition-colors"
              >
                Login
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-neutral-dark focus:outline-none" 
          onClick={toggleMobileMenu}
        >
          <span className="material-icons">menu</span>
        </button>
      </div>
      
      {/* Mobile Navigation Menu */}
      <div className={`md:hidden bg-white w-full shadow-md ${isMobileMenuOpen ? "" : "hidden"}`}>
        <ul className="py-3">
          <li>
            <a 
              href="#home" 
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("home");
              }}
            >
              Home
            </a>
          </li>
          <li>
            <a 
              href="#about" 
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("about");
              }}
            >
              About
            </a>
          </li>
          <li>
            <a 
              href="#services" 
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("services");
              }}
            >
              Services
            </a>
          </li>
          <li>
            <a 
              href="#reviews" 
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("reviews");
              }}
            >
              Reviews
            </a>
          </li>
          <li>
            <a 
              href="#location" 
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("location");
              }}
            >
              Location
            </a>
          </li>
          <li>
            <a 
              href="#contact" 
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("contact");
              }}
            >
              Contact
            </a>
          </li>
          <li>
            <Link 
              href="/login" 
              className="block px-4 py-2 text-primary font-semibold"
            >
              Login
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
