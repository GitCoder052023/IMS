import { StyleSheet, Platform } from 'react-native';
import { colors, spacing } from '../../../theme';

export const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalSheetContainer: {
    backgroundColor: colors.pureWhite,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '80%',
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.faintBorder,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.inkBlack,
    letterSpacing: -0.5,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalScrollContent: {
    padding: spacing[16],
    gap: spacing[20],
  },
  modalSection: {
    gap: spacing[8],
  },
  modalSectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.mutedGray,
    letterSpacing: 0.5,
  },
  modalOptionsGrid: {
    gap: spacing[6],
  },
  modalOptionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 9999,
    backgroundColor: colors.canvasMist,
    borderWidth: 1,
    borderColor: colors.faintBorder,
  },
  modalOptionCardActive: {
    borderColor: 'rgba(84,51,235,0.3)',
    backgroundColor: 'rgba(84,51,235,0.05)',
  },
  modalOptionText: {
    fontSize: 13,
    color: colors.slateInk,
    fontWeight: '500',
  },
  modalOptionTextActive: {
    color: colors.inkBlack,
    fontWeight: '600',
  },
  modalActionsRow: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.faintBorder,
  },
  modalActionBtn: {
    flex: 1,
  },
  sortOptionsList: {
    padding: spacing[16],
    gap: spacing[6],
  },
  sortOptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 9999,
    backgroundColor: colors.canvasMist,
    borderWidth: 1,
    borderColor: colors.faintBorder,
  },
  sortOptionRowActive: {
    borderColor: 'rgba(84,51,235,0.3)',
    backgroundColor: 'rgba(84,51,235,0.05)',
  },
  sortOptionText: {
    fontSize: 13,
    color: colors.slateInk,
    fontWeight: '500',
  },
  sortOptionTextActive: {
    color: colors.inkBlack,
    fontWeight: '600',
  },
});
