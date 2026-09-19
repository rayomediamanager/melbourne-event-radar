export type EventCategory = 
  | 'Conference'
  | 'Expo'
  | 'Corporate'
  | 'Community'
  | 'Networking'
  | 'Other';

export type EventStatus = 'Confirmed' | 'Postponed' | 'Cancelled' | 'TBC';

export type CalculatedEventStatus = 'Upcoming' | 'Completed' | 'Postponed' | 'Cancelled' | 'TBC';

export interface MelbourneEvent {
  id: string;
  name: string;
  startDate: string; // ISO format: YYYY-MM-DD (e.g., '2026-10-21')
  endDate: string | null; // ISO format: YYYY-MM-DD (or null for single-day)
  dateDisplay: string; // Human-friendly display (e.g., '21–22 October 2026')
  venue: string; // e.g., 'Melbourne Convention and Exhibition Centre'
  suburb: string; // e.g., 'South Wharf'
  category: EventCategory;
  organiser: string | null; // e.g., 'CloserStill Media' or null if not specified
  description: string; // Short factual description of the event
  officialWebsite: string; // Official event or registration URL
  sourceUrl: string; // Where this listing was originally verified
  lastVerified: string; // Verification date tag, e.g., 'September 2026'
  status: EventStatus;
  
  // Optional metadata fields
  industry?: string; // e.g., 'Information Technology', 'Biotechnology'
  audience?: string; // e.g., 'Enterprise leaders, IT infrastructure teams'
  priceFrom?: string; // e.g., 'Free expo pass' or '$250'
  featured?: boolean;
}

export interface MonthOption {
  key: string;
  label: string;
  available: boolean;
  eventCount?: number;
  upcomingCount?: number;
  completedCount?: number;
  isPast?: boolean;
  isCurrent?: boolean;
  isSpecial?: boolean;
  isArchive?: boolean;
}
