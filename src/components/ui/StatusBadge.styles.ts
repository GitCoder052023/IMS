import { StyleSheet } from 'react-native';
import { colors, radii, spacing } from '../../theme';

export const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: spacing[8],
    borderRadius: radii.badge,
    borderWidth: 1,
    alignSelf: 'flex-start',
    gap: spacing[6],
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  damagedBadge: {
    paddingVertical: 3,
    paddingHorizontal: spacing[8],
    borderRadius: radii.badge,
    backgroundColor: 'rgba(235, 87, 87, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(235, 87, 87, 0.15)',
    alignSelf: 'flex-start',
  },
  damagedText: {
    color: colors.coralRed,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  categoryTag: {
    paddingVertical: 2,
    paddingHorizontal: spacing[8],
    borderRadius: radii.badge,
    backgroundColor: 'rgba(84, 51, 235, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(84, 51, 235, 0.15)',
    alignSelf: 'flex-start',
  },
  categoryText: {
    color: colors.shopViolet,
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: -0.1,
  },
});
