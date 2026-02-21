"use client";
import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Trash2, HeartPulse, ShieldCheck, Users, Activity } from "lucide-react";

export default function AboutPage() {

  useEffect(() => {
    const particles = document.querySelectorAll(".particle");
    let angle = 0;
    const rotateParticles = () => {
      angle += 0.002;
      particles.forEach((p, i) => {
        const radius = 100 + i * 20;
        const x = Math.cos(angle + i) * radius;
        const y = Math.sin(angle + i) * radius;
        p.style.transform = `translate(${x}px, ${y}px)`;
      });
      requestAnimationFrame(rotateParticles);
    };
    rotateParticles();
  }, []);

  return (
    <>
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-20 md:pt-24 lg:pt-28 min-h-[85vh] flex items-center bg-gradient-to-br from-green-900 via-green-800 to-emerald-700 text-white">

        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* LEFT CONTENT */}
            <div className="text-center md:text-left">
              <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                Smart city, Resolve
                <span className="block text-2xll text-emerald-300 mt-2">
                  Instantly & Easily
                </span>
              </h1>

              <p className="mt-5 text-sm sm:text-base md:text-lg text-green-100 max-w-xl mx-auto md:mx-0">
                Locate trusted medical services near you with real-time accuracy.
                Get fast access during emergencies when every second truly matters.
              </p>

              {/* BUTTONS */}
              <div className="mt-8 flex justify-center md:justify-start gap-4 flex-nowrap">
                <Link href="/smartRoute">
                  <button className="px-6 sm:px-7 py-2.5 sm:py-3 bg-white text-green-800 text-sm sm:text-base font-semibold rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition duration-300 whitespace-nowrap">
                    Get Started
                  </button>
                </Link>

                <Link href="/profile">
                  <button className="px-6 sm:px-7 py-2.5 sm:py-3 border border-white/70 text-sm sm:text-base font-semibold rounded-lg hover:bg-white hover:text-green-800 transition duration-300 whitespace-nowrap">
                    View Profile
                  </button>
                </Link>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="flex justify-center md:justify-end">
              <Image
                src="/city.png"
                alt="Smart City"
                width={520}
                height={520}
                priority
                className="w-64 rounded-3xl w-[500px]  md:w-[420px] lg:w-[480px] object-contain drop-shadow-2xl"
              />
            </div>

          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="bg-gradient-to-b from-green-50 via-white to-green-50 py-24 sm:py-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-900 mb-4">
            Our Smart Features
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Complete city management solution with navigation, sanitation reporting, and emergency services.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 grid md:grid-cols-3 gap-8 lg:gap-12">
          {[
            {
              title: "Smart Route Planner",
              desc: "AI-driven route suggestions with safety-first routing and traffic-aware navigation.",
              icon: <MapPin size={42} className="text-emerald-600 mb-4" />,
              image: "/route-demo.png",
            },
            {
              title: "Garbage Reporting",
              desc: "Snap photos of overflowing bins and notify authorities instantly.",
              icon: <Trash2 size={42} className="text-yellow-500 mb-4" />,
              image: "/garbage-demo.png",
            },
            {
              title: "Medical Assistance",
              desc: "Locate nearby hospitals and medical services instantly.",
              icon: <HeartPulse size={42} className="text-red-500 mb-4" />,
              image: "/medical-demo.png",
            },
          ].map((feature, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition duration-300 text-center">
              <div className="flex justify-center">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600 text-sm sm:text-base mb-5">{feature.desc}</p>
              <Image
                src={feature.image}
                alt={feature.title}
                width={320}
                height={200}
                className="rounded-xl mx-auto object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="bg-green-900 py-20 sm:py-24 text-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-10 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {[
            { value: "10K+", label: "Active Users", icon: <Users size={34} className="mx-auto mb-3 text-emerald-300" /> },
            { value: "120K+", label: "Routes Analyzed", icon: <Activity size={34} className="mx-auto mb-3 text-emerald-300" /> },
            { value: "5K+", label: "Garbage Reports", icon: <Trash2 size={34} className="mx-auto mb-3 text-yellow-400" /> },
            { value: "24/7", label: "Emergency Support", icon: <HeartPulse size={34} className="mx-auto mb-3 text-red-400" /> },
          ].map((stat, i) => (
            <div key={i}>
              {stat.icon}
              <h3 className="text-2xl sm:text-3xl font-bold">{stat.value}</h3>
              <p className="text-green-200 text-sm sm:text-base">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CORE PRINCIPLES ================= */}
      <section className="bg-white py-24 sm:py-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 text-center mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-900 mb-4">
            Our Core Principles
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Safety, community engagement, and AI-driven intelligence guide our platform.
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-10 grid md:grid-cols-3 gap-8">
          {[
            { title: "Safety First", desc: "Maximizing safety in every route and alert.", icon: <ShieldCheck size={32} className="text-emerald-600 mb-3" /> },
            { title: "Community Driven", desc: "Citizen participation improves sanitation & safety.", icon: <Users size={32} className="text-emerald-600 mb-3" /> },
            { title: "AI Intelligence", desc: "Data-powered insights optimize routes & emergency response.", icon: <Activity size={32} className="text-emerald-600 mb-3" /> },
          ].map((item, i) => (
            <div key={i} className="bg-green-50 rounded-xl p-8 shadow-md hover:shadow-lg transition duration-300 text-center">
              <div className="flex justify-center">{item.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm sm:text-base">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-gradient-to-r from-green-800 to-emerald-600 text-white py-20 sm:py-24 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5">
            Empowering Smarter Cities
          </h2>
          <p className="text-green-100 text-sm sm:text-base md:text-lg mb-8">
            Safe Route Analyzer helps citizens and municipalities act in real-time for safer, cleaner, and healthier urban living.
          </p>

          <Link href="/smartRoute">
            <button className="bg-white text-green-800 px-8 sm:px-10 py-3 rounded-lg font-semibold shadow-md hover:shadow-xl hover:scale-105 transition duration-300">
              Get Started 🚀
            </button>
          </Link>
        </div>
      </section>

    </>
  );
}
