import { StyleSheet } from 'react-native';
import { colors, radii, spacing, shadows } from '../../theme';

export const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[8],
    borderRadius: radii.button,
    paddingVertical: 10,
    paddingHorizontal: spacing[16],
  },
  primary: {
    backgroundColor: colors.shopViolet,
    shadowColor: shadows.violet.shadowColor,
    shadowOpacity: shadows.violet.shadowOpacity,
    shadowRadius: shadows.violet.shadowRadius,
    shadowOffset: shadows.violet.shadowOffset,
    elevation: shadows.violet.elevation,
  },
  secondary: {
    backgroundColor: colors.pureWhite,
    borderWidth: 1,
    borderColor: colors.faintBorder,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.faintBorder,
  },
  danger: {
    backgroundColor: colors.coralRed,
    shadowColor: colors.coralRed,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  pill: {
    backgroundColor: colors.pureWhite,
    borderWidth: 1,
    borderColor: colors.faintBorder,
    shadowColor: shadows.sm.shadowColor,
    shadowOpacity: shadows.sm.shadowOpacity,
    shadowRadius: shadows.sm.shadowRadius,
    shadowOffset: shadows.sm.shadowOffset,
    elevation: shadows.sm.elevation,
    paddingVertical: 6,
    paddingHorizontal: spacing[12],
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    opacity: 0.45,
  },
  textPrimary: {
    color: colors.pureWhite,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  textSecondary: {
    color: colors.inkBlack,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  textDanger: {
    color: colors.pureWhite,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  textPill: {
    color: colors.inkBlack,
    fontSize: 13,
    fontWeight: '400',
  },
});
