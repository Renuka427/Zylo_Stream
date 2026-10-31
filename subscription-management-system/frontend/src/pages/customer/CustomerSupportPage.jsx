import React, { useState } from 'react';
import {
  HelpCircle,
  MessageSquare,
  Send,
  ChevronDown,
  CheckCircle,
  FileQuestion,
  LifeBuoy,
  PhoneCall,
  Sparkles
} from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../../components/ui/Button';

export const CustomerSupportPage = () => {
  const { showToast } = useToast();

  const [expandedFaq, setExpandedFaq] = useState(0);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('billing');
  const [ticketPriority, setTicketPriority] = useState('normal');
  const [ticketDescription, setTicketDescription] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState(null);

  const faqs = [
    {
      q: 'When are subscription charges processed?',
      a: 'All subscription renewals are debited automatically on the scheduled renewal date indicated in your dashboard. You will receive an automated notification and invoice statement 7 days in advance.'
    },
    {
      q: 'How do I download official PDF statements for accounting?',
      a: 'Navigate to "My Invoices" in your sidebar, select any invoice, and click "View & Print". You can print the document directly or save it as a local PDF for tax and expense reconciliation.'
    },
    {
      q: 'Can I upgrade or switch my subscription plan at any time?',
      a: 'Yes. You can explore available pricing plans under "Explore Plans" and switch tiers immediately. Prorated charges and updated cycle periods are applied automatically.'
    },
    {
      q: 'How do I update our corporate billing details or Tax ID?',
      a: 'Visit "My Profile" to update your organization name, billing address, direct phone, and Tax ID. All changes immediately cascade into future generated invoices.'
    }
  ];

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    const ticketId = `TKT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedTicket({
      id: ticketId,
      subject: ticketSubject,
      category: ticketCategory,
      priority: ticketPriority,
      date: new Date().toLocaleDateString()
    });
    showToast(`Support inquiry ${ticketId} logged successfully! (Demo Simulation)`, 'success');
    setTicketSubject('');
    setTicketDescription('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-black text-espresso tracking-tight">
          Help &amp; Support Concierge
        </h1>
        <p className="text-xs sm:text-sm text-espresso-muted">
          Browse common billing inquiries or submit a prioritized assistance request to our support team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Frequently Asked Questions */}
        <div className="bg-ivory rounded-3xl border border-stone-warm shadow-luxury p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-2.5 pb-2 border-b border-stone-warm">
            <FileQuestion className="w-5 h-5 text-cherry" />
            <h3 className="font-display text-lg font-bold text-espresso">Frequently Asked Questions</h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = expandedFaq === i;
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-stone-warm bg-champagne-light/50 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : i)}
                    className="w-full text-left p-4 flex items-center justify-between gap-3 text-xs font-bold text-espresso"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-cherry shrink-0 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-espresso-muted leading-relaxed border-t border-stone-warm/50 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Support Ticket Submission */}
        <div className="bg-ivory rounded-3xl border border-stone-warm shadow-luxury p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-2.5 pb-2 border-b border-stone-warm">
            <MessageSquare className="w-5 h-5 text-cherry" />
            <h3 className="font-display text-lg font-bold text-espresso">Submit a Support Inquiry</h3>
          </div>

          <div className="p-3 rounded-xl bg-champagne-light border border-stone-warm text-[11px] text-espresso-muted flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-champagne-gold shrink-0 mt-0.5" />
            <span>
              Demonstration environment: Inquiries are captured locally in client state and do not trigger outbound email dispatches.
            </span>
          </div>

          {submittedTicket && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Inquiry {submittedTicket.id} Logged</span>
              </div>
              <p className="text-[11px] text-emerald-700">
                Subject: &quot;{submittedTicket.subject}&quot;. Our mock concierge responds in under 4 hours.
              </p>
            </div>
          )}

          <form onSubmit={handleTicketSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-espresso mb-1">Subject</label>
              <input
                type="text"
                required
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="e.g. Inquire regarding annual subscription discount..."
                className="w-full bg-white text-espresso px-3 py-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-espresso mb-1">Category</label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full bg-white text-espresso px-3 py-2 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
                >
                  <option value="billing">Billing &amp; Invoices</option>
                  <option value="subscription">Plan Modification</option>
                  <option value="technical">Technical Integrations</option>
                  <option value="other">General Question</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-espresso mb-1">Priority</label>
                <select
                  value={ticketPriority}
                  onChange={(e) => setTicketPriority(e.target.value)}
                  className="w-full bg-white text-espresso px-3 py-2 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High (Urgent)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-espresso mb-1">Description</label>
              <textarea
                required
                rows={4}
                value={ticketDescription}
                onChange={(e) => setTicketDescription(e.target.value)}
                placeholder="Please describe your question or account request..."
                className="w-full bg-white text-espresso p-3 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry resize-none"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full" icon={Send}>
              Submit Support Request
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
