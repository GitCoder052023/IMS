import { StyleSheet } from 'react-native';
import { colors } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  emptyContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: colors.mutedGray,
    fontStyle: 'italic',
  },
  row: {
    flexDirection: 'row',
  },
  indicatorCol: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    marginRight: 12,
  },
  iconNode: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  connector: {
    flex: 1,
    width: 1,
    backgroundColor: colors.faintBorder,
    marginVertical: 2,
  },
  contentCol: {
    flex: 1,
    gap: 3,
  },
  contentColBottom: {
    paddingBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.inkBlack,
    letterSpacing: -0.2,
  },
  qtyBadge: {
    fontSize: 13,
    fontWeight: '600',
  },
  noteText: {
    fontSize: 12,
    color: colors.mutedGray,
    fontStyle: 'italic',
  },
  timestamp: {
    fontSize: 11,
    color: colors.coolStone,
  },
});
