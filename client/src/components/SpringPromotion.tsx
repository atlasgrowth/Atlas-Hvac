export default function SpringPromotion() {
  return (
    <section className="py-12 bg-gradient-to-r from-amber-500 to-amber-600 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="inline-block px-3 py-1 bg-white text-amber-500 rounded-full text-sm font-semibold mb-4">
              April 2025 Special
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Spring AC Tune-Up Special
            </h2>
            <p className="text-lg mb-6">
              Schedule your air conditioning maintenance now before the summer heat arrives. 
              Our comprehensive 21-point inspection ensures your system runs efficiently all season long.
            </p>
            
            <ul className="mb-6 space-y-2">
              <li className="flex items-start">
                <span className="material-icons mr-2 text-white">check_circle</span>
                <span>Complete system inspection</span>
              </li>
              <li className="flex items-start">
                <span className="material-icons mr-2 text-white">check_circle</span>
                <span>Clean condenser coils</span>
              </li>
              <li className="flex items-start">
                <span className="material-icons mr-2 text-white">check_circle</span>
                <span>Check refrigerant levels</span>
              </li>
              <li className="flex items-start">
                <span className="material-icons mr-2 text-white">check_circle</span>
                <span>Inspect electrical components</span>
              </li>
            </ul>
            
            <a 
              href="#contact" 
              className="inline-flex items-center justify-center bg-white text-amber-500 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Get Spring Special
            </a>
          </div>
          
          <div className="hidden md:block">
            <img 
              src="https://images.unsplash.com/photo-1592170913778-7a180c2fde48?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=600" 
              alt="AC Maintenance" 
              className="w-full h-auto rounded-lg shadow-lg" 
            />
          </div>
        </div>
      </div>
    </section>
  );
}
