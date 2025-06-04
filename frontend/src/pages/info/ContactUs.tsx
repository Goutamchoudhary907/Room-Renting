export const ContactUs = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8 min-h-screen flex items-center justify-center">
      <div className="w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">
              Contact Rentpy
            </span>
          </h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-400 to-teal-300 mx-auto rounded-full"></div>
        </div>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Get in Touch</h2>
            <p className="text-gray-600 mb-8 max-w-lg mx-auto">
              Have questions about Rentpy? Our team is here to help you with any inquiries 
              about our services, properties, or your rental experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            {/* Email */}
            <div className="bg-gradient-to-br from-blue-50 to-gray-50 p-6 rounded-lg text-center">
              <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-700 mb-1">Email</h3>
              <div className="break-all px-2">
                <a href="mailto:goutamchoudhary907@gmail.com" className="text-blue-600 hover:underline text-sm">
                  goutamchoudhary907@gmail.com
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-gradient-to-br from-blue-50 to-gray-50 p-6 rounded-lg text-center">
              <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-700 mb-1">Phone</h3>
              <a href="tel:+919630594507" className="text-blue-600 hover:underline text-sm">
                +91 96305 94507
              </a>
            </div>

            {/* Address */}
            <div className="bg-gradient-to-br from-blue-50 to-gray-50 p-6 rounded-lg text-center">
              <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-700 mb-1">Address</h3>
              <address className="not-italic text-gray-600 text-sm">
              J 55 , Gayatri Mandir, Gayatri nagar,Siroliya , Dewas
              <br />
                Madhya Pradesh
              </address>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};