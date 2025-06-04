// src/pages/PrivacyPolicy.tsx
import { Link } from "react-router-dom";

export const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
          <span className="bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">
            Rentpy Privacy Policy
          </span>
        </h1>
        <div className="w-24 h-1.5 bg-gradient-to-r from-blue-400 to-teal-300 mx-auto rounded-full mb-4"></div>
        <p className="text-gray-600">
          Last updated: {new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
        <div className="prose prose-sm sm:prose-base max-w-none">
          <p className="text-gray-600 mb-6">
            Your privacy is important to us. This Privacy Policy explains how Rentpy collects, uses, shares, 
            and protects your personal information when you use our platform.
          </p>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">1. Information We Collect</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
              <li><strong>Account Information:</strong> Name, email, phone number, profile picture</li>
              <li><strong>Booking Details:</strong> Check-in/out dates, payment information, guest details</li>
              <li><strong>Property Data:</strong> Address, photos, amenities, pricing</li>
              <li><strong>Usage Data:</strong> IP address, device information, browsing activity</li>
              <li><strong>Communications:</strong> Messages with hosts/guests, support tickets</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">2. How We Use Your Data</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-700 mb-2">Service Operation</h3>
                <p className="text-gray-600 text-sm">Facilitate bookings, process payments, and communicate</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-700 mb-2">Improvements</h3>
                <p className="text-gray-600 text-sm">Enhance user experience and develop new features</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-700 mb-2">Security</h3>
                <p className="text-gray-600 text-sm">Prevent fraud and unauthorized access</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-700 mb-2">Legal Compliance</h3>
                <p className="text-gray-600 text-sm">Meet regulatory requirements</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">3. Data Sharing</h2>
            <p className="text-gray-600 mb-3">We only share data when necessary:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
              <li><strong>Hosts/Guests:</strong> Basic booking details to facilitate reservations</li>
              <li><strong>Payment Processors:</strong> Razorpay (PCI-DSS compliant) for transactions</li>
              <li><strong>Service Providers:</strong> Cloud hosting, customer support, analytics</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect rights</li>
            </ul>
            <p className="text-gray-600">
              We <strong>never</strong> sell your personal data to third-party advertisers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">4. Payment Security</h2>
            <div className="flex items-start bg-green-50 rounded-lg p-4 mb-4">
              <div className="bg-green-100 p-2 rounded-full mr-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-600">
                  All payments are processed through <strong>Razorpay</strong>, a PCI-DSS compliant service. 
                  Rentpy never stores your full credit card details on our servers.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">5. Your Rights</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update inaccurate information</li>
              <li><strong>Deletion:</strong> Remove your account data (where applicable)</li>
              <li><strong>Objection:</strong> Opt-out of marketing communications</li>
            </ul>
            <p className="text-gray-600">
              To exercise these rights, contact us at <Link to="/contact" className="text-blue-600 hover:underline">our support center</Link>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">6. Policy Updates</h2>
            <p className="text-gray-600">
              We'll update this page if our policies change. The "Last updated" date at the top will reflect any revisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">7. Children's Privacy</h2>
            <p className="text-gray-600">
              Our services are not intended for users under 18. We do not knowingly collect data from children. 
              If we discover such collection, we will delete it immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">8. Contact Us</h2>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-gray-600 mb-2"><strong>Email:</strong> goutamchoudhary907@gmail.com</p>
              <p className="text-gray-600 mb-2"><strong>Address:</strong>   J 55 , Gayatri Mandir, Gayatri nagar,Siroliya , Dewas- 455001, Madhya Pradesh, India</p>
              <p className="text-gray-600"><strong>Phone:</strong> +91 96305 94507</p>
            </div>
            <p className="text-gray-500 text-sm mt-4 text-center">
              © {new Date().getFullYear()} Rentpy. All rights reserved.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};