/**
 * Template Interpolator
 * @module services/insights/interpolator
 *
 * Interpolates variables into insight templates.
 */

import type { InsightTemplate } from './matcher.js';

// ============================================================
// TYPES
// ============================================================

export interface InterpolatedInsight {
  title: string;
  description: string;
}

// ============================================================
// INTERPOLATION
// ============================================================

/**
 * Interpolate variables into a template
 */
export function interpolateTemplate(
  template: InsightTemplate,
  variables: Record<string, unknown>
): InterpolatedInsight {
  return {
    title: interpolateString(template.title, variables),
    description: interpolateString(template.description, variables),
  };
}

/**
 * Interpolate variables into a string
 * Supports {{variable}} and {{variable.property}} syntax
 */
function interpolateString(
  template: string,
  variables: Record<string, unknown>
): string {
  return template.replace(/\{\{([^}]+)\}\}/g, (_match: string, path: string) => {
    const value = getNestedValue(variables, path.trim());
    return formatValue(value);
  });
}

/**
 * Get nested value from object using dot notation
 */
function getNestedValue(
  obj: Record<string, unknown>,
  path: string
): unknown {
  const parts = path.split('.');
  let value: unknown = obj;

  for (const part of parts) {
    if (value === null || value === undefined) {
      return undefined;
    }

    // Handle array methods
    if (part.includes('(') && part.includes(')')) {
      const methodMatch = part.match(/^(\w+)\(([^)]*)\)$/);
      if (methodMatch) {
        const methodName = methodMatch[1];
        const args = methodMatch[2];
        if (methodName && args !== undefined) {
          value = applyMethod(value, methodName, args);
        }
        continue;
      }
    }

    // Handle array indexing
    const indexMatch = part.match(/^(\w+)\[(\d+)\]$/);
    if (indexMatch) {
      const prop = indexMatch[1];
      const index = indexMatch[2];
      if (prop) {
        value = (value as Record<string, unknown>)[prop];
      }
      if (Array.isArray(value) && index) {
        value = value[parseInt(index, 10)];
      }
      continue;
    }

    if (typeof value === 'object') {
      value = (value as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }

  return value;
}

/**
 * Apply a method to a value
 */
function applyMethod(
  value: unknown,
  methodName: string,
  args: string
): unknown {
  if (Array.isArray(value)) {
    switch (methodName) {
      case 'length':
        return value.length;
      case 'first':
        return value[0];
      case 'last':
        return value[value.length - 1];
      case 'slice': {
        const [start, end] = args.split(',').map((a) => parseInt(a.trim(), 10));
        return value.slice(start, end);
      }
      case 'join': {
        const separator = args.replace(/['"]/g, '') || ', ';
        return value.join(separator);
      }
      case 'map': {
        const prop = args.trim();
        return value.map((item) =>
          typeof item === 'object' ? (item as Record<string, unknown>)[prop] : item
        );
      }
    }
  }

  if (typeof value === 'number') {
    switch (methodName) {
      case 'toFixed':
        return value.toFixed(parseInt(args, 10) || 2);
      case 'round':
        return Math.round(value);
      case 'floor':
        return Math.floor(value);
      case 'ceil':
        return Math.ceil(value);
      case 'percent':
        return `${(value * 100).toFixed(parseInt(args, 10) || 0)}%`;
    }
  }

  if (typeof value === 'string') {
    switch (methodName) {
      case 'uppercase':
        return value.toUpperCase();
      case 'lowercase':
        return value.toLowerCase();
      case 'capitalize':
        return value.charAt(0).toUpperCase() + value.slice(1);
    }
  }

  return value;
}

/**
 * Format a value for display
 */
function formatValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'number') {
    // Format large numbers with commas
    if (value >= 1000) {
      return value.toLocaleString();
    }
    // Format decimals
    if (!Number.isInteger(value)) {
      return value.toFixed(2);
    }
    return value.toString();
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (Array.isArray(value)) {
    return value.map((v) => formatValue(v)).join(', ');
  }

  if (typeof value === 'object') {
    // For objects, try to get a meaningful string representation
    const obj = value as Record<string, unknown>;
    if ('label' in obj) return String(obj['label']);
    if ('name' in obj) return String(obj['name']);
    if ('id' in obj) return String(obj['id']);
    if ('nodeId' in obj) return String(obj['nodeId']);
    return JSON.stringify(value);
  }

  return String(value);
}

// ============================================================
// HELPERS
// ============================================================

/**
 * Create a pluralized string
 */
export function pluralize(
  count: number,
  singular: string,
  plural?: string
): string {
  const p = plural || `${singular}s`;
  return count === 1 ? `${count} ${singular}` : `${count} ${p}`;
}

/**
 * Format a percentage
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format a number with appropriate suffix (K, M, B)
 */
export function formatNumber(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toString();
}

/**
 * Get ordinal suffix for a number
 */
export function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0] || 'th');
}

export default interpolateTemplate;
