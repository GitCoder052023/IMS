import { StyleSheet } from 'react-native';
import { colors } from '../../../theme';

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    minWidth: '45%',
  },
  card: {
    backgroundColor: colors.pureWhite,
    borderRadius: 28,
    padding: 14,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  pressed: {
    opacity: 0.88,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.mutedGray,
    letterSpacing: -0.2,
    flex: 1,
  },
  iconWrapper: {
    width: 24,
    height: 24,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -1.0,
  },
  subtitle: {
    fontSize: 11,
    color: colors.coolStone,
  },
});
