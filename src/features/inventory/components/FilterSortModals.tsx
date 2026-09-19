import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../../theme';
import { Button } from '../../../components/ui';
import { InventoryFilterStatus } from '../types';
import { SortOption, SORT_OPTIONS } from '../logic/filtering';
import { styles } from '../styles/FilterSortModals.styles';

interface FilterModalProps {
  visible: boolean;
  selectedCategory: string;
  selectedStatus: InventoryFilterStatus;
  availableCategories: string[];
  onClose: () => void;
  onApply: (category: string, status: InventoryFilterStatus) => void;
}

export function FilterModal({
  visible,
  selectedCategory,
  selectedStatus,
  availableCategories,
  onClose,
  onApply,
}: FilterModalProps) {
  const [tempCategory, setTempCategory] = useState<string>(selectedCategory);
  const [tempStatus, setTempStatus] = useState<InventoryFilterStatus>(selectedStatus);

  useEffect(() => {
    if (visible) {
      setTempCategory(selectedCategory);
      setTempStatus(selectedStatus);
    }
  }, [visible, selectedCategory, selectedStatus]);

  const handleApply = () => {
    onApply(tempCategory, tempStatus);
  };

  const handleReset = () => {
    setTempCategory('ALL');
    setTempStatus('ALL');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalBackdrop}
      >
        <Pressable style={styles.modalScrim} onPress={onClose} />
        <View style={styles.modalSheetContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Inventory</Text>
            <Pressable onPress={onClose} hitSlop={8} style={styles.modalCloseBtn}>
              <Feather name="x" size={18} color={colors.mutedGray} />
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.modalScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Status Section */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionLabel}>STOCK STATUS</Text>
              <View style={styles.modalOptionsGrid}>
                {(
                  [
                    { key: 'ALL', label: 'All Statuses' },
                    { key: 'IN_STOCK', label: 'In Stock' },
                    { key: 'LOW_STOCK', label: 'Low Stock' },
                    { key: 'OUT_OF_STOCK', label: 'Out of Stock' },
                    { key: 'DAMAGED', label: 'Has Damaged Units' },
                  ] as const
                ).map((opt) => {
                  const isSelected = tempStatus === opt.key;
                  return (
                    <Pressable
                      key={opt.key}
                      onPress={() => setTempStatus(opt.key)}
                      style={[
                        styles.modalOptionCard,
                        isSelected && styles.modalOptionCardActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.modalOptionText,
                          isSelected && styles.modalOptionTextActive,
                        ]}
                      >
                        {opt.label}
                      </Text>
                      {isSelected && (
                        <Feather name="check" size={14} color={colors.shopViolet} />
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Category Section */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionLabel}>CATEGORY</Text>
              <View style={styles.modalOptionsGrid}>
                {availableCategories.map((cat) => {
                  const isSelected = tempCategory === cat;
                  return (
                    <Pressable
                      key={cat}
                      onPress={() => setTempCategory(cat)}
                      style={[
                        styles.modalOptionCard,
                        isSelected && styles.modalOptionCardActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.modalOptionText,
                          isSelected && styles.modalOptionTextActive,
                        ]}
                      >
                        {cat === 'ALL' ? 'All Categories' : cat}
                      </Text>
                      {isSelected && (
                        <Feather name="check" size={14} color={colors.shopViolet} />
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {/* Modal Actions */}
          <View style={styles.modalActionsRow}>
            <Button
              title="Reset"
              variant="ghost"
              onPress={handleReset}
              style={styles.modalActionBtn}
            />
            <Button
              title="Apply Filters"
              variant="primary"
              onPress={handleApply}
              style={styles.modalActionBtn}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

interface SortModalProps {
  visible: boolean;
  selectedSort: SortOption;
  onClose: () => void;
  onSelectSort: (sort: SortOption) => void;
}

export function SortModal({
  visible,
  selectedSort,
  onClose,
  onSelectSort,
}: SortModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalBackdrop}
      >
        <Pressable style={styles.modalScrim} onPress={onClose} />
        <View style={styles.modalSheetContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Sort Inventory</Text>
            <Pressable onPress={onClose} hitSlop={8} style={styles.modalCloseBtn}>
              <Feather name="x" size={18} color={colors.mutedGray} />
            </Pressable>
          </View>

          <View style={styles.sortOptionsList}>
            {SORT_OPTIONS.map((opt) => {
              const isSelected = selectedSort === opt.key;
              return (
                <Pressable
                  key={opt.key}
                  onPress={() => {
                    onSelectSort(opt.key);
                    onClose();
                  }}
                  style={[
                    styles.sortOptionRow,
                    isSelected && styles.sortOptionRowActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.sortOptionText,
                      isSelected && styles.sortOptionTextActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                  {isSelected && (
                    <Feather name="check" size={16} color={colors.shopViolet} />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
