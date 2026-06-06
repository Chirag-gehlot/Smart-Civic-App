import React, { useState, useEffect, useCallback } from "react";
import { Lock, Shield, Bell } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";

// All features
const features = [
  {
    title: "Blockchain E-Voting",
    description:
      "Participate in transparent and tamper-proof elections using blockchain technology. View candidates and cast your vote securely.",
    status: "ACTIVE",
    link: "e-voting", // ✅ no leading slash for HashRouter
    icon: Lock,
    color: "bg-indigo-600",
    bgLight: "bg-indigo-50",
  },
  {
    title: "AI Fraud Detection",
    description:
      "Leverage artificial intelligence to detect suspicious activity and prevent fraudulent transactions in real-time.",
    status: "COMING SOON",
    icon: Shield,
    color: "bg-teal-600",
    bgLight: "bg-teal-50",
  },
  {
    title: "Law Chatbot",
    description:
      "Get instant legal assistance through an AI-powered chatbot that answers queries and provides insights on legal processes.",
    status: "ACTIVE",
    link: "chatbot",
    icon: Bell,
    color: "bg-amber-600",
    bgLight: "bg-amber-50",
  },
  {
    title: "Safety Alerts",
    description:
      "Receive instant notifications about nearby emergencies or public safety issues, ensuring rapid awareness and response.",
    status: "COMING SOON",
    icon: Bell,
    color: "bg-slate-600",
    bgLight: "bg-slate-50",
  },
];

export default function HomePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % features.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + features.length) % features.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      {/* Hero Carousel Section */}
      <section className="relative w-full overflow-hidden bg-white mt-4 mx-4 md:mx-8 rounded-[2rem] shadow-sm border border-slate-100 px-6 py-24 md:py-32 flex flex-col justify-center min-h-[600px] xl:min-h-[700px]">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-50 pointer-events-none"></div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center space-y-8 z-10 w-full max-w-4xl mx-auto">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div
                className={`p-5 rounded-2xl ${features[currentIndex].bgLight} shadow-sm border border-slate-100 ring-4 ring-white/60 inline-flex`}>
                {React.createElement(features[currentIndex].icon, {
                  size: 44,
                  className: features[currentIndex].color.replace(
                    "bg-",
                    "text-"
                  ),
                })}
              </div>
            </div>

            {/* Title + Description */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] drop-shadow-sm">
              {features[currentIndex].title}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl max-w-2xl mx-auto text-slate-500 font-medium leading-relaxed">
              {features[currentIndex].description}
            </p>

            {/* Button */}
            <div className="pt-8 flex justify-center gap-4">
              {features[currentIndex].status === "ACTIVE" ? (
                <Button
                  size="lg"
                  className="rounded-full bg-slate-900 text-white hover:bg-slate-800 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl font-semibold px-10 py-6 text-lg"
                  onClick={() => navigate(`/${features[currentIndex].link}`)}>
                  Explore Now
                </Button>
              ) : (
                <Button
                  size="lg"
                  disabled
                  className="rounded-full bg-slate-100 text-slate-400 opacity-80 cursor-not-allowed font-semibold px-10 py-6 text-lg border border-slate-200">
                  Coming Soon
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Navigation */}
        <button
          onClick={prevSlide}
          className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-md hover:bg-white text-slate-600 p-4 mx-2 rounded-full border border-slate-200 shadow-sm transition-all hover:scale-110 active:scale-95 z-20"
          aria-label="Previous slide">
          ‹
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-md hover:bg-white text-slate-600 p-4 mx-2 rounded-full border border-slate-200 shadow-sm transition-all hover:scale-110 active:scale-95 z-20"
          aria-label="Next slide">
          ›
        </button>

        {/* Dots */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-slate-900 w-10"
                  : "bg-slate-300 w-3 hover:bg-slate-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-24 px-6 md:px-12 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Features Overview
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg md:text-xl font-medium">
              Discover the tools we've built to enhance civic participation and safety.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const card = (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-8 bg-white border border-slate-100 shadow-sm hover:shadow-xl rounded-[2rem] transition-all duration-300 flex flex-col h-full group cursor-pointer lg:hover:-translate-y-2">
                  <div
                    className={`inline-flex p-4 rounded-2xl ${feature.bgLight} mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 self-start`}>
                    {React.createElement(feature.icon, {
                      size: 28,
                      className: feature.color.replace("bg-", "text-"),
                    })}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed mb-8 flex-grow font-medium">
                    {feature.description}
                  </p>
                  <div className="mt-auto">
                    <span
                      className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase ${
                        feature.status === "ACTIVE"
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-400"
                      }`}>
                      {feature.status === "ACTIVE" ? (
                        <>
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                          Available Now
                        </>
                      ) : (
                        feature.status
                      )}
                    </span>
                  </div>
                </motion.div>
              );

              return feature.status === "ACTIVE" ? (
                <Link
                  key={index}
                  to={`/${feature.link}`}
                  className="block h-full outline-none focus-visible:ring-4 focus-visible:ring-indigo-100 rounded-[2rem]">
                  {card}
                </Link>
              ) : (
                <div key={index} className="h-full opacity-90">
                  {card}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
