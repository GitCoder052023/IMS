import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvasMist,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[16],
    paddingVertical: spacing[12],
    borderBottomWidth: 1,
    borderBottomColor: colors.faintBorder,
    backgroundColor: colors.pureWhite,
  },
  headerTitleCol: {
    gap: 2,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.inkBlack,
    letterSpacing: -1.0,
  },
  dateSubtitle: {
    fontSize: 13,
    color: colors.mutedGray,
    fontWeight: '400',
  },
  scrollContent: {
    padding: spacing[16],
    paddingBottom: spacing[40],
    gap: spacing[20],
  },
  emptyContainer: {
    marginTop: spacing[48],
  },
  sectionBlock: {
    gap: spacing[10],
  },
  sectionHeaderTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.mutedGray,
    letterSpacing: 0.6,
    paddingLeft: spacing[4],
  },
  sectionTitleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: spacing[4],
  },
  attentionCountBadge: {
    backgroundColor: 'rgba(235, 87, 87, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(235, 87, 87, 0.2)',
  },
  attentionCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.coralRed,
  },
  activityCountText: {
    fontSize: 12,
    color: colors.mutedGray,
  },
  allGoodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[14],
    padding: spacing[16],
    backgroundColor: colors.pureWhite,
    borderColor: 'rgba(39, 166, 68, 0.15)',
  },
  allGoodIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(39, 166, 68, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  allGoodTextCol: {
    flex: 1,
    gap: 2,
  },
  allGoodTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.inkBlack,
  },
  allGoodSubtitle: {
    fontSize: 12,
    color: colors.mutedGray,
    lineHeight: 16,
  },
  attentionList: {
    gap: spacing[8],
  },
  viewAllAttentionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[6],
    paddingVertical: spacing[10],
    backgroundColor: colors.pureWhite,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: colors.faintBorder,
  },
  viewAllAttentionText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.slateInk,
  },
});
