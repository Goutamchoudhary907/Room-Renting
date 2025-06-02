export const ResetPasswordSkeleton = () => {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="w-96 p-6 bg-white rounded-lg shadow-md animate-pulse">
          {/* Title */}
          <div className="h-6 bg-gray-300 rounded w-2/3 mx-auto mb-6"></div>
  
          {/* Error placeholders */}
          <div className="h-4 bg-gray-200 rounded w-4/5 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-4"></div>
  
          {/* New Password Field */}
          <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
  
          {/* Confirm Password Field */}
          <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
  
          {/* Submit Button */}
          <div className="h-10 bg-gray-300 rounded w-full"></div>
        </div>
      </div>
    );
  };
  