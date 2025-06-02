export const SigninSkeleton = () => {
    return (
      <div className="min-h-screen flex justify-center items-start pt-4 md:pt-8 bg-gray-200 p-4">
        <div className="w-[1000px] h-[600px] lg:w-full lg:max-w-[1000px] lg:h-auto lg:min-h-[600px] flex rounded-lg bg-white lg:flex-row flex-col max-lg:h-full max-lg:w-full max-lg:rounded-none ">
          
          {/* Left image placeholder */}
          <div className="w-[40%] lg:flex justify-center items-center hidden max-lg:hidden">
            <div className="w-full h-full bg-gray-300 animate-pulse rounded-lg" />
          </div>
  
          {/* Right form container */}
          <div className="w-[60%] lg:w-[60%] flex justify-center lg:py-0 py-8 max-lg:w-full max-lg:px-4 max-lg:py-6">
            <div className="w-[350px] mx-auto lg:mt-10 mt-0 max-lg:w-full max-lg:max-w-[350px]">
              
              {/* Top text */}
              <div className="flex justify-center items-center text-[12px] text-[#101011] w-full lg:ml-35 max-lg:flex-wrap max-lg:text-center max-lg:gap-1 mb-4">
                <div className="h-4 bg-gray-300 rounded w-28 animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded w-20 ml-2 animate-pulse cursor-pointer"></div>
              </div>
  
              {/* Title */}
              <div className="text-[25px] text-[#636AE8] font-bold mt-5 lg:mt-0 lg:text-left text-center mb-4">
                <div className="h-8 bg-gray-300 rounded w-24 mx-auto lg:mx-0 animate-pulse"></div>
              </div>
  
              {/* Social buttons */}
              <div className="flex flex-col space-y-3 items-center mb-6">
                <div className="h-10 w-full max-w-[320px] bg-gray-300 rounded animate-pulse"></div>
                <div className="h-10 w-full max-w-[320px] bg-gray-300 rounded animate-pulse"></div>
                <div className="h-10 w-full max-w-[320px] bg-gray-300 rounded animate-pulse"></div>
              </div>
  
              {/* OR divider */}
              <div className="relative flex items-center justify-center mb-6">
                <div className="border-t w-1/2 border-gray-300"></div>
                <span className="bg-white px-4 text-gray-500 text-xs md:text-[11px]">
                  <div className="h-4 w-6 bg-gray-300 rounded animate-pulse"></div>
                </span>
                <div className="border-t w-1/2 border-gray-300"></div>
              </div>
  
              {/* Input fields */}
              <div className="space-y-4">
                {/* Email */}
                <div className="flex flex-col">
                  <div className="h-4 w-20 bg-gray-300 rounded mb-1 animate-pulse"></div>
                  <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
                </div>
  
                {/* Password */}
                <div className="flex flex-col">
                  <div className="h-4 w-24 bg-gray-300 rounded mb-1 animate-pulse"></div>
                  <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
                </div>
              </div>
  
              {/* Errors placeholder (empty, as loading) */}
              <div className="h-5 mt-2"></div>
  
              {/* Remember me + forgot password */}
              <div className="flex flex-row items-center justify-between mt-4">
                <div className="flex items-center mb-2 sm:mb-0">
                  <div className="w-4 h-4 bg-gray-300 rounded animate-pulse mr-2"></div>
                  <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
                </div>
                <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
              </div>
  
              {/* Login button */}
              <div className="mt-4">
                <div className="h-10 bg-gray-300 rounded animate-pulse w-full cursor-not-allowed"></div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    )
  }
  