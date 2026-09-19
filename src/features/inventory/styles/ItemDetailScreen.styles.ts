import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvasMist,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.faintBorder,
    backgroundColor: colors.pureWhite,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.inkBlack,
    maxWidth: 220,
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionIconBtn: {
    padding: 4,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 48,
    gap: 20,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[24],
  },
  notFoundText: {
    fontSize: 14,
    color: colors.mutedGray,
    textAlign: 'center',
  },
  itemHeaderBlock: {
    gap: spacing[8],
  },
  itemName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.inkBlack,
    letterSpacing: -1.0,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  breakdownCard: {
    gap: 16,
  },
  cardHeaderTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.mutedGray,
    letterSpacing: 0.6,
  },
  primaryMetricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[24],
    paddingVertical: spacing[4],
  },
  primaryMetricValue: {
    fontSize: 38,
    fontWeight: '800',
    color: colors.inkBlack,
    letterSpacing: -1.0,
  },
  primaryMetricLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.mutedGray,
    letterSpacing: 0.4,
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.faintBorder,
  },
  secondaryMetricValue: {
    fontSize: 26,
    fontWeight: '600',
    color: colors.slateInk,
    letterSpacing: -0.5,
  },
  secondaryMetricLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.warmFog,
    letterSpacing: 0.4,
    marginTop: 2,
  },
  metricDetailGrid: {
    flexDirection: 'row',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.faintBorder,
    paddingTop: 12,
  },
  metricTile: {
    flex: 1,
    gap: 2,
  },
  tileLabel: {
    fontSize: 12,
    color: colors.mutedGray,
  },
  tileValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.slateInk,
  },
  notesBox: {
    backgroundColor: colors.canvasMist,
    borderRadius: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.faintBorder,
    gap: 4,
  },
  notesLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.mutedGray,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  notesBody: {
    fontSize: 13,
    color: colors.slateInk,
    lineHeight: 18,
  },
  sectionBlock: {
    gap: spacing[10],
  },
  sectionHeaderTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.mutedGray,
    letterSpacing: 0.6,
    paddingLeft: 4,
  },
  actionButtonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridBtn: {
    flex: 1,
    minWidth: '46%',
  },
  timelineHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
  },
  timelineCount: {
    fontSize: 12,
    color: colors.mutedGray,
  },
  historyCard: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
