import React from 'react';
import { MonthOption } from '../types';
import { CalendarDays, Lock, Archive, History } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface MonthSelectorProps {
  months: MonthOption[];
  selectedMonth: string;
  onSelectMonth: (monthKey: string) => void;
}

export const MonthSelector: React.FC<MonthSelectorProps> = ({
  months,
  selectedMonth,
  onSelectMonth,
}) => {
  const { isDark } = useTheme();

  return (
    <div className={`border-b py-3 transition-colors duration-200 ${
      isDark 
        ? 'border-white/[0.08] bg-[#1a1a1e]/40' 
        : 'border-zinc-300/80 bg-[#dedee4]/80'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CalendarDays className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-amber-700'}`} />
            <span className={`text-[11px] font-bold uppercase tracking-wider ${
              isDark ? 'text-zinc-400' : 'text-zinc-600'
            }`}>
              Browse Schedule:
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {months.map((month) => {
              const isSelected = selectedMonth === month.key;
              const isAvailable = month.available;
              const isArchive = month.isArchive;
              const isPast = month.isPast;

              return (
                <button
                  key={month.key}
                  disabled={!isAvailable}
                  onClick={() => isAvailable && onSelectMonth(month.key)}
                  className={`
                    relative px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-150 flex items-center gap-2 whitespace-nowrap cursor-pointer
                    ${
                      isSelected
                        ? isDark
                          ? isArchive
                            ? 'bg-zinc-200 text-zinc-950 font-bold shadow-lg ring-2 ring-white/30'
                            : 'bg-amber-400 text-zinc-950 shadow-lg shadow-amber-400/10 font-bold ring-2 ring-amber-400/30'
                          : isArchive
                          ? 'bg-zinc-800 text-white font-bold shadow-md ring-2 ring-zinc-800/40'
                          : 'bg-amber-500 text-zinc-950 shadow-md font-bold ring-2 ring-amber-500/40'
                        : isArchive
                        ? isDark
                          ? 'bg-white/[0.03] text-zinc-400 hover:bg-white/[0.07] hover:text-zinc-200 border border-white/[0.08]'
                          : 'bg-zinc-300/80 text-zinc-800 hover:bg-zinc-300 hover:text-zinc-950 border border-zinc-400/60'
                        : isAvailable
                        ? isDark
                          ? isPast
                            ? 'bg-white/[0.02] text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-200 border border-white/[0.04]'
                            : 'bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08] hover:text-white border border-white/[0.06]'
                          : isPast
                          ? 'bg-zinc-200/70 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 border border-zinc-300/70'
                          : 'bg-zinc-200/90 text-zinc-700 hover:bg-zinc-300 hover:text-zinc-950 border border-zinc-300'
                        : isDark
                        ? 'bg-white/[0.01] text-zinc-600 border border-white/[0.03] cursor-not-allowed opacity-75'
                        : 'bg-zinc-200/40 text-zinc-400 border border-zinc-300/60 cursor-not-allowed opacity-75'
                    }
                  `}
                >
                  {isArchive ? (
                    <Archive className="w-3.5 h-3.5 shrink-0" />
                  ) : isPast ? (
                    <History className="w-3 h-3 shrink-0 opacity-70" />
                  ) : null}

                  <span>{month.label}</span>

                  {isPast && !isArchive && (
                    <span className="text-[9px] uppercase tracking-wider opacity-60 font-semibold">
                      (Past)
                    </span>
                  )}

                  {isAvailable ? (
                    <span
                      className={`
                        text-[10px] px-1.5 py-0.5 rounded-full font-bold
                        ${
                          isSelected
                            ? isArchive && !isDark
                              ? 'bg-white/20 text-white'
                              : 'bg-black/20 text-zinc-950'
                            : isDark
                            ? 'bg-white/[0.08] text-zinc-400'
                            : 'bg-zinc-300/90 text-zinc-700'
                        }
                      `}
                    >
                      {month.eventCount}
                    </span>
                  ) : (
                    <span className={`inline-flex items-center gap-1 text-[10px] font-medium tracking-wide uppercase px-1.5 py-0.5 rounded border ${
                      isDark 
                        ? 'text-zinc-400 bg-zinc-800/80 border-zinc-700/50' 
                        : 'text-zinc-500 bg-zinc-300/70 border-zinc-400/50'
                    }`}>
                      <Lock className="w-2.5 h-2.5" />
                      Coming soon
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
