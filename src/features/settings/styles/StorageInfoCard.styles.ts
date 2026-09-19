import { StyleSheet } from 'react-native';
import { colors } from '../../../theme';

export const styles = StyleSheet.create({
  infoCard: {
    gap: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoTitleCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    fontSize: 13,
    color: colors.mutedGray,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.inkBlack,
  },
  divider: {
    height: 1,
    backgroundColor: colors.faintBorder,
  },
});
