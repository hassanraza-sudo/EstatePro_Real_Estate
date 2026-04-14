import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <section
        className="relative h-72 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg)",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60" />
        <div className="relative h-full flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-serif  text-white z-10">
            Contact Us
          </h1>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 bg-slate-300 ">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3 text-center">
            {[
              {
                icon: (
                  <Phone className="mx-auto text-blue-700 mb-5" size={32} />
                ),
                title: "Phone",
                value: "+923012345678",
              },
              {
                icon: <Mail className="mx-auto text-blue-700 mb-5" size={32} />,
                title: "Email",
                value: "info@estaepro.com",
              },
              {
                icon: (
                  <MapPin className="mx-auto text-blue-700 mb-5" size={32} />
                ),
                title: "Location",
                value: "Sindh, Pakistan",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-teal-100 rounded-xl p-6 shadow-md hover:shadow-lg transition"
              >
                {item.icon}
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-gray-600 mt-2">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-16 bg-slate-300">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12">
          {/* Form */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Message
                </label>
                <textarea
                  rows="5"
                  placeholder="Type your message here..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto bg-sky-600 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-sky-900 transition"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Map */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Location</h2>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <iframe
                title="Google Map"
                width="100%"
                height="350"
                frameBorder="0"
                style={{ border: 0 }}
                src="https://maps.google.com/maps?q=bhiria%20city&t=&z=13&ie=UTF8&iwloc=&output=embed"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
