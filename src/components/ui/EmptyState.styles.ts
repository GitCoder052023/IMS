import { StyleSheet } from 'react-native';
import { colors, spacing, shadows } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[40],
    paddingHorizontal: spacing[24],
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.pureWhite,
    shadowColor: shadows.sm.shadowColor,
    shadowOpacity: shadows.sm.shadowOpacity,
    shadowRadius: shadows.sm.shadowRadius,
    shadowOffset: shadows.sm.shadowOffset,
    elevation: shadows.sm.elevation,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[16],
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.inkBlack,
    marginBottom: spacing[8],
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.mutedGray,
    textAlign: 'center',
    marginBottom: spacing[20],
    maxWidth: 320,
  },
  button: {
    marginTop: spacing[4],
  },
});
