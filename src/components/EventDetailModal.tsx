import React, { useEffect } from 'react';
import { MelbourneEvent } from '../types';
import { 
  X, Calendar, MapPin, ExternalLink, Building2, 
  CheckCircle2, ShieldCheck, Compass, Clock, AlertCircle, Archive
} from 'lucide-react';
import { getCategoryBadgeStyle } from './EventCard';
import { useTheme } from '../context/ThemeContext';
import { getCalculatedEventStatus, getLocalDateString } from '../utils/dateUtils';

interface EventDetailModalProps {
  event: MelbourneEvent | null;
  onClose: () => void;
  todayStr?: string;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({ 
  event, 
  onClose,
  todayStr = getLocalDateString()
}) => {
  const { isDark } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (event) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [event, onClose]);

  if (!event) return null;

  const categoryBadgeClass = getCategoryBadgeStyle(event.category, isDark);
  const calculatedStatus = getCalculatedEventStatus(event, todayStr);
  const isCompleted = calculatedStatus === 'Completed';

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${event.venue}, ${event.suburb || 'Melbourne'}, Victoria, Australia`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className={`fixed inset-0 backdrop-blur-sm transition-opacity ${
          isDark ? 'bg-black/80' : 'bg-black/50'
        }`}
      />

      {/* Modal Dialog */}
      <div className={`relative w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden z-10 my-8 transition-colors duration-200 border ${
        isDark 
          ? 'bg-[#1d1d23] border-white/[0.12] text-white' 
          : 'bg-[#f0f0f5] border-zinc-300/90 text-zinc-900'
      }`}>
        
        {/* Top Header bar with status & close button */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isDark ? 'border-white/[0.08] bg-white/[0.02]' : 'border-zinc-300/80 bg-zinc-200/50'
        }`}>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase border ${categoryBadgeClass}`}>
              {event.category}
            </span>
            
            {isCompleted ? (
              <span className={`inline-flex items-center gap-1 text-xs font-semibold tracking-wide uppercase px-2 py-0.5 rounded border ${
                isDark 
                  ? 'text-zinc-400 bg-zinc-800/80 border-zinc-700/60' 
                  : 'text-zinc-600 bg-zinc-300/80 border-zinc-400/70'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                <span>Completed</span>
              </span>
            ) : calculatedStatus === 'Upcoming' ? (
              <span className={`inline-flex items-center gap-1 text-xs font-semibold tracking-wide uppercase px-2 py-0.5 rounded border ${
                isDark 
                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                  : 'text-emerald-800 bg-emerald-500/15 border-emerald-500/30'
              }`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{event.status === 'Confirmed' ? 'Confirmed' : 'Upcoming'}</span>
              </span>
            ) : (
              <span className={`inline-flex items-center gap-1 text-xs font-semibold tracking-wide uppercase px-2 py-0.5 rounded border ${
                isDark 
                  ? 'text-amber-300 bg-amber-500/10 border-amber-500/20' 
                  : 'text-amber-800 bg-amber-500/15 border-amber-500/30'
              }`}>
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{calculatedStatus}</span>
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              isDark 
                ? 'text-zinc-400 hover:text-white hover:bg-white/[0.08]' 
                : 'text-zinc-500 hover:text-zinc-950 hover:bg-zinc-300'
            }`}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Concluded Archive Notice Banner */}
          {isCompleted && (
            <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
              isDark 
                ? 'bg-zinc-900/90 border-zinc-700/60 text-zinc-300' 
                : 'bg-zinc-200/90 border-zinc-300 text-zinc-800'
            }`}>
              <Archive className={`w-5 h-5 shrink-0 mt-0.5 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`} />
              <div className="text-xs space-y-1">
                <strong className={`font-semibold block ${isDark ? 'text-zinc-200' : 'text-zinc-900'}`}>
                  Historical Event Archive
                </strong>
                <p className="leading-relaxed">
                  This event concluded on <span className="font-semibold">{event.dateDisplay}</span>. Information, schedules, and venue details are preserved for historical record.
                </p>
              </div>
            </div>
          )}

          {/* Event Title */}
          <div>
            <div className={`flex items-center gap-2 text-xs font-bold tracking-normal mb-2 ${
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
            <h2 className={`text-2xl sm:text-3xl font-bold font-montserrat tracking-tight leading-tight ${
              isDark ? 'text-white' : 'text-zinc-950'
            }`}>
              {event.name}
            </h2>
          </div>

          {/* Key Facts Grid */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl border text-xs ${
            isDark 
              ? 'bg-white/[0.02] border-white/[0.05]' 
              : 'bg-white/90 border-zinc-300 shadow-2xs'
          }`}>
            
            {/* Venue */}
            <div className="space-y-1">
              <div className={`flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] ${
                isDark ? 'text-zinc-400' : 'text-zinc-500'
              }`}>
                <MapPin className={`w-3.5 h-3.5 ${isDark ? 'text-amber-400' : 'text-amber-700'}`} />
                <span>VENUE</span>
              </div>
              <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                {event.venue}
              </p>
              <p className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>
                {event.suburb ? `${event.suburb}, Melbourne VIC` : 'Melbourne, Victoria'}
              </p>
              <a 
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1 text-[11px] hover:underline pt-0.5 font-semibold ${
                  isDark ? 'text-amber-400' : 'text-amber-800'
                }`}
              >
                <span>View on Google Maps</span>
                <Compass className="w-3 h-3" />
              </a>
            </div>

            {/* Organiser */}
            <div className="space-y-1">
              <div className={`flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] ${
                isDark ? 'text-zinc-400' : 'text-zinc-500'
              }`}>
                <Building2 className={`w-3.5 h-3.5 ${isDark ? 'text-amber-400' : 'text-amber-700'}`} />
                <span>ORGANISER</span>
              </div>
              <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                {event.organiser || 'Not specified in source'}
              </p>
              {event.industry && (
                <p className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>
                  Industry: <span className={isDark ? 'text-zinc-300' : 'text-zinc-900 font-medium'}>{event.industry}</span>
                </p>
              )}
              {event.priceFrom && (
                <p className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>
                  Pricing: <span className={isDark ? 'text-zinc-300' : 'text-zinc-900 font-medium'}>{event.priceFrom}</span>
                </p>
              )}
            </div>

          </div>

          {/* About The Event */}
          <div className="space-y-2">
            <h4 className={`text-[11px] font-bold uppercase tracking-wider ${
              isDark ? 'text-zinc-400' : 'text-zinc-500'
            }`}>
              About the Event
            </h4>
            <div className={`text-sm leading-relaxed space-y-3 font-normal ${
              isDark ? 'text-zinc-300' : 'text-zinc-700'
            }`}>
              <p>{event.description}</p>
              {event.audience && (
                <div className={`p-3 rounded-xl border text-xs ${
                  isDark 
                    ? 'bg-white/[0.02] border-white/[0.04] text-zinc-400' 
                    : 'bg-zinc-200/60 border-zinc-300 text-zinc-700'
                }`}>
                  <strong className={isDark ? 'text-zinc-300' : 'text-zinc-900'}>Target Audience:</strong> {event.audience}
                </div>
              )}
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="space-y-3 pt-2">
            <a
              href={event.officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg group cursor-pointer ${
                isCompleted
                  ? isDark
                    ? 'bg-white/[0.08] hover:bg-white/[0.14] text-white shadow-none border border-white/[0.1]'
                    : 'bg-zinc-800 hover:bg-zinc-900 text-white shadow-none border border-zinc-700'
                  : 'bg-amber-400 hover:bg-amber-300 text-zinc-950 shadow-amber-400/20'
              }`}
            >
              <span>{isCompleted ? 'Visit Event Website (Archived Record)' : 'Visit Official Event Website'}</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>

            <p className={`text-center text-[11px] ${
              isDark ? 'text-zinc-400' : 'text-zinc-600'
            }`}>
              {isCompleted
                ? 'This event has concluded. Registrations and tickets are closed on the official website.'
                : 'Registrations, official tickets, and schedules are handled directly on the organiser’s official website.'}
            </p>
          </div>

          {/* Source Verification Box */}
          <div className={`pt-4 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-medium ${
            isDark ? 'border-white/[0.06] text-zinc-400' : 'border-zinc-300 text-zinc-600'
          }`}>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Verified {event.lastVerified}</span>
            </div>

            {event.sourceUrl && (
              <div className="truncate max-w-xs">
                <span>Source: </span>
                <a 
                  href={event.sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`underline truncate ${
                    isDark ? 'text-zinc-400 hover:text-amber-400' : 'text-zinc-600 hover:text-amber-800'
                  }`}
                >
                  {event.sourceUrl.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
