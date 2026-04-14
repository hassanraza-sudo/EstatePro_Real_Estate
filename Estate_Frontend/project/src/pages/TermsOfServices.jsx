import React from "react";
import { FileText } from "lucide-react";

const TermsOfService = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-gray-800 dark:text-gray-100">
      {/* Hero */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute -top-20 -left-20 h-80 w-80 bg-green-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 bg-yellow-400/20 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center px-4 text-center">
          <FileText className="h-12 w-12 text-green-600 mb-4" />
          <h1 className="text-5xl font-extrabold tracking-tight text-green-700 dark:text-green-400 mb-3">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
            Please read our terms carefully before using <strong>EstatePro</strong>. By accessing our
            site, you agree to these conditions.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 pb-24">
        <article className="prose lg:prose-lg prose-green dark:prose-invert max-w-4xl mx-auto bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 md:p-12 ring-1 ring-black/5 dark:ring-white/10">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By using EstatePro’s services, you confirm that you agree to comply with and be
            bound by these Terms of Service. If you do not agree, please do not use our site.
          </p>

          <h2>2. Use of the Website</h2>
          <ul>
            <li>Users must be at least 18 years of age to use this website.</li>
            <li>You agree to provide accurate and complete information when registering or submitting property details.</li>
            <li>Unauthorized or illegal use of the website may result in termination of your access.</li>
          </ul>

          <h2>3. Intellectual Property</h2>
          <p>
            All content, trademarks, logos, and data on EstatePro are the intellectual property
            of their respective owners. You may not reproduce, distribute, or modify any
            content without written permission.
          </p>

          <h2>4. Limitation of Liability</h2>
          <p>
            EstatePro is not liable for any damages resulting from the use or inability to use
            the service, including but not limited to indirect or consequential losses.
          </p>

          <h2>5. Third-Party Links</h2>
          <p>
            Our website may contain links to external websites. We do not control these
            third-party sites and are not responsible for their content or privacy practices.
          </p>

          <h2>6. Termination</h2>
          <p>
            We reserve the right to suspend or terminate access to EstatePro at any time,
            without notice, for violations of these terms or any applicable laws.
          </p>

          <h2>7. Governing Law</h2>
          <p>
            These terms are governed by and construed in accordance with the laws of your
            jurisdiction.
          </p>

          <h2>8. Changes to Terms</h2>
          <p>
            EstatePro may update these Terms of Service at any time. Changes will be posted
            on this page with an updated revision date.
          </p>

          <h2>9. Contact</h2>
          <p>
            For questions or concerns about our Terms of Service, please contact us at:
          </p>
          <p>
            <strong>Email:</strong> support@estatepro.com<br />
            <strong>Phone:</strong> +1 800 123 4567<br />
            <strong>Address:</strong> 123 Real Estate Lane, Property City, PC 45678
          </p>
        </article>
      </section>
    </main>
  );
};

export default TermsOfService;
