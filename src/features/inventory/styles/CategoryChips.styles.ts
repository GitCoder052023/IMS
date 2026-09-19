import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../../theme';

export const styles = StyleSheet.create({
  fieldSection: {
    marginBottom: spacing[16],
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.inkBlack,
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    backgroundColor: colors.pureWhite,
    borderWidth: 1,
    borderColor: colors.faintBorder,
  },
  chipActive: {
    backgroundColor: colors.shopViolet,
    borderColor: colors.shopViolet,
  },
  chipText: {
    fontSize: 12,
    color: colors.slateInk,
    fontWeight: '500',
  },
  chipTextActive: {
    color: colors.pureWhite,
    fontWeight: '600',
  },
  customInputContainer: {
    marginTop: 8,
    marginBottom: 0,
  },
  errorText: {
    fontSize: 12,
    color: colors.coralRed,
    marginTop: 4,
  },
});
