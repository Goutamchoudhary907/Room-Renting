
export const Footer = () => {
    return (
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div>
            <h2 className="text-2xl font-bold mb-4">Rentpy</h2>
            <p className="text-sm text-gray-600 mb-2">Find your perfect stay — short or long term.</p>
            <p className="text-sm text-gray-600">Email: <a href="mailto:goutamchoudhary907@gmail.com" className="text-blue-600 hover:underline">goutamchoudhary907@gmail.com</a></p>
            <div className="flex space-x-4 mt-4">
          
              <a href="#" className="text-gray-500 hover:text-black"><i className="fab fa-instagram" /></a>
              <a href="#" className="text-gray-500 hover:text-black"><i className="fab fa-linkedin" /></a>
              <a href="#" className="text-gray-500 hover:text-black"><i className="fab fa-github" /></a>
            </div>
          </div>
  
         
          <div></div>
  
         
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-semibold mb-2 text-gray-800">Quick Links</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li><a href="/" className="hover:underline">Home</a></li>
                <li><a href="/about" className="hover:underline">About Us</a></li>
                <li><a href="/faq" className="hover:underline">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2 text-gray-800">Support</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li><a href="/contact" className="hover:underline">Contact Us</a></li>
                <li><a href="/privacy-policy" className="hover:underline">Privacy Policy</a></li>
                <li><a href="/terms-of-service" className="hover:underline">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>
  
        <div className="border-t py-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Rentpy. All rights reserved.
        </div>
      </footer>
    );
  };
  