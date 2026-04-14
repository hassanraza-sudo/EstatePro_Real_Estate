 import React from "react";
import { Network as SitemapIcon } from "lucide-react";
import { Link } from "react-router-dom";

const Sitemap = () => {
  const sections = [
    {
      title: "Main Pages",
      links: [
        { name: "Home", path: "/" },
        { name: "Properties", path: "/properties" },
        { name: "About Us", path: "/about" },
        { name: "Contact", path: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", path: "/privacy-policy" },
        { name: "Terms of Service", path: "/terms-of-service" },
      ],
    },
    {
      title: "User Access",
      links: [
        { name: "Login", path: "/login" },
        { name: "Register", path: "/register" },
        { name: "Admin Dashboard", path: "/admin" },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-gray-800 dark:text-gray-100">
      {/* Hero */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute -top-20 -left-20 h-80 w-80 bg-indigo-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 bg-pink-400/20 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center px-4 text-center">
          <SitemapIcon className="h-12 w-12 text-indigo-600 mb-4" />
          <h1 className="text-5xl font-extrabold tracking-tight text-indigo-700 dark:text-indigo-400 mb-3">
            Sitemap
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
            Quickly navigate through all major sections of the <strong>EstatePro</strong> platform.
          </p>
        </div>
      </section>

      {/* Sitemap Links */}
      <section className="px-4 pb-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {sections.map((section, idx) => (
            <div
              key={idx}
              className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm shadow-md rounded-2xl p-6 ring-1 ring-black/5 dark:ring-white/10"
            >
              <h2 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 mb-4">
                {section.title}
              </h2>
              <ul className="space-y-2">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <Link
                      to={link.path}
                      className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Sitemap;
