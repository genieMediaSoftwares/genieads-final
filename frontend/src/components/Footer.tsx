import React, { useState } from 'react';
import { Sparkles, X, Shield, FileText } from 'lucide-react';

interface FooterProps {
  onOpenEarlyAccess: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenEarlyAccess }) => {
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);

  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-[#FAF6E8] border-t border-[#E8DEB7] pt-16 pb-12 text-[#6A5652] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#E8DEB7]">
          {/* Column 1: Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#8B2626] flex items-center justify-center text-white font-bold text-xs shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#F1E5A1]" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-[#2A1A18] font-mono">
                GENIE<span className="text-[#EF6905]">ADS</span>
              </span>
            </div>
            <p className="text-[#6A5652] max-w-sm leading-relaxed text-xs sm:text-sm">
              AI Growth Intelligence platform turning marketing and social advertising data into clear, actionable growth decisions.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#E8DEB7] text-[11px] text-[#6A5652] shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#486C2F]" />
              Platform Operational • Live System
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#2A1A18]">Platform</div>
            <ul className="space-y-2 text-[#6A5652]">
              <li>
                <button
                  onClick={() => scrollToSection('#product')}
                  className="hover:text-[#8B2626] transition-colors cursor-pointer"
                >
                  Capabilities
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('#problem')}
                  className="hover:text-[#8B2626] transition-colors cursor-pointer"
                >
                  Why GenieAds
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('#how-it-works')}
                  className="hover:text-[#8B2626] transition-colors cursor-pointer"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('#pricing')}
                  className="hover:text-[#8B2626] transition-colors cursor-pointer"
                >
                  Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('#faq')}
                  className="hover:text-[#8B2626] transition-colors cursor-pointer"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Contact */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#2A1A18]">Trust & Legal</div>
            <ul className="space-y-2 text-[#6A5652]">
              <li>
                <button
                  onClick={() => setLegalModal('privacy')}
                  className="hover:text-[#8B2626] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-[#6A5652]" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setLegalModal('terms')}
                  className="hover:text-[#8B2626] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-[#6A5652]" />
                  <span>Terms of Service</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenEarlyAccess}
                  className="hover:text-[#8B2626] transition-colors cursor-pointer"
                >
                  Contact & Inquiries
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#6A5652]">
          <p>© 2026 GenieAds. All rights reserved.</p>
          <p className="font-mono text-[#6A5652]">Built for modern growth teams • Zero false promises</p>
        </div>
      </div>

      {/* Legal Dialog Modal */}
      {legalModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setLegalModal(null)}
        >
          <div
            className="bg-[#FFFFFF] border border-[#E8DEB7] rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl text-left space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DEB7]">
              <h3 className="text-base font-bold text-[#2A1A18]">
                {legalModal === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
              </h3>
              <button
                onClick={() => setLegalModal(null)}
                className="p-1 rounded-lg text-[#6A5652] hover:text-[#2A1A18] hover:bg-[#FAF6E8]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-[#6A5652] space-y-3 leading-relaxed max-h-72 overflow-y-auto pr-1">
              {legalModal === 'privacy' ? (
                <>
                  <p>
                    At GenieAds, we are committed to protecting the privacy and security of your business and marketing data.
                  </p>
                  <p>
                    1. <strong>Data Handling:</strong> All early access registrations and prospective account credentials are treated with strict confidentiality. We do not sell or broker your marketing metadata.
                  </p>
                  <p>
                    2. <strong>Security Architecture:</strong> Server-side proxy routing protects all future API tokens with enterprise encryption standards.
                  </p>
                  <p>
                    3. <strong>Contact:</strong> For privacy inquiries or data removal requests, contact our privacy officer through early access support.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    By requesting early access or using the GenieAds platform, you agree to these Terms of Service.
                  </p>
                  <p>
                    1. <strong>Phase 1 Landing Prototype:</strong> All simulated product preview metrics illustrate analytical methodologies and do not represent verified financial returns or live account access until official phase release.
                  </p>
                  <p>
                    2. <strong>Service Availability:</strong> Early access rolling invites are extended on a capacity basis to ensure optimal performance.
                  </p>
                </>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setLegalModal(null)}
                className="px-4 py-2 bg-[#8B2626] hover:bg-[#6D1E1E] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
