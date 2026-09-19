import { StyleSheet } from 'react-native';
import { colors, radii, spacing } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[16],
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.inkBlack,
    marginBottom: spacing[6],
    letterSpacing: -0.2,
  },
  input: {
    backgroundColor: colors.pureWhite,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: radii.input,
    paddingVertical: 10,
    paddingHorizontal: spacing[16],
    color: colors.inkBlack,
    fontSize: 14,
    letterSpacing: -0.2,
  },
  inputFocused: {
    borderColor: colors.inkBlack,
    backgroundColor: colors.pureWhite,
  },
  inputError: {
    borderColor: colors.coralRed,
  },
  errorText: {
    fontSize: 12,
    color: colors.coralRed,
    marginTop: spacing[4],
  },
  helperText: {
    fontSize: 12,
    color: colors.mutedGray,
    marginTop: spacing[4],
  },
});
