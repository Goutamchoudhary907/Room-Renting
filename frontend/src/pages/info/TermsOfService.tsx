
export const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
          <span className="bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">
            Rentpy Terms of Service
          </span>
        </h1>
        <div className="w-24 h-1.5 bg-gradient-to-r from-blue-400 to-teal-300 mx-auto rounded-full mb-4"></div>
        <p className="text-gray-600">
          Effective from: {new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
        <div className="prose prose-sm sm:prose-base max-w-none">
          {/* 1. Acceptance of Terms */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600">
              By accessing or using Rentpy, you agree to be bound by these Terms. <strong>You must be at least 18 years old</strong> to use our platform. Minors are strictly prohibited from creating accounts.
            </p>
          </section>

          {/* 2. Account Registration */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">2. Account Registration</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>You must provide accurate and complete information during registration</li>
              <li>You are solely responsible for maintaining the confidentiality of your login credentials</li>
              <li>Account sharing or transfer to others is prohibited</li>
            </ul>
          </section>

          {/* 3. Service Description */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">3. Service Description</h2>
            <p className="text-gray-600">
              Rentpy is a platform that connects property owners with renters. We <strong>do not own</strong> any listed properties nor act as a real estate agent or property manager.
            </p>
          </section>

          {/* 4. Booking & Payments */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">4. Booking & Payments</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>All payments are processed through <strong>Razorpay</strong> (we never store your full payment card details)</li>
              <li>Each property sets its own cancellation policy - review carefully before booking</li>
              <li>You authorize us to charge your payment method for all applicable fees</li>
            </ul>
          </section>

          {/* 5. Property Listings */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">5. Property Listings</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Owners must provide complete and accurate property details</li>
              <li>We reserve the right to remove any misleading or fraudulent listings</li>
              <li>Discriminatory rental practices based on race, religion, gender, etc. are strictly prohibited</li>
            </ul>
          </section>

          {/* 6. User Responsibilities */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">6. User Responsibilities</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Comply with all local rental laws and regulations</li>
              <li>Treat rented properties with care (you're responsible for any damages)</li>
              <li>Respect neighbors and community rules (no excessive noise, parties, etc.)</li>
            </ul>
          </section>

          {/* 7. Prohibited Activities */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">7. Prohibited Activities</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Spam, fraud, harassment, or illegal content</li>
              <li>Attempting to reverse engineer or scrape our platform</li>
              <li>Using Rentpy for unauthorized subletting or commercial activities without permission</li>
            </ul>
          </section>

          {/* 8. Liability Limitations */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">8. Liability Limitations</h2>
            <p className="text-gray-600 mb-2">Rentpy is not liable for:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Disputes between hosts and guests</li>
              <li>Property damages, injuries, or theft</li>
              <li>Temporary service interruptions or technical issues</li>
            </ul>
          </section>

          {/* 9. Termination */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">9. Termination</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>We may suspend accounts violating these Terms</li>
              <li>You may delete your account anytime through settings</li>
            </ul>
          </section>

          {/* 10. Dispute Resolution */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">10. Dispute Resolution</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Users should attempt to resolve conflicts directly first</li>
              <li>These Terms are governed by the laws of India</li>
            </ul>
          </section>

          {/* 11. Changes to Terms */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">11. Changes to Terms</h2>
            <p className="text-gray-600">
              We may update these Terms periodically. The updated version will be posted here with a new effective date. Your continued use constitutes acceptance.
            </p>
          </section>

          {/* 12. Contact Information */}
          <section>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">12. Contact Information</h2>
            <p className="text-gray-600">
              For questions about these Terms: <br />
              <strong>Email:</strong> goutamchoudhary907@gmail.com <br />
              <strong>Address:</strong> Indore - 452001, Madhya Pradesh, India
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};