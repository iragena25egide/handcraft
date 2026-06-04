"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Interior Designer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    text: "The Imigongo art panels I ordered completely transformed my client's living room. The craftsmanship is breathtaking and the shipping was surprisingly fast.",
    rating: 5,
  },
  {
    id: 2,
    name: "David Ndizeye",
    role: "Local Buyer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    text: "I bought a Kitenge jacket and the quality of the fabric is exceptional. It's my go-to piece for special occasions now. Highly recommend!",
    rating: 5,
  },
  {
    id: 3,
    name: "Elena Rossi",
    role: "Art Collector",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    text: "The Agaseke peace basket is a beautiful symbol of Rwandan culture. It sits proudly on my shelf. The purchasing process was incredibly smooth.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-[#fefce8] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#fbbf24] opacity-5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#0f172a] opacity-5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-xs font-black uppercase tracking-widest text-[#0f172a] mb-6 shadow-sm border border-gray-100"
          >
            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
            Loved by Customers
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-[#0f172a] tracking-tight"
          >
            Don't just take our word for it
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="bg-white p-8 rounded-[32px] shadow-xl shadow-gray-200/40 relative border border-gray-50 group hover:-translate-y-2 transition-transform duration-500"
            >
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#0f172a] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                <Quote className="w-5 h-5" />
              </div>
              
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              
              <p className="text-gray-600 mb-8 text-lg leading-relaxed font-medium">
                "{testimonial.text}"
              </p>
              
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 ring-2 ring-gray-50">
                  <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0f172a]">{testimonial.name}</h4>
                  <p className="text-sm font-medium text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
