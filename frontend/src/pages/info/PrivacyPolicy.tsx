// src/pages/PrivacyPolicy.tsx
import { Link } from "react-router-dom";

export const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-cream px-6 py-12">
      <div className="mx-auto mb-10 max-w-4xl text-center">
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-amber/15 bg-amber/8 px-3.5 py-1.5">
          <span className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-amber">
            Legal
          </span>
        </div>
        <h1 className="m-0 mb-3 font-serif text-[clamp(32px,5vw,48px)] font-semibold leading-[1.1] tracking-tight text-ink">
          Rentpy Privacy Policy
        </h1>
        <p className="m-0 font-sans text-sm text-taupe-light">
          Last updated: 20th December 2025
        </p>
      </div>

      <div className="mx-auto max-w-4xl rounded-3xl border border-cream-border bg-white p-6 sm:p-9">
        <div className="prose prose-sm sm:prose-base max-w-none">
          <p className="mb-6 font-sans text-[15px] leading-relaxed text-taupe">
            Your privacy is important to us. This Privacy Policy explains how Rentpy collects, uses, shares, 
            and protects your personal information when you use our platform.
          </p>

          <section className="mb-8">
            <h2 className="m-0 mb-4 font-serif text-2xl font-semibold text-ink">1. Information We Collect</h2>
            <ul className="mb-4 list-disc space-y-2 pl-6 font-sans text-[15px] leading-relaxed text-taupe">
              <li><strong>Account Information:</strong> Name, email, phone number, profile picture</li>
              <li><strong>Booking Details:</strong> Check-in/out dates, payment information, guest details</li>
              <li><strong>Property Data:</strong> Address, photos, amenities, pricing</li>
              <li><strong>Usage Data:</strong> IP address, device information, browsing activity</li>
              <li><strong>Communications:</strong> Messages with hosts/guests, support tickets</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="m-0 mb-4 font-serif text-2xl font-semibold text-ink">2. How We Use Your Data</h2>
            <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-cream-border bg-cream p-4">
                <h3 className="m-0 mb-1.5 font-sans text-sm font-bold text-ink">Service Operation</h3>
                <p className="m-0 font-sans text-[13px] leading-relaxed text-taupe">Facilitate bookings, process payments, and communicate</p>
              </div>
              <div className="rounded-2xl border border-cream-border bg-cream p-4">
                <h3 className="m-0 mb-1.5 font-sans text-sm font-bold text-ink">Improvements</h3>
                <p className="m-0 font-sans text-[13px] leading-relaxed text-taupe">Enhance user experience and develop new features</p>
              </div>
              <div className="rounded-2xl border border-cream-border bg-cream p-4">
                <h3 className="m-0 mb-1.5 font-sans text-sm font-bold text-ink">Security</h3>
                <p className="m-0 font-sans text-[13px] leading-relaxed text-taupe">Prevent fraud and unauthorized access</p>
              </div>
              <div className="rounded-2xl border border-cream-border bg-cream p-4">
                <h3 className="m-0 mb-1.5 font-sans text-sm font-bold text-ink">Legal Compliance</h3>
                <p className="m-0 font-sans text-[13px] leading-relaxed text-taupe">Meet regulatory requirements</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="m-0 mb-4 font-serif text-2xl font-semibold text-ink">3. Data Sharing</h2>
            <p className="mb-3 font-sans text-[15px] leading-relaxed text-taupe">We only share data when necessary:</p>
            <ul className="mb-4 list-disc space-y-2 pl-6 font-sans text-[15px] leading-relaxed text-taupe">
              <li><strong>Hosts/Guests:</strong> Basic booking details to facilitate reservations</li>
              <li><strong>Payment Processors:</strong> Razorpay (PCI-DSS compliant) for transactions</li>
              <li><strong>Service Providers:</strong> Cloud hosting, customer support, analytics</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect rights</li>
            </ul>
            <p className="m-0 font-sans text-[15px] leading-relaxed text-taupe">
              We <strong>never</strong> sell your personal data to third-party advertisers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="m-0 mb-4 font-serif text-2xl font-semibold text-ink">4. Payment Security</h2>
            <div className="mb-4 flex items-start gap-3 rounded-2xl border border-verified/15 bg-verified/8 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-verified/15">
                <svg className="h-4 w-4 text-verified" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="m-0 font-sans text-[15px] leading-relaxed text-taupe">
                  All payments are processed through <strong>Razorpay</strong>, a PCI-DSS compliant service. 
                  Rentpy never stores your full credit card details on our servers.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="m-0 mb-4 font-serif text-2xl font-semibold text-ink">5. Your Rights</h2>
            <ul className="mb-4 list-disc space-y-2 pl-6 font-sans text-[15px] leading-relaxed text-taupe">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update inaccurate information</li>
              <li><strong>Deletion:</strong> Remove your account data (where applicable)</li>
              <li><strong>Objection:</strong> Opt-out of marketing communications</li>
            </ul>
            <p className="m-0 font-sans text-[15px] leading-relaxed text-taupe">
              To exercise these rights, contact us at <Link to="/contact" className="font-semibold text-amber hover:text-amber-dark">our support center</Link>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="m-0 mb-4 font-serif text-2xl font-semibold text-ink">6. Policy Updates</h2>
            <p className="m-0 font-sans text-[15px] leading-relaxed text-taupe">
              We'll update this page if our policies change. The "Last updated" date at the top will reflect any revisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="m-0 mb-4 font-serif text-2xl font-semibold text-ink">7. Children's Privacy</h2>
            <p className="m-0 font-sans text-[15px] leading-relaxed text-taupe">
              Our services are not intended for users under 18. We do not knowingly collect data from children. 
              If we discover such collection, we will delete it immediately.
            </p>
          </section>

          <section>
            <h2 className="m-0 mb-4 font-serif text-2xl font-semibold text-ink">8. Contact Us</h2>
            <div className="rounded-2xl border border-cream-border bg-cream p-5">
              <p className="mb-2 font-sans text-[15px] leading-relaxed text-taupe"><strong>Email:</strong> goutamchoudhary907@gmail.com</p>
              <p className="mb-2 font-sans text-[15px] leading-relaxed text-taupe"><strong>Address:</strong>   Indore, Madhya Pradesh, India</p>
              <p className="m-0 font-sans text-[15px] leading-relaxed text-taupe"><strong>Phone:</strong> +91 96305 94507</p>
            </div>
            <p className="mt-6 text-center font-sans text-[13px] text-taupe-light">
              © {new Date().getFullYear()} Rentpy. All rights reserved.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};