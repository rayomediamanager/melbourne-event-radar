import React from 'react';
import { PlusCircle, Radio, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface FooterProps {
  onSuggestClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSuggestClick }) => {
  const { isDark } = useTheme();

  return (
    <footer className={`mt-20 border-t pt-12 pb-14 transition-colors duration-200 ${
      isDark ? 'border-white/[0.08] bg-[#161619] text-zinc-400' : 'border-zinc-300 bg-[#dadade] text-zinc-600'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Suggest an Event Section */}
        <div className={`rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-colors duration-200 ${
          isDark 
            ? 'bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.08]' 
            : 'bg-gradient-to-b from-white/80 to-zinc-200/80 border border-zinc-300 shadow-xs'
        }`}>
          <div className="space-y-1 max-w-xl">
            <h4 className={`text-lg sm:text-xl font-bold font-montserrat tracking-tight ${
              isDark ? 'text-white' : 'text-zinc-950'
            }`}>
              Know a Melbourne professional event we should list?
            </h4>
            <p className={`text-xs sm:text-sm leading-relaxed ${
              isDark ? 'text-zinc-400' : 'text-zinc-600'
            }`}>
              Help make Melbourne Event Radar more comprehensive. Send us your conference, expo, summit, or community networking event.
            </p>
          </div>

          <button
            onClick={onSuggestClick}
            className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto ${
              isDark 
                ? 'bg-white/[0.06] hover:bg-white/[0.12] text-white border-white/[0.1]' 
                : 'bg-white hover:bg-zinc-100 text-zinc-900 border-zinc-300 shadow-xs'
            }`}
          >
            <PlusCircle className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-amber-700'}`} />
            <span>Suggest an event</span>
          </button>
        </div>

        {/* Subtle Brand & Attribution Footer */}
        <div className={`pt-8 border-t flex flex-col md:flex-row md:items-center justify-between gap-6 text-xs ${
          isDark ? 'border-white/[0.05] text-zinc-400' : 'border-zinc-300 text-zinc-600'
        }`}>
          
          <div className="space-y-1">
            <div className={`flex items-center gap-2 font-semibold font-montserrat ${
              isDark ? 'text-zinc-300' : 'text-zinc-900'
            }`}>
              <Radio className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-amber-700'}`} />
              <span>Melbourne Event Radar</span>
            </div>
            <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              A Melbourne event discovery resource.
            </p>
          </div>

          <div className={`flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 text-xs ${
            isDark ? 'text-zinc-400' : 'text-zinc-600'
          }`}>
            <div>
              <span>Curated for professional & business discovery in Melbourne.</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <span>Melbourne Event Radar by</span>
              <a
                href="https://rayomedia.com.au"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1 font-semibold transition-colors underline underline-offset-4 ${
                  isDark 
                    ? 'text-zinc-300 hover:text-amber-400 decoration-white/20 hover:decoration-amber-400' 
                    : 'text-zinc-900 hover:text-amber-800 decoration-zinc-400 hover:decoration-amber-800'
                }`}
              >
                <span>RAYO Media</span>
                <ArrowUpRight className={`w-3 h-3 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`} />
              </a>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
};
