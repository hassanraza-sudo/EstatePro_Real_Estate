import React from "react";
import { ShieldCheck } from "lucide-react";

/**
 * PrivacyPolicy – polished, responsive page ✨
 * ------------------------------------------------
 * • Decorative hero section with gradient & icon
 * • Prose typography for comfortable reading
 * • Smooth scroll-to-top button (optional future)
 */
const PrivacyPolicy = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-gray-800 dark:text-gray-100">
      {/* Hero */}
      <section className="relative overflow-hidden py-20">
        {/* Gradient blob */}
        <div className="absolute -top-20 -left-20 h-80 w-80 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 bg-purple-400/20 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center px-4 text-center">
          <ShieldCheck className="h-12 w-12 text-blue-600 mb-4" />
          <h1 className="text-5xl font-extrabold tracking-tight text-blue-700 dark:text-blue-400 mb-3">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
            Your trust matters. Learn how <strong>EstatePro</strong> collects, uses, and safeguards
            your data every step of the way.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 pb-24">
        <article className="prose lg:prose-lg prose-blue dark:prose-invert max-w-4xl mx-auto bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 md:p-12 ring-1 ring-black/5 dark:ring-white/10">
          <h2>1. Information We Collect</h2>
          <ul>
            <li>Personal identification information (name, email address, phone number, etc.).</li>
            <li>Property preferences and search filters.</li>
            <li>Usage data (pages visited, time on site, etc.).</li>
            <li>Location data (when permitted by your device/browser).</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>Provide and maintain our real‑estate listing services.</li>
            <li>Personalize your experience and property recommendations.</li>
            <li>Communicate updates, offers, or support.</li>
            <li>Improve website functionality and user experience.</li>
          </ul>

          <h2>3. Cookies & Tracking Technologies</h2>
          <p>
            We use cookies to enhance browsing, analyze traffic, and understand user
            behavior. You can disable cookies in your browser settings, though some
            features may not function optimally.
          </p>

          <h2>4. Sharing Your Information</h2>
          <p>
            We do <strong>not</strong> sell, trade, or rent personal data. We may share information with
            trusted partners under strict confidentiality to operate our services.
          </p>

          <h2>5. Data Security</h2>
          <p>
            We apply industry‑standard measures to secure your data. However, please note
            no internet transmission is 100 % secure, and absolute protection cannot be
            guaranteed.
          </p>

          <h2>6. Your Privacy Rights</h2>
          <p>
            You may access, update, or delete your personal data at any time. Simply reach
            out using the contact details below.
          </p>

          <h2>7. Policy Updates</h2>
          <p>
            We may revise this policy periodically. Please revisit this page to stay
            informed of any changes.
          </p>

          <h2>8. Contact Us</h2>
          <p>
            <strong>Email:</strong> support@estatepro.com<br />
            <strong>Phone:</strong> +1&nbsp;800&nbsp;123&nbsp;4567<br />
            <strong>Address:</strong> 123 Real Estate Lane, Property City, PC 45678
          </p>
        </article>
      </section>
    </main>
  );
};

export default PrivacyPolicy;
