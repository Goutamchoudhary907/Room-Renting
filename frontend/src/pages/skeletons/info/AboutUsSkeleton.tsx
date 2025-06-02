export const AboutUsSkeleton = () => {
    return (
      <div className="px-6 py-12 max-w-5xl mx-auto animate-pulse">
        {/* Title */}
        <div className="h-12 bg-gray-300 rounded w-64 mb-6"></div>
  
        {/* Paragraph 1 */}
        <div className="space-y-3 mb-6">
          <div className="h-5 bg-gray-300 rounded w-full"></div>
          <div className="h-5 bg-gray-300 rounded w-5/6"></div>
        </div>
  
        {/* Section: Our Mission */}
        <div className="mb-2">
          <div className="h-8 bg-gray-300 rounded w-48 mb-2"></div>
        </div>
        <div className="h-5 bg-gray-300 rounded w-4/5 mb-6"></div>
  
        {/* Section: Why Choose Rentpy */}
        <div className="mb-2">
          <div className="h-8 bg-gray-300 rounded w-56 mb-2"></div>
        </div>
        <ul className="list-disc list-inside space-y-2 mb-6">
          {[...Array(4)].map((_, i) => (
            <li key={i}>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </li>
          ))}
        </ul>
  
        {/* Section: Our Vision */}
        <div className="mb-2">
          <div className="h-8 bg-gray-300 rounded w-44 mb-2"></div>
        </div>
        <div className="h-5 bg-gray-300 rounded w-full mb-10"></div>
  
        {/* Button */}
        <div className="h-12 bg-gray-300 rounded w-40 mx-auto cursor-not-allowed"></div>
      </div>
    );
  };
  