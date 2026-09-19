import React from 'react';
import { Search, MapPin, X, SlidersHorizontal } from 'lucide-react';
import { CATEGORIES } from '../data/events';
import { useTheme } from '../context/ThemeContext';

interface FilterBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  selectedVenue: string;
  onSelectVenue: (venue: string) => void;
  venues: string[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onResetFilters: () => void;
  totalFilteredCount: number;
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedVenue,
  onSelectVenue,
  venues,
  searchQuery,
  onSearchChange,
  onResetFilters,
  totalFilteredCount,
  totalCount,
}) => {
  const { isDark } = useTheme();
  const isFiltered = selectedCategory !== 'All' || selectedVenue !== 'All' || searchQuery.trim() !== '';

  return (
    <div className={`border-b py-5 transition-colors duration-200 ${
      isDark ? 'bg-[#17171a]/80 border-white/[0.06]' : 'bg-[#dedee5]/90 border-zinc-300/90'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Top Controls: Search Bar & Venue Dropdown */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Keyword Search */}
          <div className="relative flex-1 max-w-lg">
            <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${
              isDark ? 'text-zinc-500' : 'text-zinc-500'
            }`}>
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by event title, keyword, organiser..."
              className={`w-full pl-9 pr-8 py-2 rounded-xl text-xs outline-none transition-all ${
                isDark 
                  ? 'bg-white/[0.03] hover:bg-white/[0.05] focus:bg-white/[0.07] border border-white/[0.08] focus:border-amber-400/50 text-white placeholder-zinc-500' 
                  : 'bg-white/95 hover:bg-white focus:bg-white border border-zinc-300 focus:border-amber-600 text-zinc-900 placeholder-zinc-500 shadow-2xs'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                  isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-zinc-900'
                }`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Venue Selector */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className={`w-3.5 h-3.5 ${isDark ? 'text-amber-400' : 'text-amber-700'}`} />
              </div>
              <select
                value={selectedVenue}
                onChange={(e) => onSelectVenue(e.target.value)}
                className={`pl-8 pr-8 py-2 rounded-xl text-xs outline-none cursor-pointer transition-all appearance-none ${
                  isDark 
                    ? 'bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.08] focus:border-amber-400/50 text-zinc-200' 
                    : 'bg-white/95 hover:bg-white border border-zinc-300 focus:border-amber-600 text-zinc-800 shadow-2xs'
                }`}
              >
                <option value="All" className={isDark ? 'bg-[#1f1f23] text-white' : 'bg-zinc-100 text-zinc-900'}>
                  All Melbourne Venues
                </option>
                {venues.map((venue) => (
                  <option 
                    key={venue} 
                    value={venue} 
                    className={isDark ? 'bg-[#1f1f23] text-white' : 'bg-zinc-100 text-zinc-900'}
                  >
                    {venue === 'Others' ? 'Others (Other Venues)' : venue}
                  </option>
                ))}
              </select>
              <div className={`absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none ${
                isDark ? 'text-zinc-500' : 'text-zinc-400'
              }`}>
                <span className="text-[10px]">▼</span>
              </div>
            </div>

            {isFiltered && (
              <button
                onClick={onResetFilters}
                className={`flex items-center gap-1 px-2.5 py-2 text-xs font-medium rounded-xl cursor-pointer transition-colors ${
                  isDark 
                    ? 'text-zinc-400 hover:text-amber-400 bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06]' 
                    : 'text-zinc-600 hover:text-amber-800 bg-zinc-200/80 hover:bg-zinc-300 border border-zinc-300'
                }`}
                title="Reset all filters"
              >
                <X className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
          <span className={`text-[10px] font-bold uppercase tracking-wider pr-2 hidden md:inline-flex items-center gap-1 ${
            isDark ? 'text-zinc-400' : 'text-zinc-600'
          }`}>
            <SlidersHorizontal className="w-3 h-3 text-zinc-400" />
            Type:
          </span>
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => onSelectCategory(cat.value)}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 cursor-pointer
                  ${
                    isActive
                      ? isDark 
                        ? 'bg-amber-400 text-zinc-950 font-semibold shadow-sm shadow-amber-400/20' 
                        : 'bg-amber-500 text-zinc-950 font-bold shadow-xs'
                      : isDark
                        ? 'bg-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.04]'
                        : 'bg-zinc-200/80 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-300 border border-zinc-300/80'
                  }
                `}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Result summary bar */}
        <div className={`flex items-center justify-between text-xs font-medium pt-1 border-t ${
          isDark ? 'text-zinc-400 border-white/[0.03]' : 'text-zinc-600 border-zinc-300/60'
        }`}>
          <div>
            Showing <span className={`font-semibold ${isDark ? 'text-zinc-200' : 'text-zinc-900'}`}>{totalFilteredCount}</span> of{' '}
            <span className={isDark ? 'text-zinc-200' : 'text-zinc-900'}>{totalCount}</span> professional events
            {isFiltered && <span className={`ml-1 ${isDark ? 'text-amber-400' : 'text-amber-700 font-semibold'}`}>(filtered)</span>}
          </div>

          <div className={`text-[11px] tracking-wide ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
            Sorted Chronologically
          </div>
        </div>

      </div>
    </div>
  );
};
