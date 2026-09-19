import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../../theme';

export const styles = StyleSheet.create({
  categoryCard: {
    padding: spacing[14],
  },
  categoryList: {
    gap: spacing[14],
  },
  categoryRowItem: {
    gap: spacing[6],
  },
  categoryRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.faintBorder,
    paddingBottom: spacing[12],
  },
  categoryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryNameText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.inkBlack,
    letterSpacing: -0.2,
  },
  categoryUnitsText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.inkBlack,
  },
  categoryBarContainer: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.faintBorder,
    overflow: 'hidden',
  },
  categoryBarFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: colors.shopViolet,
  },
  categoryFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryFooterText: {
    fontSize: 11,
    color: colors.mutedGray,
  },
});
