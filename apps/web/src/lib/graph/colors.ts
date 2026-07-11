/**
 * Graph Color Utilities
 * @module lib/graph/colors
 *
 * Shared color palette for community visualization.
 * Supports up to 50+ communities with color cycling.
 */

// Hex colors for D3/Canvas rendering (Industry-based)
export const COMMUNITY_COLORS_HEX = [
  '#3B82F6', // Blue - Technology
  '#8B5CF6', // Purple - Creative
  '#10B981', // Green - Business
  '#F59E0B', // Amber - Media
  '#EC4899', // Pink - Education
  '#06B6D4', // Cyan - Healthcare
  '#14B8A6', // Teal - Finance
  '#6366F1', // Indigo - Community
  // Additional colors for extra communities (if needed)
  '#84CC16', // Lime
  '#F97316', // Orange
  '#A855F7', // Violet
  '#22C55E', // Emerald
  '#FACC15', // Yellow
  '#E11D48', // Rose
  '#0EA5E9', // Sky
  '#EF4444', // Red
];

// CSS class names for Tailwind styling
export const COMMUNITY_COLORS_CSS = [
  { bg: 'bg-blue-500', text: 'text-blue-500', border: 'border-blue-500' },
  { bg: 'bg-purple-500', text: 'text-purple-500', border: 'border-purple-500' },
  { bg: 'bg-emerald-500', text: 'text-emerald-500', border: 'border-emerald-500' },
  { bg: 'bg-amber-500', text: 'text-amber-500', border: 'border-amber-500' },
  { bg: 'bg-pink-500', text: 'text-pink-500', border: 'border-pink-500' },
  { bg: 'bg-cyan-500', text: 'text-cyan-500', border: 'border-cyan-500' },
  { bg: 'bg-red-500', text: 'text-red-500', border: 'border-red-500' },
  { bg: 'bg-indigo-500', text: 'text-indigo-500', border: 'border-indigo-500' },
  { bg: 'bg-lime-500', text: 'text-lime-500', border: 'border-lime-500' },
  { bg: 'bg-orange-500', text: 'text-orange-500', border: 'border-orange-500' },
  { bg: 'bg-teal-500', text: 'text-teal-500', border: 'border-teal-500' },
  { bg: 'bg-violet-500', text: 'text-violet-500', border: 'border-violet-500' },
  { bg: 'bg-green-500', text: 'text-green-500', border: 'border-green-500' },
  { bg: 'bg-yellow-500', text: 'text-yellow-500', border: 'border-yellow-500' },
  { bg: 'bg-rose-500', text: 'text-rose-500', border: 'border-rose-500' },
  { bg: 'bg-sky-500', text: 'text-sky-500', border: 'border-sky-500' },
];

/**
 * Get hex color for a community ID (cycles through palette)
 */
export function getCommunityColorHex(communityId: number): string {
  return COMMUNITY_COLORS_HEX[communityId % COMMUNITY_COLORS_HEX.length];
}

/**
 * Get CSS classes for a community ID (cycles through palette)
 */
export function getCommunityColorCSS(communityId: number): { bg: string; text: string; border: string } {
  return COMMUNITY_COLORS_CSS[communityId % COMMUNITY_COLORS_CSS.length];
}

/**
 * Industry-based community names
 */
const INDUSTRY_NAMES: { [key: number]: string } = {
  0: 'Technology',
  1: 'Creative',
  2: 'Business',
  3: 'Media',
  4: 'Education',
  5: 'Healthcare',
  6: 'Finance',
  7: 'Community',
};

/**
 * Generate a display name for a community based on industry classification
 * @param communityId Community ID (0-7 for industries)
 * @param size Number of nodes in the community
 */
export function getCommunityDisplayName(communityId: number, size?: number): string {
  const sizeLabel = size ? ` (${size})` : '';

  // Return industry name if available
  const industryName = INDUSTRY_NAMES[communityId];
  if (industryName) {
    return `${industryName}${sizeLabel}`;
  }

  // Fallback for unexpected community IDs
  return `Community ${communityId + 1}${sizeLabel}`;
}

/**
 * Build community info array from graph statistics
 */
export interface CommunityDisplayInfo {
  id: number;
  name: string;
  size: number;
  color: string;
  colorCSS: { bg: string; text: string; border: string };
}

export function buildCommunityDisplayList(
  communitySizes: number[],
  maxDisplay: number = 10
): CommunityDisplayInfo[] {
  return communitySizes
    .slice(0, maxDisplay)
    .map((size, index) => ({
      id: index,
      name: getCommunityDisplayName(index, size),
      size,
      color: getCommunityColorHex(index),
      colorCSS: getCommunityColorCSS(index),
    }));
}
