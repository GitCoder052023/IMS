import { StyleSheet } from 'react-native';
import { colors } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.inkBlack,
    letterSpacing: -0.2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  available: {
    fontSize: 12,
    color: colors.slateInk,
  },
  divider: {
    fontSize: 12,
    color: colors.coolStone,
  },
  min: {
    fontSize: 12,
    color: colors.mutedGray,
  },
  badges: {
    alignItems: 'flex-end',
    gap: 4,
  },
});
