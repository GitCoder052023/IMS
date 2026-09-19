import { StyleSheet } from 'react-native';
import { colors } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 5,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.inkBlack,
    letterSpacing: -0.5,
    flex: 1,
  },
  categoryText: {
    fontSize: 12,
    color: colors.mutedGray,
    fontWeight: '400',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  availableQty: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.inkBlack,
    letterSpacing: -0.2,
  },
  dotSeparator: {
    fontSize: 12,
    color: colors.coolStone,
  },
  totalQty: {
    fontSize: 13,
    color: colors.mutedGray,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: colors.faintBorder,
    marginTop: 2,
  },
  minThreshold: {
    fontSize: 11,
    color: colors.mutedGray,
  },
  notesText: {
    fontSize: 11,
    color: colors.coolStone,
    fontStyle: 'italic',
    maxWidth: 160,
  },
});
