import React, { useState } from 'react';
import { X, Mail, Check, Copy, Send, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface SuggestEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SuggestEventModal: React.FC<SuggestEventModalProps> = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();
  const [copied, setCopied] = useState(false);
  const emailAddress = 'hello@rayomedia.com.au';
  const mailtoSubject = encodeURIComponent('Event Suggestion: Melbourne Event Radar');
  const mailtoBody = encodeURIComponent(
`Hi Melbourne Event Radar team,

I would like to suggest an upcoming Melbourne professional event:

- Event Name: 
- Date(s): 
- Venue / Suburb: 
- Category (Conference / Expo / Networking / Workshop / Business): 
- Organiser: 
- Official Website URL: 
- Short Summary / Notes: 

Thanks!`
  );

  const mailtoUrl = `mailto:${emailAddress}?subject=${mailtoSubject}&body=${mailtoBody}`;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className={`fixed inset-0 backdrop-blur-sm transition-opacity ${
          isDark ? 'bg-black/80' : 'bg-black/50'
        }`}
      />

      {/* Dialog */}
      <div className={`relative w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden z-10 my-8 transition-colors duration-200 border ${
        isDark 
          ? 'bg-[#1d1d23] border-white/[0.12] text-white' 
          : 'bg-[#f0f0f5] border-zinc-300/90 text-zinc-900'
      }`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isDark ? 'border-white/[0.08] bg-white/[0.02]' : 'border-zinc-300/80 bg-zinc-200/50'
        }`}>
          <div className="flex items-center gap-2">
            <span className={`p-1 rounded-md ${
              isDark ? 'bg-amber-400/10 text-amber-400' : 'bg-amber-500/15 text-amber-800'
            }`}>
              <Mail className="w-4 h-4" />
            </span>
            <span className={`text-xs font-semibold tracking-wide uppercase ${
              isDark ? 'text-zinc-300' : 'text-zinc-800'
            }`}>
              COMMUNITY SUBMISSIONS
            </span>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              isDark 
                ? 'text-zinc-400 hover:text-white hover:bg-white/[0.08]' 
                : 'text-zinc-500 hover:text-zinc-950 hover:bg-zinc-300'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h3 className={`text-xl sm:text-2xl font-bold font-montserrat tracking-tight ${
              isDark ? 'text-white' : 'text-zinc-950'
            }`}>
              Know a Melbourne event we should list?
            </h3>
            <p className={`text-sm leading-relaxed ${
              isDark ? 'text-zinc-400' : 'text-zinc-600'
            }`}>
              We curate Melbourne’s top professional conferences, expos, business summits, and networking events. Submit an event for our editorial review.
            </p>
          </div>

          {/* Submission Guidelines Box */}
          <div className={`p-4 rounded-2xl border space-y-2 text-xs ${
            isDark 
              ? 'bg-white/[0.02] border-white/[0.06] text-zinc-300' 
              : 'bg-white/90 border-zinc-300 text-zinc-700 shadow-2xs'
          }`}>
            <div className={`font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5 ${
              isDark ? 'text-zinc-400' : 'text-zinc-500'
            }`}>
              <Sparkles className={`w-3 h-3 ${isDark ? 'text-amber-400' : 'text-amber-700'}`} />
              <span>What information to include:</span>
            </div>
            <ul className={`space-y-1 list-disc list-inside ${
              isDark ? 'text-zinc-400' : 'text-zinc-600'
            }`}>
              <li>Official event title & organiser</li>
              <li>Confirmed dates & Melbourne venue</li>
              <li>Official website / ticket link for verification</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <a
              href={mailtoUrl}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-sm transition-all shadow-lg shadow-amber-400/20 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Open Pre-filled Email Draft</span>
            </a>

            <div className={`flex items-center justify-between gap-2 p-3 rounded-xl border text-xs ${
              isDark 
                ? 'bg-white/[0.03] border-white/[0.06]' 
                : 'bg-zinc-200/70 border-zinc-300'
            }`}>
              <span className={`font-medium select-all ${
                isDark ? 'text-zinc-300' : 'text-zinc-800'
              }`}>
                {emailAddress}
              </span>
              <button
                onClick={handleCopyEmail}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  isDark 
                    ? 'bg-white/[0.06] hover:bg-white/[0.1] text-zinc-200' 
                    : 'bg-zinc-300/80 hover:bg-zinc-300 text-zinc-800'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-500" />
                    <span className="text-emerald-500 font-semibold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className={`w-3 h-3 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <p className={`text-center text-[11px] ${
            isDark ? 'text-zinc-400' : 'text-zinc-500'
          }`}>
            All submitted events are verified against official event pages before being listed.
          </p>
        </div>

      </div>
    </div>
  );
};
