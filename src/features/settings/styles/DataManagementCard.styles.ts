import { StyleSheet } from 'react-native';
import { colors } from '../../../theme';

export const styles = StyleSheet.create({
  dangerCard: {
    gap: 10,
  },
  dangerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dangerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.coralRed,
    letterSpacing: -0.2,
  },
  dangerDescription: {
    fontSize: 13,
    color: colors.mutedGray,
    lineHeight: 18,
  },
  dangerBtn: {
    marginTop: 6,
  },
});
