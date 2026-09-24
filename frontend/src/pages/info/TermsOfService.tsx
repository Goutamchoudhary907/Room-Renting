
export const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-cream px-6 py-12">
      <div className="mx-auto mb-10 max-w-4xl text-center">
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-amber/15 bg-amber/8 px-3.5 py-1.5">
          <span className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-amber">
            Legal
          </span>
        </div>
        <h1 className="m-0 mb-3 font-serif text-[clamp(32px,5vw,48px)] font-semibold leading-[1.1] tracking-tight text-ink">
          Rentpy Terms of Service
        </h1>
        <p className="m-0 font-sans text-sm text-taupe-light">
          Effective from: 20th October 2025
        </p>
      </div>

      <div className="mx-auto max-w-4xl rounded-3xl border border-cream-border bg-white p-6 sm:p-9">
        <div className="prose prose-sm sm:prose-base max-w-none">
          {/* 1. Acceptance of Terms */}
          <section className="mb-8">
            <h2 className="m-0 mb-4 font-serif text-2xl font-semibold text-ink">1. Acceptance of Terms</h2>
            <p className="m-0 font-sans text-[15px] leading-relaxed text-taupe">
              By accessing or using Rentpy, you agree to be bound by these Terms. <strong>You must be at least 18 years old</strong> to use our platform. Minors are strictly prohibited from creating accounts.
            </p>
          </section>

          {/* 2. Account Registration */}
          <section className="mb-8">
            <h2 className="m-0 mb-4 font-serif text-2xl font-semibold text-ink">2. Account Registration</h2>
            <ul className="list-disc space-y-2 pl-6 font-sans text-[15px] leading-relaxed text-taupe">
              <li>You must provide accurate and complete information during registration</li>
              <li>You are solely responsible for maintaining the confidentiality of your login credentials</li>
              <li>Account sharing or transfer to others is prohibited</li>
            </ul>
          </section>

          {/* 3. Service Description */}
          <section className="mb-8">
            <h2 className="m-0 mb-4 font-serif text-2xl font-semibold text-ink">3. Service Description</h2>
            <p className="m-0 font-sans text-[15px] leading-relaxed text-taupe">
              Rentpy is a platform that connects property owners with renters. We <strong>do not own</strong> any listed properties nor act as a real estate agent or property manager.
            </p>
          </section>

          {/* 4. Booking & Payments */}
          <section className="mb-8">
            <h2 className="m-0 mb-4 font-serif text-2xl font-semibold text-ink">4. Booking & Payments</h2>
            <ul className="list-disc space-y-2 pl-6 font-sans text-[15px] leading-relaxed text-taupe">
              <li>All payments are processed through <strong>Razorpay</strong> (we never store your full payment card details)</li>
              <li>Each property sets its own cancellation policy - review carefully before booking</li>
              <li>You authorize us to charge your payment method for all applicable fees</li>
            </ul>
          </section>

          {/* 5. Property Listings */}
          <section className="mb-8">
            <h2 className="m-0 mb-4 font-serif text-2xl font-semibold text-ink">5. Property Listings</h2>
            <ul className="list-disc space-y-2 pl-6 font-sans text-[15px] leading-relaxed text-taupe">
              <li>Owners must provide complete and accurate property details</li>
              <li>We reserve the right to remove any misleading or fraudulent listings</li>
              <li>Discriminatory rental practices based on race, religion, gender, etc. are strictly prohibited</li>
            </ul>
          </section>

          {/* 6. User Responsibilities */}
          <section className="mb-8">
            <h2 className="m-0 mb-4 font-serif text-2xl font-semibold text-ink">6. User Responsibilities</h2>
            <ul className="list-disc space-y-2 pl-6 font-sans text-[15px] leading-relaxed text-taupe">
              <li>Comply with all local rental laws and regulations</li>
              <li>Treat rented properties with care (you're responsible for any damages)</li>
              <li>Respect neighbors and community rules (no excessive noise, parties, etc.)</li>
            </ul>
          </section>

          {/* 7. Prohibited Activities */}
          <section className="mb-8">
            <h2 className="m-0 mb-4 font-serif text-2xl font-semibold text-ink">7. Prohibited Activities</h2>
            <ul className="list-disc space-y-2 pl-6 font-sans text-[15px] leading-relaxed text-taupe">
              <li>Spam, fraud, harassment, or illegal content</li>
              <li>Attempting to reverse engineer or scrape our platform</li>
              <li>Using Rentpy for unauthorized subletting or commercial activities without permission</li>
            </ul>
          </section>

          {/* 8. Liability Limitations */}
          <section className="mb-8">
            <h2 className="m-0 mb-4 font-serif text-2xl font-semibold text-ink">8. Liability Limitations</h2>
            <p className="mb-2 font-sans text-[15px] leading-relaxed text-taupe">Rentpy is not liable for:</p>
            <ul className="list-disc space-y-2 pl-6 font-sans text-[15px] leading-relaxed text-taupe">
              <li>Disputes between hosts and guests</li>
              <li>Property damages, injuries, or theft</li>
              <li>Temporary service interruptions or technical issues</li>
            </ul>
          </section>

          {/* 9. Termination */}
          <section className="mb-8">
            <h2 className="m-0 mb-4 font-serif text-2xl font-semibold text-ink">9. Termination</h2>
            <ul className="list-disc space-y-2 pl-6 font-sans text-[15px] leading-relaxed text-taupe">
              <li>We may suspend accounts violating these Terms</li>
              <li>You may delete your account anytime through settings</li>
            </ul>
          </section>

          {/* 10. Dispute Resolution */}
          <section className="mb-8">
            <h2 className="m-0 mb-4 font-serif text-2xl font-semibold text-ink">10. Dispute Resolution</h2>
            <ul className="list-disc space-y-2 pl-6 font-sans text-[15px] leading-relaxed text-taupe">
              <li>Users should attempt to resolve conflicts directly first</li>
              <li>These Terms are governed by the laws of India</li>
            </ul>
          </section>

          {/* 11. Changes to Terms */}
          <section className="mb-8">
            <h2 className="m-0 mb-4 font-serif text-2xl font-semibold text-ink">11. Changes to Terms</h2>
            <p className="m-0 font-sans text-[15px] leading-relaxed text-taupe">
              We may update these Terms periodically. The updated version will be posted here with a new effective date. Your continued use constitutes acceptance.
            </p>
          </section>

          {/* 12. Contact Information */}
          <section>
            <h2 className="m-0 mb-4 font-serif text-2xl font-semibold text-ink">12. Contact Information</h2>
            <p className="m-0 font-sans text-[15px] leading-relaxed text-taupe">
              For questions about these Terms: <br />
              <strong>Email:</strong> goutamchoudhary907@gmail.com <br />
              <strong>Address:</strong> Indore Madhya Pradesh
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};