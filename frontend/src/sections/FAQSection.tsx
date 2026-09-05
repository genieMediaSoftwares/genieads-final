import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: 'How does GenieAds connect to my accounts?',
      answer:
        'GenieAds connects via official, read-only OAuth integrations with Meta (Instagram & Facebook Ads) and Google Ads. It takes under 60 seconds, requires zero technical code, and never accesses your passwords or alters your live campaigns without your explicit approval.',
    },
    {
      question: 'What makes GenieAds different from standard ad managers?',
      answer:
        'Ad managers like Meta and Google show walls of raw numbers (impressions, CTR, CPM) but fail to explain why an ad failed or what creative hook to film next. GenieAds correlates organic attention with paid conversion data to deliver plain-English daily actions ranked by revenue impact.',
    },
    {
      question: 'How quickly will I receive my first insights?',
      answer:
        'Within 3 minutes of connecting your profiles, GenieAds audits your previous 90 days of organic posts and ad spend, calculates your live Growth Score, identifies creative hook retention trends, and gives you your first set of prioritized growth moves.',
    },
    {
      question: 'Can I cancel or switch my plan at any time?',
      answer:
        'Yes. All self-serve plans are billed month-to-month with no long-term lock-in or cancellation fees. You can upgrade, downgrade, or cancel anytime directly from your dashboard.',
    },
    {
      question: 'What is the Zero → Hero Managed Growth plan?',
      answer:
        'Zero → Hero is our full hands-on managed execution tier for high-growth brands. Our in-house team of creative directors, video editors, and performance media buyers handles your scripting, shooting, editing, and paid ad management powered by GenieAds data.',
    },
  ];

  return (
    <section id="faq" className="py-20 sm:py-24 relative overflow-hidden bg-[#FAF6E8] border-t border-[#E8DEB7]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="FREQUENTLY ASKED QUESTIONS"
          title="Clear answers to common questions."
          subtitle="Everything you need to know about connecting accounts, data privacy, and how GenieAds drives revenue."
        />

        <div className="mt-12 space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-[#FFFFFF] border border-[#E8DEB7] rounded-2xl overflow-hidden shadow-2xs transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-[#2A1A18]">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? 'bg-[#8B2626] text-white rotate-180'
                        : 'bg-[#FAF6E8] text-[#6A5652] border border-[#E8DEB7]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0 text-xs sm:text-sm text-[#6A5652] leading-relaxed border-t border-[#FAF6E8]">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
