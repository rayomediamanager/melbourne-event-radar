import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { MonthSelector } from './components/MonthSelector';
import { FilterBar } from './components/FilterBar';
import { EventCard } from './components/EventCard';
import { EventDetailModal } from './components/EventDetailModal';
import { SuggestEventModal } from './components/SuggestEventModal';
import { Footer } from './components/Footer';
import { EVENTS, getVenuesList, isPrimaryVenue } from './data/events';
import { MelbourneEvent } from './types';
import { SearchX, Archive, History, ArrowLeft, Clock, ArrowUpDown } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { useTheme } from './context/ThemeContext';
import { 
  getLocalDateString, 
  getDefaultMonthKey, 
  generateMonthOptions, 
  isEventUpcoming, 
  isEventCompleted, 
  formatMonthLabel 
} from './utils/dateUtils';

export default function App() {
  const { isDark } = useTheme();

  // Dynamic current date from user's local browser/device
  const [todayStr, setTodayStr] = useState<string>(() => getLocalDateString());

  // Periodically refresh current local date (e.g., when crossing midnight)
  useEffect(() => {
    const interval = setInterval(() => {
      const current = getLocalDateString();
      if (current !== todayStr) {
        setTodayStr(current);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [todayStr]);

  // Current month key (e.g. '2026-09')
  const currentMonthKey = useMemo(() => todayStr.substring(0, 7), [todayStr]);

  // Dynamically generated month options based on current date
  const dynamicMonths = useMemo(() => {
    return generateMonthOptions(EVENTS, todayStr);
  }, [todayStr]);

  // Determine initial default month (current month stays first until month changes)
  const defaultMonthKey = useMemo(() => {
    return getDefaultMonthKey(EVENTS, todayStr);
  }, [todayStr]);

  const [selectedMonth, setSelectedMonth] = useState<string>(defaultMonthKey);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedVenue, setSelectedVenue] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // State to toggle between upcoming and completed events within a month that has both
  const [showMonthArchived, setShowMonthArchived] = useState<boolean>(false);

  // Sorting order specifically inside Past Events Archive view ('desc' = most recent first, 'asc' = oldest first)
  const [archiveSortOrder, setArchiveSortOrder] = useState<'desc' | 'asc'>('desc');

  const [activeModalEvent, setActiveModalEvent] = useState<MelbourneEvent | null>(null);
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState<boolean>(false);

  // Safeguard: if selected month is a past month (< currentMonthKey), route straight to archive
  useEffect(() => {
    if (
      selectedMonth !== 'archive' &&
      selectedMonth !== 'all-upcoming' &&
      selectedMonth !== 'all' &&
      selectedMonth < currentMonthKey
    ) {
      setSelectedMonth('archive');
    }
  }, [selectedMonth, currentMonthKey]);

  // When selected month changes, reset intra-month archive view and reset venue filter to All
  const handleSelectMonth = (monthKey: string) => {
    setSelectedMonth(monthKey);
    setShowMonthArchived(false);
    setSelectedVenue('All');
  };

  // Derive unique venues from master dataset
  const allVenues = useMemo(() => getVenuesList(EVENTS), []);

  // Stats for current selected month (if a specific month is chosen)
  const monthStats = useMemo(() => {
    if (selectedMonth === 'archive' || selectedMonth === 'all-upcoming' || selectedMonth === 'all') {
      return null;
    }
    const inMonth = EVENTS.filter((e) => e.startDate.startsWith(selectedMonth));
    const upcoming = inMonth.filter((e) => isEventUpcoming(e, todayStr));
    const completed = inMonth.filter((e) => isEventCompleted(e, todayStr));
    return {
      total: inMonth.length,
      upcomingCount: upcoming.length,
      completedCount: completed.length,
      isAllCompleted: upcoming.length === 0 && completed.length > 0,
      hasBoth: upcoming.length > 0 && completed.length > 0,
    };
  }, [selectedMonth, todayStr]);

  // Header active label
  const activeHeaderLabel = useMemo(() => {
    if (selectedMonth === 'archive') return 'Past Events Archive';
    if (selectedMonth === 'all-upcoming') return 'All Upcoming Events';
    if (selectedMonth === 'all') return 'All Schedule';
    return formatMonthLabel(selectedMonth);
  }, [selectedMonth]);

  // Filter events based on dynamic date rules, month, category, venue, and search
  const filteredEvents = useMemo(() => {
    return EVENTS.filter((event) => {
      // 1. Month / Status Logic
      if (selectedMonth === 'archive') {
        // Must be completed (all historical events including those older than 1 month)
        if (!isEventCompleted(event, todayStr)) return false;
      } else if (selectedMonth === 'all-upcoming' || selectedMonth === 'all') {
        // Must be upcoming
        if (!isEventUpcoming(event, todayStr)) return false;
      } else {
        // Specific Month (e.g. '2026-10')
        if (!event.startDate.startsWith(selectedMonth)) return false;

        const inMonth = EVENTS.filter((e) => e.startDate.startsWith(selectedMonth));
        const hasUpcomingInMonth = inMonth.some((e) => isEventUpcoming(e, todayStr));

        if (hasUpcomingInMonth) {
          if (showMonthArchived) {
            // User requested viewing the completed events for this month
            if (!isEventCompleted(event, todayStr)) return false;
          } else {
            // Default: strictly upcoming events
            if (!isEventUpcoming(event, todayStr)) return false;
          }
        } else {
          // Historical month where all events have completed: show completed
        }
      }

      // 2. Category match
      if (selectedCategory !== 'All' && event.category !== selectedCategory) {
        return false;
      }

      // 3. Venue match (supports 5 primary venues + 'Others')
      if (selectedVenue !== 'All') {
        if (selectedVenue === 'Others') {
          if (isPrimaryVenue(event.venue)) {
            return false;
          }
        } else if (!event.venue.toLowerCase().includes(selectedVenue.toLowerCase())) {
          return false;
        }
      }

      // 4. Keyword Search
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchName = event.name.toLowerCase().includes(query);
        const matchDesc = event.description.toLowerCase().includes(query);
        const matchVenue = event.venue.toLowerCase().includes(query);
        const matchSuburb = event.suburb.toLowerCase().includes(query);
        const matchOrganiser = (event.organiser || '').toLowerCase().includes(query);
        const matchIndustry = (event.industry || '').toLowerCase().includes(query);

        if (
          !matchName &&
          !matchDesc &&
          !matchVenue &&
          !matchSuburb &&
          !matchOrganiser &&
          !matchIndustry
        ) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      // If browsing Past Events Archive: sort by chosen archiveSortOrder
      if (selectedMonth === 'archive') {
        if (archiveSortOrder === 'asc') {
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        }
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      }

      // If browsing archived subview of current month, sort most recent first
      if (showMonthArchived) {
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      }

      // For upcoming events, sort chronological ascending
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    });
  }, [
    selectedMonth,
    showMonthArchived,
    archiveSortOrder,
    selectedCategory,
    selectedVenue,
    searchQuery,
    todayStr,
  ]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedVenue('All');
    setSearchQuery('');
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      isDark 
        ? 'bg-[#141417] text-zinc-100 selection:bg-amber-400 selection:text-zinc-950' 
        : 'bg-[#e6e6ec] text-zinc-900 selection:bg-amber-400 selection:text-zinc-950'
    }`}>
      
      {/* Background ambient gradient glow */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {isDark ? (
          <>
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-amber-500/5 blur-[140px] rounded-full" />
            <div className="absolute top-1/3 -left-40 w-[600px] h-[400px] bg-sky-500/3 blur-[160px] rounded-full" />
          </>
        ) : (
          <>
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-amber-500/10 blur-[150px] rounded-full" />
            <div className="absolute top-1/3 -left-40 w-[600px] h-[400px] bg-amber-600/5 blur-[160px] rounded-full" />
          </>
        )}
      </div>

      {/* Primary Header */}
      <Header
        eventCount={EVENTS.length}
        activeMonthLabel={activeHeaderLabel}
        onSuggestClick={() => setIsSuggestModalOpen(true)}
      />

      {/* Dynamic Month Selector Bar */}
      <MonthSelector
        months={dynamicMonths}
        selectedMonth={selectedMonth}
        onSelectMonth={handleSelectMonth}
      />

      {/* Filters (Categories, Venues, Search) */}
      <FilterBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedVenue={selectedVenue}
        onSelectVenue={setSelectedVenue}
        venues={allVenues}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onResetFilters={handleResetFilters}
        totalFilteredCount={filteredEvents.length}
        totalCount={EVENTS.length}
      />

      {/* Main Content Area: Chronological Event List */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* Contextual Mode Banners */}
        {selectedMonth === 'archive' && (
          <div className={`mb-6 p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
            isDark 
              ? 'bg-[#1b1b20] border-zinc-700/60 text-zinc-300' 
              : 'bg-zinc-200/90 border-zinc-300 text-zinc-800'
          }`}>
            <div className="flex items-center gap-3">
              <Archive className={`w-5 h-5 shrink-0 ${isDark ? 'text-amber-400' : 'text-amber-700'}`} />
              <div>
                <strong className={`font-semibold block text-sm ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                  Past Events Archive
                </strong>
                <p className="text-xs text-zinc-400">
                  Showing historical records of concluded Melbourne professional events across past months and previous periods.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              {/* Sort Order Toggle for Archived Events */}
              <button
                onClick={() => setArchiveSortOrder(archiveSortOrder === 'desc' ? 'asc' : 'desc')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isDark 
                    ? 'bg-white/[0.05] hover:bg-white/[0.1] text-zinc-200 border border-white/[0.08]' 
                    : 'bg-zinc-300 hover:bg-zinc-400 text-zinc-900 border border-zinc-400/50'
                }`}
                title="Toggle past events sort order"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>{archiveSortOrder === 'desc' ? 'Sorted: Most Recent First' : 'Sorted: Oldest First'}</span>
              </button>

              <button
                onClick={() => handleSelectMonth(defaultMonthKey)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isDark 
                    ? 'bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30' 
                    : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-900 border border-amber-500/30'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Upcoming Events</span>
              </button>
            </div>
          </div>
        )}

        {/* Historical Past Month Notice (e.g., May 2026 where all events concluded) */}
        {monthStats?.isAllCompleted && selectedMonth !== 'archive' && (
          <div className={`mb-6 p-4 rounded-2xl border flex items-center justify-between gap-3 ${
            isDark 
              ? 'bg-[#1a1a1f] border-zinc-700/50 text-zinc-300' 
              : 'bg-zinc-200/80 border-zinc-300 text-zinc-800'
          }`}>
            <div className="flex items-center gap-3">
              <History className={`w-5 h-5 shrink-0 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`} />
              <div>
                <strong className={`font-semibold block text-sm ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                  Historical Archive: {formatMonthLabel(selectedMonth)}
                </strong>
                <p className="text-xs text-zinc-400">
                  All scheduled events for this month have concluded. Listed below for reference.
                </p>
              </div>
            </div>

            <button
              onClick={() => handleSelectMonth(defaultMonthKey)}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isDark 
                  ? 'bg-white/[0.05] hover:bg-white/[0.1] text-zinc-200 border border-white/[0.08]' 
                  : 'bg-zinc-300 hover:bg-zinc-400 text-zinc-900 border border-zinc-400/50'
              }`}
            >
              <span>View Next Upcoming Month</span>
            </button>
          </div>
        )}

        {/* Month with Both Upcoming & Completed Events (e.g. Current Month) */}
        {monthStats?.hasBoth && (
          <div className={`mb-6 p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isDark 
              ? 'bg-white/[0.02] border-white/[0.07] text-zinc-300' 
              : 'bg-white/80 border-zinc-300 text-zinc-800'
          }`}>
            <div className="flex items-center gap-2.5 text-xs">
              <Clock className={`w-4 h-4 shrink-0 ${isDark ? 'text-amber-400' : 'text-amber-700'}`} />
              <span>
                {showMonthArchived ? (
                  <>Showing <strong>{monthStats.completedCount} completed events</strong> from earlier in {formatMonthLabel(selectedMonth)}.</>
                ) : (
                  <>Showing <strong>{monthStats.upcomingCount} upcoming events</strong>. {monthStats.completedCount} concluded event(s) from earlier this month are archived.</>
                )}
              </span>
            </div>

            <button
              onClick={() => setShowMonthArchived(!showMonthArchived)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isDark 
                  ? 'bg-white/[0.06] hover:bg-white/[0.12] text-zinc-200 border border-white/[0.1]' 
                  : 'bg-zinc-200 hover:bg-zinc-300 text-zinc-800 border border-zinc-300'
              }`}
            >
              {showMonthArchived ? (
                <span>Switch to Upcoming Events ({monthStats.upcomingCount})</span>
              ) : (
                <span>View Concluded Events ({monthStats.completedCount})</span>
              )}
            </button>
          </div>
        )}

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                todayStr={todayStr}
                onViewDetails={setActiveModalEvent}
              />
            ))}
          </div>
        ) : (
          /* Empty Search / Filter State */
          <div className={`text-center py-16 px-4 rounded-3xl max-w-md mx-auto my-12 space-y-4 border ${
            isDark 
              ? 'bg-white/[0.02] border-white/[0.05]' 
              : 'bg-white/90 border-zinc-300 shadow-sm'
          }`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
              isDark ? 'bg-white/[0.04] text-zinc-400' : 'bg-zinc-200 text-zinc-600'
            }`}>
              <SearchX className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className={`text-lg font-bold font-montserrat ${
                isDark ? 'text-white' : 'text-zinc-950'
              }`}>
                No events match your criteria
              </h4>
              <p className={`text-xs leading-relaxed ${
                isDark ? 'text-zinc-400' : 'text-zinc-600'
              }`}>
                Try clearing active filters or searching for a broader term like &quot;summit&quot;, &quot;expo&quot;, or &quot;MCEC&quot;.
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-amber-400 text-zinc-950 text-xs font-bold hover:bg-amber-300 transition-colors cursor-pointer shadow-xs"
            >
              Reset All Filters
            </button>
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer onSuggestClick={() => setIsSuggestModalOpen(true)} />

      {/* Event Details Modal */}
      <AnimatePresence>
        {activeModalEvent && (
          <EventDetailModal
            event={activeModalEvent}
            todayStr={todayStr}
            onClose={() => setActiveModalEvent(null)}
          />
        )}
      </AnimatePresence>

      {/* Suggest an Event Modal */}
      <AnimatePresence>
        {isSuggestModalOpen && (
          <SuggestEventModal
            isOpen={isSuggestModalOpen}
            onClose={() => setIsSuggestModalOpen(false)}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
