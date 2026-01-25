/**
 * Parser Index
 * @module workers/parsers
 *
 * Exports all platform parsers.
 */

export * from './types';
export * from './BaseParser';
export { TwitterParser, default as twitter } from './TwitterParser';
export { InstagramParser, default as instagram } from './InstagramParser';
export { LinkedInParser, default as linkedin } from './LinkedInParser';
export { FacebookParser, default as facebook } from './FacebookParser';
export { TikTokParser, default as tiktok } from './TikTokParser';

import type { Platform } from '@vsg/shared';
import type { PlatformParser } from './types';
import { TwitterParser } from './TwitterParser';
import { InstagramParser } from './InstagramParser';
import { LinkedInParser } from './LinkedInParser';
import { FacebookParser } from './FacebookParser';
import { TikTokParser } from './TikTokParser';

/**
 * Get parser for a platform
 */
export function getParser(platform: Platform): PlatformParser {
  switch (platform) {
    case 'TWITTER':
      return new TwitterParser();
    case 'INSTAGRAM':
      return new InstagramParser();
    case 'LINKEDIN':
      return new LinkedInParser();
    case 'FACEBOOK':
      return new FacebookParser();
    case 'TIKTOK':
      return new TikTokParser();
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}
