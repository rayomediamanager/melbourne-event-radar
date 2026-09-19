import React from 'react';
import { MelbourneEvent, EventCategory } from '../types';
import { 
  Calendar, MapPin, ExternalLink, ArrowRight, CheckCircle2, 
  Building2, AlertCircle, Clock
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { getCalculatedEventStatus, getLocalDateString } from '../utils/dateUtils';

interface EventCardProps {
  event: MelbourneEvent;
  onViewDetails: (event: MelbourneEvent) => void;
  todayStr?: string;
}

// Category visual styling helper
export function getCategoryBadgeStyle(category: EventCategory, isDark: boolean = true) {
  if (isDark) {
    switch (category) {
      case 'Conference':
        return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'Expo':
        return 'text-sky-400 bg-sky-400/10 border-sky-400/20';
      case 'Networking':
        return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'Corporate':
        return 'text-violet-400 bg-violet-400/10 border-violet-400/20';
      case 'Community':
        return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      default:
        return 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20';
    }
  } else {
    switch (category) {
      case 'Conference':
        return 'text-amber-900 bg-amber-500/15 border-amber-500/35';
      case 'Expo':
        return 'text-sky-900 bg-sky-500/15 border-sky-500/35';
      case 'Networking':
        return 'text-emerald-900 bg-emerald-500/15 border-emerald-500/35';
      case 'Corporate':
        return 'text-violet-900 bg-violet-500/15 border-violet-500/35';
      case 'Community':
        return 'text-rose-900 bg-rose-500/15 border-rose-500/35';
      default:
        return 'text-zinc-800 bg-zinc-300/60 border-zinc-400/50';
    }
  }
}

export const EventCard: React.FC<EventCardProps> = ({ event, onViewDetails, todayStr = getLocalDateString() }) => {
  const { isDark } = useTheme();
  const categoryBadgeClass = getCategoryBadgeStyle(event.category, isDark);
  const calculatedStatus = getCalculatedEventStatus(event, todayStr);
  const isCompleted = calculatedStatus === 'Completed';

  return (
    <div className={`group relative rounded-2xl p-5 sm:p-6 transition-all duration-200 flex flex-col justify-between ${
      isCompleted
        ? isDark
          ? 'bg-[#18181c]/80 hover:bg-[#1c1c21] border border-white/[0.04] hover:border-white/[0.1] text-zinc-300 opacity-90'
          : 'bg-[#ebebee] hover:bg-[#f2f2f5] border border-zinc-300/80 hover:border-zinc-400 text-zinc-700 opacity-90'
        : isDark 
          ? 'bg-[#1d1d22]/90 hover:bg-[#222228] border border-white/[0.06] hover:border-white/[0.14] shadow-lg shadow-black/20 text-white' 
          : 'bg-[#f3f3f7] hover:bg-[#f9f9fc] border border-zinc-300/90 hover:border-zinc-400 shadow-sm shadow-zinc-950/5 text-zinc-900'
    }`}>
      
      {/* Top Meta: Category & Status */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase border ${categoryBadgeClass}`}>
            {event.category}
          </span>

          <div className="flex items-center gap-2">
            {isCompleted ? (
              <span className={`inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded border ${
                isDark 
                  ? 'text-zinc-400 bg-zinc-800/80 border-zinc-700/60' 
                  : 'text-zinc-600 bg-zinc-300/80 border-zinc-400/70'
              }`}>
                <Clock className="w-3 h-3" />
                <span>Completed</span>
              </span>
            ) : calculatedStatus === 'Upcoming' ? (
              <span className={`inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded border ${
                isDark 
                  ? 'text-emerald-400/90 bg-emerald-500/10 border-emerald-500/20' 
                  : 'text-emerald-800 bg-emerald-500/15 border-emerald-500/30'
              }`}>
                <CheckCircle2 className="w-3 h-3" />
                <span>{event.status === 'Confirmed' ? 'Confirmed' : 'Upcoming'}</span>
              </span>
            ) : calculatedStatus === 'Cancelled' ? (
              <span className={`inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded border ${
                isDark 
                  ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' 
                  : 'text-rose-800 bg-rose-500/15 border-rose-500/30'
              }`}>
                <AlertCircle className="w-3 h-3" />
                <span>Cancelled</span>
              </span>
            ) : (
              <span className={`inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded border ${
                isDark 
                  ? 'text-amber-300 bg-amber-500/10 border-amber-500/20' 
                  : 'text-amber-800 bg-amber-500/15 border-amber-500/30'
              }`}>
                <AlertCircle className="w-3 h-3" />
                <span>{calculatedStatus}</span>
              </span>
            )}
          </div>
        </div>

        {/* Date line with highlighted visual */}
        <div className={`flex items-center gap-2 text-xs sm:text-sm font-bold tracking-normal mb-2 ${
          isCompleted
            ? isDark ? 'text-zinc-400' : 'text-zinc-600'
            : isDark ? 'text-amber-400' : 'text-amber-800'
        }`}>
          <Calendar className="w-4 h-4 shrink-0" />
          <span>{event.dateDisplay}</span>
          {isCompleted && (
            <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border ml-1 ${
              isDark ? 'text-zinc-400 bg-white/[0.04] border-white/[0.08]' : 'text-zinc-600 bg-zinc-200 border-zinc-300'
            }`}>
              Concluded
            </span>
          )}
        </div>

        {/* Event Title */}
        <h3 
          onClick={() => onViewDetails(event)}
          className={`text-lg sm:text-xl font-bold font-montserrat tracking-tight leading-snug cursor-pointer mb-2 transition-colors ${
            isCompleted
              ? isDark
                ? 'text-zinc-200 group-hover:text-amber-300'
                : 'text-zinc-800 group-hover:text-amber-900'
              : isDark 
                ? 'text-white group-hover:text-amber-300' 
                : 'text-zinc-950 group-hover:text-amber-800'
          }`}
        >
          {event.name}
        </h3>

        {/* Venue & Suburb */}
        <div className={`flex items-start gap-1.5 text-xs mb-3.5 ${
          isDark ? 'text-zinc-300' : 'text-zinc-700'
        }`}>
          <MapPin className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`} />
          <span>
            <strong className={`font-semibold ${isDark ? 'text-zinc-200' : 'text-zinc-900'}`}>{event.venue}</strong>
            {event.suburb && (
              <span className={`ml-1 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>({event.suburb})</span>
            )}
          </span>
        </div>

        {/* Factual Description */}
        <p className={`text-xs sm:text-sm leading-relaxed line-clamp-3 mb-4 ${
          isDark ? 'text-zinc-400' : 'text-zinc-600'
        }`}>
          {event.description}
        </p>

        {/* Organiser */}
        <div className={`flex items-center gap-1.5 text-xs pt-3 border-t mb-4 ${
          isDark ? 'border-white/[0.04] text-zinc-400' : 'border-zinc-300/70 text-zinc-600'
        }`}>
          <Building2 className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`} />
          <span>Organised by:</span>
          <span className={`font-medium truncate ${isDark ? 'text-zinc-300' : 'text-zinc-900'}`}>
            {event.organiser || 'Not specified'}
          </span>
        </div>
      </div>

      {/* Bottom Area: Verification stamp & Action Buttons */}
      <div className="pt-2">
        <div className={`text-[11px] font-medium mb-3 flex items-center justify-between ${
          isDark ? 'text-zinc-400' : 'text-zinc-500'
        }`}>
          <span>Verified {event.lastVerified}</span>
          {event.priceFrom && (
            <span className={isDark ? 'text-zinc-400' : 'text-zinc-600 font-medium'}>{event.priceFrom}</span>
          )}
        </div>

        <div className={`grid grid-cols-2 gap-2 pt-2 border-t ${
          isDark ? 'border-white/[0.04]' : 'border-zinc-300/70'
        }`}>
          <button
            onClick={() => onViewDetails(event)}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
              isDark 
                ? 'bg-white/[0.04] hover:bg-white/[0.09] text-zinc-200 hover:text-white border-white/[0.07]' 
                : 'bg-zinc-200/90 hover:bg-zinc-300 text-zinc-800 hover:text-zinc-950 border-zinc-300/90'
            }`}
          >
            <span>{isCompleted ? 'View Archive' : 'View Details'}</span>
            <ArrowRight className={`w-3 h-3 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`} />
          </button>

          <a
            href={event.officialWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
              isCompleted
                ? isDark
                  ? 'bg-white/[0.03] hover:bg-white/[0.07] text-zinc-300 hover:text-white border-white/[0.06]'
                  : 'bg-zinc-200 hover:bg-zinc-300 text-zinc-700 hover:text-zinc-950 border-zinc-300'
                : isDark 
                  ? 'bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 hover:text-amber-200 border-amber-400/20' 
                  : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-900 hover:text-amber-950 border-amber-500/30'
            }`}
          >
            <span>{isCompleted ? 'Event Website' : 'Official Site'}</span>
            <ExternalLink className={`w-3 h-3 ${isCompleted ? (isDark ? 'text-zinc-400' : 'text-zinc-600') : (isDark ? 'text-amber-400' : 'text-amber-800')}`} />
          </a>
        </div>
      </div>

    </div>
  );
};
