/**
 * Design Tokens per DESIGN.md (Linear - Midnight Precision Instrument)
 */

export const colors = {
  // Canvas & Surfaces
  void: '#08090a',       // Page canvas, full-bleed backgrounds
  carbon: '#0f1011',     // Card surfaces, nav bars
  obsidian: '#161718',   // Elevated surfaces, modal panels
  slate: '#23252a',      // Interactive surface tint, ghost button fills

  // Borders & Dividers
  graphite: '#23252a',   // Low-contrast structural edges, hairline borders
  smoke: '#383b3f',      // Higher contrast section separators

  // Typography
  paper: '#ffffff',      // Primary headings, max-contrast emphasis
  bone: '#e5e5e6',       // Near-white text, high-contrast text
  mist: '#d0d6e0',       // Secondary headings, body text, button text
  fog: '#8a8f98',        // Secondary metadata, inactive icons, placeholder copy
  ash: '#62666d',        // Muted body text, subtle captions

  // Accents
  acidLime: '#e4f222',   // Primary CTA button, active nav indicator (sole filled chromatic button)
  pulseGreen: '#27a644', // In-stock indicator, success accents
  coralRed: '#eb5757',   // Out-of-stock indicator, destructive actions, error wash
  amber: '#f59e0b',      // Low-stock warning indicator
  irisViolet: '#6366f1', // Category tag fills
  lavender: '#8b5cf6',   // Secondary tag fills
  signalTeal: '#02b8cc', // Informational accents
};

export const radii = {
  sm: 2,
  badge: 4,
  input: 6,
  button: 6,
  card: 12,
  pill: 9999,
};

export const spacing = {
  2: 2,
  4: 4,
  6: 6,
  8: 8,
  10: 10,
  12: 12,
  14: 14,
  16: 16,
  20: 20,
  24: 24,
  28: 28,
  32: 32,
  40: 40,
  48: 48,
};

export const typography = {
  caption: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0,
  },
  bodySm: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.1,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: -0.165,
  },
  bodyLg: {
    fontSize: 17,
    lineHeight: 24,
    letterSpacing: -0.2,
  },
  subheading: {
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: -0.24,
    fontWeight: '600' as const,
  },
  headingSm: {
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.288,
    fontWeight: '600' as const,
  },
  heading: {
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.5,
    fontWeight: '600' as const,
  },
};
