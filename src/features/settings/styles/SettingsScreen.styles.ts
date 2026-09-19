import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvasMist,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.faintBorder,
    backgroundColor: colors.pureWhite,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.inkBlack,
    letterSpacing: -0.5,
  },
  scrollContent: {
    padding: spacing[16],
    paddingBottom: 40,
    gap: spacing[20],
  },
  section: {
    gap: spacing[8],
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.mutedGray,
    letterSpacing: 0.6,
    paddingLeft: 4,
  },
});
