import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../../theme';

export const styles = StyleSheet.create({
  healthCard: {
    padding: spacing[16],
    gap: spacing[16],
  },
  healthStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  healthStatCol: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  healthStatValue: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -1.0,
  },
  healthStatLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.mutedGray,
  },
  healthDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.faintBorder,
  },
  progressSection: {
    borderTopWidth: 1,
    borderTopColor: colors.faintBorder,
    paddingTop: spacing[14],
    gap: spacing[8],
  },
  progressBarWrapper: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.faintBorder,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  progressBarAvailable: {
    height: '100%',
    backgroundColor: colors.pulseGreen,
  },
  progressBarDamaged: {
    height: '100%',
    backgroundColor: colors.coralRed,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 12,
    color: colors.slateInk,
  },
  percentageText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.inkBlack,
  },
});
