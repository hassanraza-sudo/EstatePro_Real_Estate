import React from "react";
import { Building, Users, ShieldCheck, Globe } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <section
        className="relative h-80 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60" />
        <div className="relative h-full flex items-center justify-center text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-white z-10">
            About Us
          </h1>
        </div>
      </section>

      {/* About Company */}
      <section className="py-16 bg-slate-300">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold mb-4">Who We Are</h2>
          <p className="text-lg text-gray-600 leading-relaxed font-serif">
            We are a team of dedicated real estate professionals helping you
            find the perfect property. Whether you're buying, selling, or
            renting — we bring experience, care, and technology every step of
            the way.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-slate-300">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3 text-center">
            {[
              {
                icon: <ShieldCheck className="mx-auto h-10 w-10  text-cyan-800 mb-4" />,
                title: "Trusted Experts",
                text: "Known for transparency and professionalism in every transaction.",
              },
              {
                icon: <Globe className="mx-auto h-10 w-10 text-cyan-800 mb-4" />,
                title: "Global Reach",
                text: "We connect buyers and sellers across cities, countries, and borders.",
              },
              {
                icon: <Users className="mx-auto h-10 w-10 text-cyan-800 mb-4" />,
                title: "Customer Focused",
                text: "We listen, advise, and support to ensure a smooth property experience.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-gray-100 p-6 rounded-xl shadow-md hover:shadow-xl transition"
              >
                {item.icon}
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-300">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-3xl font-bold mb-10">Our Impact</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              { value: "500+", label: "Properties Sold" },
              { value: "300+", label: "Happy Clients" },
              { value: "15", label: "Years Experience" },
              { value: "24/7", label: "Support" },
            ].map((stat, idx) => (
              <div key={idx}>
                <h3 className="text-4xl font-bold text-cyan-800">{stat.value}</h3>
                <p className="text-gray-700 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-cyan-800 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Start Your Real Estate Journey?
          </h2>
          <p className="text-lg mb-6">
            Let our experienced team guide you toward your dream property.
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-slate-800 px-6 py-3 rounded-lg font-semibold shadow hover:bg-gray-100 transition"
          >
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;
