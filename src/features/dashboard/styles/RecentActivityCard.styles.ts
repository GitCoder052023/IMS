import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../../theme';

export const styles = StyleSheet.create({
  activityCard: {
    padding: spacing[14],
  },
  emptyActivityBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[20],
    gap: spacing[8],
  },
  emptyActivityText: {
    fontSize: 13,
    color: colors.mutedGray,
    fontStyle: 'italic',
  },
  activityList: {
    gap: spacing[12],
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[12],
    paddingVertical: spacing[4],
  },
  activityRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.faintBorder,
    paddingBottom: spacing[10],
  },
  activityIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  activityContentCol: {
    flex: 1,
    gap: 3,
  },
  activityTitleText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.inkBlack,
    letterSpacing: -0.2,
  },
  activityMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  activityTimestamp: {
    fontSize: 11,
    color: colors.mutedGray,
  },
  activityDot: {
    fontSize: 11,
    color: colors.warmFog,
  },
  activityNote: {
    fontSize: 11,
    color: colors.warmFog,
    fontStyle: 'italic',
    maxWidth: 180,
  },
  viewAllHistoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing[8],
    borderTopWidth: 1,
    borderTopColor: colors.faintBorder,
  },
  viewAllHistoryText: {
    fontSize: 12,
    color: colors.mutedGray,
  },
});
