import React from 'react';
import { Radio, Calendar, PlusCircle, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  onSuggestClick: () => void;
  eventCount: number;
  activeMonthLabel?: string;
}

export const Header: React.FC<HeaderProps> = ({ onSuggestClick, eventCount, activeMonthLabel }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className={`border-b sticky top-0 z-30 backdrop-blur-md transition-colors duration-200 ${
      isDark 
        ? 'border-white/[0.07] bg-[#1a1a1e]/90 text-white' 
        : 'border-zinc-300/90 bg-[#e2e2e8]/95 text-zinc-900 shadow-xs'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top announcement / edition pill */}
        <div className={`flex items-center justify-between py-2.5 border-b text-xs transition-colors duration-200 ${
          isDark ? 'border-white/[0.05] text-zinc-400' : 'border-zinc-300/70 text-zinc-600'
        }`}>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className={`font-semibold uppercase tracking-wider text-[11px] ${
              isDark ? 'text-zinc-300' : 'text-zinc-800'
            }`}>
              Melbourne, VIC
            </span>
            <span className={isDark ? 'text-zinc-600' : 'text-zinc-400'}>•</span>
            <span className={isDark ? 'text-zinc-400' : 'text-zinc-700 font-medium'}>
              {new Date().toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })}
            </span>
            <span className={`${isDark ? 'text-zinc-600' : 'text-zinc-400'} hidden sm:inline`}>•</span>
            <span className={`${isDark ? 'text-zinc-400' : 'text-zinc-600'} hidden sm:inline`}>
              {eventCount} verified events listed
            </span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Day / Light Mode Toggle Button */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to Day Mode" : "Switch to Dark Mode"}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                isDark 
                  ? 'bg-white/[0.06] hover:bg-white/[0.1] text-zinc-200 hover:text-white border border-white/[0.08]' 
                  : 'bg-zinc-200 hover:bg-zinc-300 text-zinc-800 border border-zinc-300 shadow-xs'
              }`}
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px]">Day Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-zinc-700" />
                  <span className="text-[11px]">Dark Mode</span>
                </>
              )}
            </button>

            <span className={`${isDark ? 'text-zinc-700' : 'text-zinc-300'}`}>|</span>

            {/* Suggest an Event Button */}
            <button
              id="header-suggest-event-btn"
              onClick={onSuggestClick}
              className={`flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer group ${
                isDark ? 'text-amber-400 hover:text-amber-300' : 'text-amber-800 hover:text-amber-900'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-200" />
              <span className="text-[11px]">Suggest Event</span>
            </button>
          </div>
        </div>

        {/* Main Header Branding */}
        <div className="py-6 sm:py-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-[10px] font-semibold tracking-wider uppercase ${
              isDark 
                ? 'bg-white/[0.04] border-white/[0.08] text-zinc-300' 
                : 'bg-black/[0.04] border-black/[0.08] text-zinc-700'
            }`}>
              <Radio className={`w-3.5 h-3.5 animate-pulse ${isDark ? 'text-amber-400' : 'text-amber-700'}`} />
              <span>INDEPENDENT PROFESSIONAL DISCOVERY</span>
            </div>
            
            <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-montserrat ${
              isDark ? 'text-white' : 'text-zinc-950'
            }`}>
              Melbourne Event Radar
            </h1>
            
            <p className={`text-sm sm:text-base max-w-2xl leading-relaxed ${
              isDark ? 'text-zinc-400' : 'text-zinc-600 font-normal'
            }`}>
              Discover upcoming conferences, expos, networking and professional events in Melbourne.
            </p>
          </div>

          <div className={`hidden lg:flex flex-col items-end text-right text-xs ${
            isDark ? 'text-zinc-400' : 'text-zinc-600'
          }`}>
            <div className={`flex items-center gap-1.5 font-bold tracking-wider uppercase text-[11px] ${
              isDark ? 'text-zinc-300' : 'text-zinc-800'
            }`}>
              <Calendar className={`w-3.5 h-3.5 ${isDark ? 'text-amber-400' : 'text-amber-700'}`} />
              <span>{activeMonthLabel ? activeMonthLabel.toUpperCase() : 'PROFESSIONAL RADAR'}</span>
            </div>
            <p className={`text-[11px] mt-0.5 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Verified from official Melbourne convention & venue sources
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
