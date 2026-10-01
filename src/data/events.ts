/**
 * ==============================================================================
 * MELBOURNE EVENT RADAR - EVENT DATA MODULE
 * ==============================================================================
 * 
 * Master Event Data Store:
 * The canonical source of truth for events is stored in `src/data/events.json`.
 * 
 * HOW TO MAINTAIN & UPDATE EVENT DATA VIA AI STUDIO:
 * ------------------------------------------------------------------------------
 * When you copy/paste messy event batches from sources (e.g., MCEC listings,
 * Eventbrite, LinkedIn events, industry newsletters), prompt AI Studio like this:
 * 
 * "Extract all relevant Melbourne professional events from this text, classify
 * them according to our schema, and update src/data/events.json. Preserve official
 * URLs, assign the closest category from the controlled category list, set
 * lastVerified to the current month, and ensure chronological order."
 * 
 * CONTROLLED CATEGORIES:
 * - 'Conference'
 * - 'Expo'
 * - 'Networking'
 * - 'Corporate'
 * - 'Business'
 * - 'Community'
 * - 'Workshop'
 * - 'Seminar'
 * - 'Other'
 * 
 * REQUIRED FIELDS PER RECORD:
 * - id: unique lowercase slug (e.g. 'data-centre-world-australia-2026')
 * - name: official event title
 * - startDate: ISO string YYYY-MM-DD
 * - endDate: ISO string YYYY-MM-DD or null
 * - dateDisplay: human readable date (e.g. '21–22 October 2026')
 * - venue: full venue name (e.g. 'Melbourne Convention and Exhibition Centre')
 * - suburb: Melbourne suburb (e.g. 'South Wharf', 'Melbourne CBD', etc.)
 * - category: one of the controlled categories
 * - organiser: official organisation name or null if unavailable
 * - description: 1-3 sentences of objective factual summary
 * - officialWebsite: link to the event's official site or ticket page
 * - sourceUrl: original URL where information was found
 * - lastVerified: verification stamp (e.g. 'September 2026')
 * - status: 'Confirmed' | 'Postponed' | 'Cancelled' | 'TBC'
 * 
 * OPTIONAL FIELDS:
 * - industry: sector or industry vertical
 * - audience: intended attendees
 * - priceFrom: pricing indication if publicly specified
 * - featured: boolean flag
 * ==============================================================================
 */

import { MelbourneEvent, IndustryCategory } from '../types';
import rawEvents from './events.json';
import { generateMonthOptions } from '../utils/dateUtils';

// Type assertion ensuring events match the MelbourneEvent interface
export const EVENTS: MelbourneEvent[] = (rawEvents as MelbourneEvent[]).sort((a, b) => 
  new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
);

export const AVAILABLE_MONTHS = generateMonthOptions(EVENTS);

export const CATEGORIES: { label: string; value: string }[] = [
  { label: 'All', value: 'All' },
  { label: 'Conferences', value: 'Conference' },
  { label: 'Expos', value: 'Expo' },
  { label: 'Corporate', value: 'Corporate' },
  { label: 'Community', value: 'Community' },
  { label: 'Networking', value: 'Networking' }
];

export const INDUSTRY_CATEGORIES: { label: string; value: string }[] = [
  { label: 'All', value: 'All' },
  { label: 'Infrastructure', value: 'Infrastructure' },
  { label: 'Healthcare', value: 'Healthcare' },
  { label: 'Research', value: 'Research' },
  { label: 'Creative', value: 'Creative' },
  { label: 'Commerce', value: 'Commerce' },
  { label: 'Civic', value: 'Civic' }
];

// Helper to get industry categories for an event with heuristic fallback
export function getEventIndustryCategories(event: MelbourneEvent): IndustryCategory[] {
  if (event.industryCategories && event.industryCategories.length > 0) {
    return event.industryCategories;
  }

  const results: IndustryCategory[] = [];
  const text = `${event.name} ${event.description} ${event.industry || ''}`.toLowerCase();

  if (
    text.includes('infrastructure') ||
    text.includes('construction') ||
    text.includes('building') ||
    text.includes('energy') ||
    text.includes('asset management') ||
    text.includes('freight') ||
    text.includes('logistics') ||
    text.includes('facility') ||
    text.includes('cleaning')
  ) {
    results.push('Infrastructure');
  }

  if (
    text.includes('health') ||
    text.includes('medical') ||
    text.includes('hospital') ||
    text.includes('pediatric') ||
    text.includes('pulmonology') ||
    text.includes('wellness') ||
    text.includes('disability') ||
    text.includes('ndis') ||
    text.includes('cannabis')
  ) {
    results.push('Healthcare');
  }

  if (
    text.includes('research') ||
    text.includes('data science') ||
    text.includes('analytics') ||
    text.includes('clinical') ||
    text.includes('symposium') ||
    text.includes('fellowship') ||
    text.includes('education') ||
    text.includes('agritech') ||
    text.includes('ai')
  ) {
    results.push('Research');
  }

  if (
    text.includes('photo') ||
    text.includes('video') ||
    text.includes('design') ||
    text.includes('creative') ||
    text.includes('gaming') ||
    text.includes('marketing') ||
    text.includes('content') ||
    text.includes('arts') ||
    text.includes('food') ||
    text.includes('wine') ||
    text.includes('media') ||
    text.includes('publishing')
  ) {
    results.push('Creative');
  }

  if (
    text.includes('retail') ||
    text.includes('e-commerce') ||
    text.includes('trade') ||
    text.includes('commerce') ||
    text.includes('fintech') ||
    text.includes('banking') ||
    text.includes('treasury') ||
    text.includes('investor') ||
    text.includes('investment') ||
    text.includes('startup') ||
    text.includes('venture') ||
    text.includes('business') ||
    text.includes('sourcing') ||
    text.includes('networking')
  ) {
    results.push('Commerce');
  }

  if (
    text.includes('civic') ||
    text.includes('housing') ||
    text.includes('charity') ||
    text.includes('philanthropy') ||
    text.includes('cohesion') ||
    text.includes('public safety') ||
    text.includes('governance') ||
    text.includes('hall of fame') ||
    text.includes('sports')
  ) {
    results.push('Civic');
  }

  return results.length > 0 ? results : ['Commerce'];
}

export function isEventMatchingIndustry(event: MelbourneEvent, industry: string): boolean {
  if (industry === 'All') return true;
  const categories = getEventIndustryCategories(event);
  return categories.includes(industry as IndustryCategory);
}

export const PRIMARY_VENUES = [
  'Melbourne Convention and Exhibition Centre',
  'Royal Exhibition Building',
  'CENTREPIECE at Melbourne Park',
  'Crown Promenade Melbourne',
  'Rydges Melbourne'
] as const;

export const OTHER_VENUE_LABEL = 'Other Venues';

export function isPrimaryVenue(venue: string): boolean {
  return PRIMARY_VENUES.some((pv) => venue.toLowerCase().includes(pv.toLowerCase()));
}

export function getVenueCategory(venue: string): string {
  const match = PRIMARY_VENUES.find((pv) => venue.toLowerCase().includes(pv.toLowerCase()));
  return match || OTHER_VENUE_LABEL;
}

export function getVenuesList(_events?: MelbourneEvent[]): string[] {
  return [
    ...PRIMARY_VENUES,
    OTHER_VENUE_LABEL
  ];
}
