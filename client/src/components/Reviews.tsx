import { Company, Review } from "@/types/company";

interface ReviewsProps {
  company: Company;
  reviews?: Review[];
}

export default function Reviews({ company, reviews = [] }: ReviewsProps) {
  const rating = company.rating || 4.5;
  const reviewCount = company.reviewCount || 0;
  
  // Generate default reviews if none provided
  const defaultReviews: Review[] = [
    {
      id: "1",
      companyId: company.id,
      author: "John D.",
      rating: 5,
      comment: "Great service! The technician arrived on time and fixed our AC issue quickly. Very professional and knowledgeable. Will definitely use them again.",
      date: "March 15, 2025",
      initials: "J",
      avatarColor: "bg-primary"
    },
    {
      id: "2",
      companyId: company.id,
      author: "Sarah M.",
      rating: 4,
      comment: "I was impressed with how quickly they responded to my emergency call. The pricing was fair and the work was done right the first time. Very satisfied with their service.",
      date: "February 22, 2025",
      initials: "S",
      avatarColor: "bg-amber-500"
    },
    {
      id: "3",
      companyId: company.id,
      author: "Robert K.",
      rating: 5,
      comment: "Outstanding service! They installed a new HVAC system in our home and the difference is amazing. Energy bills are lower and the house stays comfortable. Highly recommend!",
      date: "January 10, 2025",
      initials: "R",
      avatarColor: "bg-blue-400"
    }
  ];

  const displayReviews = reviews.length > 0 ? reviews : defaultReviews;

  // Generate stars based on rating for overall rating
  const stars = Array.from({ length: 5 }, (_, i) => (
    <span 
      key={i} 
      className={`material-icons text-3xl ${i < Math.round(rating) ? "text-amber-500" : "text-gray-300"}`}
    >
      star
    </span>
  ));

  return (
    <section id="reviews" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Customer Reviews</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See why our customers trust us with their heating and cooling needs.
          </p>
          <div className="w-20 h-1 bg-primary mx-auto mt-3"></div>
        </div>
        
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center mb-2">
            {stars}
          </div>
          <div className="flex items-center">
            <span className="text-3xl font-bold mr-2">{rating.toFixed(1)}</span>
            <span className="text-lg">out of 5 based on</span>
            <span className="text-lg font-semibold ml-1">{reviewCount}</span>
            <span className="text-lg ml-1">reviews</span>
          </div>
          {company.reviewsLink && (
            <a 
              href={company.reviewsLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary hover:text-blue-700 mt-2 font-semibold transition-colors"
            >
              See all reviews on Google
            </a>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-full ${review.avatarColor} text-white flex items-center justify-center font-bold text-xl`}>
                  {review.initials}
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">{review.author}</h4>
                  <div className="flex">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span 
                        key={i} 
                        className={`material-icons text-sm ${i < review.rating ? "text-amber-500" : "text-gray-300"}`}
                      >
                        star
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="italic text-gray-600">{review.comment}</p>
              <p className="text-sm text-gray-500 mt-3">{review.date}</p>
            </div>
          ))}
        </div>
        
        {company.reviewsLink && (
          <div className="text-center mt-10">
            <a 
              href={company.reviewsLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center justify-center bg-white border border-primary text-primary hover:bg-primary hover:text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Read More Reviews
              <span className="material-icons ml-2">rate_review</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
