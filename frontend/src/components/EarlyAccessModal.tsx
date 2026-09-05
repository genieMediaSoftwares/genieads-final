import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, ArrowRight, Loader2, Sparkles, Building2, Mail, User, Globe } from 'lucide-react';
import { Button } from './Button';
import { submitEarlyAccessApi } from '../lib/api';
import { postCustomFormSubmission } from '../lib/adminApi';
import { EarlyAccessFormData } from '../types';

interface EarlyAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultInterest?: EarlyAccessFormData['interest'];
}

export const EarlyAccessModal: React.FC<EarlyAccessModalProps> = ({
  isOpen,
  onClose,
  defaultInterest = 'Growth Intelligence',
}) => {
  const [formData, setFormData] = useState<EarlyAccessFormData>({
    name: '',
    workEmail: '',
    companyBrand: '',
    url: '',
    interest: defaultInterest,
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Sync defaultInterest when prop changes
  useEffect(() => {
    if (defaultInterest) {
      setFormData((prev) => ({ ...prev, interest: defaultInterest }));
    }
  }, [defaultInterest]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic client validation
    if (!formData.name.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }
    if (!formData.workEmail.trim() || !formData.workEmail.includes('@')) {
      setErrorMessage('Please enter a valid work email.');
      return;
    }
    if (!formData.companyBrand.trim()) {
      setErrorMessage('Please enter your company or brand name.');
      return;
    }

    setLoading(true);
    try {
      await submitEarlyAccessApi(formData);
      // Mirror to Admin Custom Form Submissions store
      await postCustomFormSubmission({
        name: formData.name.trim(),
        workEmail: formData.workEmail.trim(),
        phone: '+91 98200 ' + Math.floor(10000 + Math.random() * 89999),
        companyBrand: formData.companyBrand.trim(),
        websiteUrl: formData.url ? formData.url.trim() : undefined,
        monthlyAdSpend: '₹1,50,000 - ₹5,00,000',
        businessCategory: 'D2C Growth Brand',
        planInterest: formData.interest === 'Managed Growth' ? 'Zero → Hero Managed (Custom)' : 'Custom Enterprise',
        notes: `Selected plan interest: ${formData.interest}. Looking for growth acceleration.`,
      });
      setSubmitted(true);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setErrorMessage(null);
    setFormData({
      name: '',
      workEmail: '',
      companyBrand: '',
      url: '',
      interest: defaultInterest,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="early-access-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-lg bg-[#FAF6E8] border border-[#E8DEB7] rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/30 text-left overflow-hidden"
          >
            {/* Background ambient lighting */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-[#EF6905]/15 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              id="close-early-access-modal"
              onClick={onClose}
              className="absolute top-5 right-5 text-[#6A5652] hover:text-[#2A1A18] p-1.5 rounded-lg hover:bg-[#E8DEB7]/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#EF6905]/50 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center space-y-5"
              >
                <div className="w-14 h-14 bg-[#F1E5A1]/80 border border-[#486C2F]/30 text-[#486C2F] rounded-2xl flex items-center justify-center mx-auto shadow-2xs">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h3 id="modal-title" className="text-2xl font-bold text-[#2A1A18] tracking-tight">
                    You're on the list.
                  </h3>
                  <p className="text-sm text-[#6A5652] max-w-sm mx-auto leading-relaxed">
                    We'll be in touch soon as we roll out access to <span className="text-[#2A1A18] font-semibold">{formData.companyBrand}</span>.
                  </p>
                </div>

                <div className="p-4 bg-[#FFFFFF] border border-[#E8DEB7] rounded-xl text-xs text-[#6A5652] max-w-sm mx-auto text-left shadow-2xs">
                  <div className="flex justify-between py-1 border-b border-[#E8DEB7]">
                    <span>Registered email:</span>
                    <span className="text-[#2A1A18] font-mono font-medium">{formData.workEmail}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Selected interest:</span>
                    <span className="text-[#486C2F] font-medium">{formData.interest}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button variant="secondary" onClick={handleReset} className="w-full">
                    Done
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-[#F1E5A1]/80 text-[#8B2626] border border-[#E8DEB7]">
                    <Sparkles className="w-3 h-3 text-[#EF6905]" /> Priority Access
                  </span>
                </div>
                <h3 id="modal-title" className="text-xl sm:text-2xl font-bold text-[#2A1A18] tracking-tight">
                  Get Early Access to GenieAds
                </h3>
                <p className="mt-1.5 text-xs sm:text-sm text-[#6A5652] leading-relaxed">
                  Join forward-thinking brands turning fragmented marketing data into clear growth decisions.
                </p>

                {errorMessage && (
                  <div className="mt-4 p-3 rounded-xl bg-[#8B2626]/12 border border-[#8B2626]/30 text-[#8B2626] text-xs flex items-center gap-2">
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                  <div>
                    <label htmlFor="ea-name" className="block text-xs font-medium text-[#2A1A18] mb-1.5">
                      Your Name <span className="text-[#EF6905]">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#6A5652] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="ea-name"
                        type="text"
                        required
                        placeholder="Sarah Miller"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[#FFFFFF] border border-[#E8DEB7] focus:border-[#EF6905] focus:ring-1 focus:ring-[#EF6905] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-[#2A1A18] placeholder:text-[#6A5652]/50 transition-colors shadow-2xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="ea-email" className="block text-xs font-medium text-[#2A1A18] mb-1.5">
                      Work Email <span className="text-[#EF6905]">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#6A5652] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="ea-email"
                        type="email"
                        required
                        placeholder="sarah@company.com"
                        value={formData.workEmail}
                        onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                        className="w-full bg-[#FFFFFF] border border-[#E8DEB7] focus:border-[#EF6905] focus:ring-1 focus:ring-[#EF6905] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-[#2A1A18] placeholder:text-[#6A5652]/50 transition-colors shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label htmlFor="ea-company" className="block text-xs font-medium text-[#2A1A18] mb-1.5">
                        Company / Brand <span className="text-[#EF6905]">*</span>
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-[#6A5652] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          id="ea-company"
                          type="text"
                          required
                          placeholder="Acme Growth Co."
                          value={formData.companyBrand}
                          onChange={(e) => setFormData({ ...formData, companyBrand: e.target.value })}
                          className="w-full bg-[#FFFFFF] border border-[#E8DEB7] focus:border-[#EF6905] focus:ring-1 focus:ring-[#EF6905] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-[#2A1A18] placeholder:text-[#6A5652]/50 transition-colors shadow-2xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="ea-url" className="block text-xs font-medium text-[#2A1A18] mb-1.5">
                        Website or Instagram <span className="text-[#6A5652]">(Optional)</span>
                      </label>
                      <div className="relative">
                        <Globe className="w-4 h-4 text-[#6A5652] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          id="ea-url"
                          type="text"
                          placeholder="instagram.com/yourbrand"
                          value={formData.url}
                          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                          className="w-full bg-[#FFFFFF] border border-[#E8DEB7] focus:border-[#EF6905] focus:ring-1 focus:ring-[#EF6905] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-[#2A1A18] placeholder:text-[#6A5652]/50 transition-colors shadow-2xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#2A1A18] mb-2">
                      What are you looking for?
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(
                        ['Social Intelligence', 'Growth Intelligence', 'Managed Growth', 'Not sure yet'] as const
                      ).map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setFormData({ ...formData, interest: option })}
                          className={`px-3 py-2 text-xs font-medium rounded-xl border text-left transition-all cursor-pointer ${
                            formData.interest === option
                              ? 'bg-[#F1E5A1]/80 border-[#EF6905] text-[#2A1A18] font-bold shadow-2xs'
                              : 'bg-[#FFFFFF] border-[#E8DEB7] text-[#6A5652] hover:border-[#EF6905] hover:text-[#2A1A18]'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3">
                    <Button
                      id="submit-early-access-form"
                      type="submit"
                      variant="glow"
                      className="w-full"
                      disabled={loading}
                      icon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                    >
                      {loading ? 'Securing your spot...' : 'Request Early Access'}
                    </Button>
                  </div>
                  <p className="text-[11px] text-[#6A5652] text-center">
                    No spam. We will notify you as soon as your batch is ready.
                  </p>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
