"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const faqData: FaqItem[] = [
  {
    question: "What is Layerex?",
    answer:
      "Layerex is a technology-driven ecosystem that leverages AI and advanced infrastructure to enable efficient fintech solutions including lending, SaaS deployment, IoT and smart-city projects.",
  },
  {
    question: "How does Layerex’s platform work?",
    answer:
      "The platform integrates modules such as AI-powered analytics (“Layerex Brain”), fintech lending, cloud infrastructure, smart-city IoT applications and enterprise CRM/ERP solutions to deliver scalable services.",
  },
  {
    question: "What distinguishes Layerex from other fintech/tech-platform companies?",
    answer:
      "Layerex offers a multi-layer ecosystem combining cloud servers, smart city IoT, AI cyber-defense, business automation, and fintech lending in one unified offering — making it broader than many single-focus players.",
  },
  {
    question: "Is my data safe with Layerex?",
    answer:
      "Yes — Layerex emphasises security and transparency, with architecture designed to protect user data, support compliance and provide audit-friendly operations.",
  },
  {
    question: "How do I get started with Layerex’s services?",
    answer:
      "You can reach out via the contact form, helpdesk or live chat on the website to discuss your needs (e.g., fintech lending module, smart-city IoT deployment, CRM/ERP integration) and receive a customised proposal.",
  },
  {
    question: "How does Layerex ensure transparency and trust?",
    answer:
      "The ecosystem emphasises real-time analytics, audit trails, secure cloud infrastructure, and clear documentation for clients — building in transparency at every layer.",
  },
  {
    question: "What kinds of returns or benefits can a client expect?",
    answer:
      "While returns will vary depending on the project scope, clients typically benefit from improved automation, reduced operational cost, faster time-to-market, enhanced data-driven decision-making and scalable infrastructure.",
  },
  // 8th one remains exactly as original
  {
    question: "What projects are driving the Layerex ecosystem?",
    answer:
      "Layerex is developing and managing multiple high-impact solutions:\n\n• LayraERP – A next-gen ERP + CRM system\n• Agentic AI – Smart AI-powered call center and agent system\n• AI Cloud Server Network – Secure AI hosting ecosystem\n• AI Cyber Defense Shield – Advanced security protection system\n• Smart City IoT Platform – Connecting urban infrastructure through AI\n\nThese projects generate sustainable business income to support the staking ecosystem.",
  },
  {
    question: "Can I integrate Layerex solutions with my existing systems?",
    answer:
      "Yes — Layerex’s modules (cloud servers, CRM/ERP, automation) are designed to work with existing enterprise systems, making integration feasible and enabling incremental expansion.",
  },
  {
    question: "What support and service options does Layerex provide after project launch?",
    answer:
      "Post-launch, Layerex provides ongoing support via helpdesk, updates to modules, monitoring/maintenance services for cloud and IoT deployments, and consulting to help you scale.",
  },
];


const FaqSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="max-w-3xl mx-auto my-12 px-4">
      <h2 className="text-3xl font-bold text-center mb-8 text-slate-200">
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {faqData.map((faq, index) => (
          <div
            key={index}
            className="border border-[#ffc428] rounded-xl shadow-sm"
          >
            <button
              className="flex justify-between items-center w-full px-5 py-4 text-left text-slate-200 font-medium focus:outline-none"
              onClick={() => toggleAccordion(index)}
            >
              <span>{faq.question}</span>
              <ChevronDown
                className={`transition-transform duration-300 ${
                  activeIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {activeIndex === index && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="px-5 pb-4 text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FaqSection;
