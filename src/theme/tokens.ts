/**
 * Design Tokens — "Shop — White Marble" Design System
 * Light theme · Single violet accent · Pillow-soft radii · GT Standard typography
 */

export const colors = {
  // Canvas & Surfaces
  canvasMist: '#f2f4f5',     // Page background, secondary surface wash
  pureWhite: '#ffffff',       // Primary surface for cards, inputs, pills
  inkBlack: '#000000',        // Primary text, headings, icons
  slateInk: '#332f2d',        // Dark product card surfaces, deep-tone text

  // Borders & Dividers
  faintBorder: '#ebebeb',     // Hairline dividers, input outlines, pill borders

  // Typography
  mutedGray: '#787574',       // Secondary text, nav labels, placeholder copy
  coolStone: '#cccccc',       // Placeholder fills, disabled states
  warmFog: '#acb0aa',         // Subtle surface tints, secondary backgrounds
  ashVeil: '#665a54',         // Warm desaturated gray, subtle captions

  // Accents
  shopViolet: '#5433eb',      // Primary action, wordmark, search submit — the ONLY saturated accent
  violetWash: '#c0b5f3',      // Translucent halo behind violet elements

  // Semantic Status (adapted for light backgrounds)
  pulseGreen: '#27a644',      // In-stock indicator, success accents
  coralRed: '#eb5757',        // Out-of-stock, destructive actions, error
  amber: '#f59e0b',           // Low-stock warning indicator

  // ---- Legacy aliases for backward compatibility during migration ----
  // These map old token names to new values so imports don't break
  void: '#f2f4f5',            // was dark canvas → now canvas mist
  carbon: '#ffffff',          // was dark card → now white surface
  obsidian: '#ffffff',        // was elevated dark → now white surface
  slate: '#f2f4f5',           // was interactive tint → now canvas mist
  graphite: '#ebebeb',        // was dark border → now faint border
  smoke: '#ebebeb',           // was separator → now faint border
  paper: '#000000',           // was white text → now ink black (primary text)
  bone: '#000000',            // was near-white → now ink black
  mist: '#332f2d',            // was secondary text → now slate ink
  fog: '#787574',             // was placeholder → now muted gray
  ash: '#acb0aa',             // was muted caption → now warm fog
  acidLime: '#5433eb',        // was lime CTA → now shop violet
  irisViolet: '#5433eb',      // was category tag → now shop violet
  lavender: '#c0b5f3',        // was secondary tag → now violet wash
  signalTeal: '#5433eb',      // was info accent → now shop violet
};

export const radii = {
  sm: 4,
  badge: 9999,
  input: 9999,
  button: 9999,
  card: 28,
  pill: 9999,
  chips: 9999,
  search: 9999,
  innerImage: 20,
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
  64: 64,
};

export const shadows = {
  /** Category pill, cookie button — subtle lift */
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  /** Hero product card, brand spotlight — dual-layer soft */
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  /** Carousel arrow, elevated controls */
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 6,
  },
  /** Violet-tinted shadow for primary action button */
  violet: {
    shadowColor: '#5433eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.34,
    shadowRadius: 24,
    elevation: 6,
  },
};

export const typography = {
  caption: {
    fontSize: 11,
    lineHeight: 14.63,
    letterSpacing: -0.017 * 11,
  },
  bodySm: {
    fontSize: 12,
    lineHeight: 15.96,
    letterSpacing: -0.017 * 12,
  },
  body: {
    fontSize: 14,
    lineHeight: 18.62,
    letterSpacing: -0.014 * 14,
  },
  bodyLg: {
    fontSize: 16,
    lineHeight: 21.28,
    letterSpacing: -0.031 * 16,
  },
  subheading: {
    fontSize: 20,
    lineHeight: 22,
    letterSpacing: -0.05 * 20,
    fontWeight: '600' as const,
  },
};
