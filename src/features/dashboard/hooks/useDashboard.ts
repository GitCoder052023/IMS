import { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useInventory } from '../../inventory';
import { calculateDashboardMetrics, calculateCategoryBreakdown } from '../logic/metrics';
import { formatDashboardDate } from '../logic/formatters';

export function useDashboard() {
  const router = useRouter();
  const { items, history, isLoading } = useInventory();

  const metrics = useMemo(() => calculateDashboardMetrics(items), [items]);
  const categoryBreakdown = useMemo(() => calculateCategoryBreakdown(items), [items]);
  const currentDateFormatted = useMemo(() => formatDashboardDate(), []);

  // Compute availability percentage for the health progress bar
  const availabilityPercentage = useMemo(() => {
    if (metrics.totalQuantity === 0) return 100;
    return Math.round((metrics.totalAvailable / metrics.totalQuantity) * 100);
  }, [metrics.totalAvailable, metrics.totalQuantity]);

  // Max quantity among categories for proportional horizontal bar widths
  const maxCategoryUnits = useMemo(() => {
    if (categoryBreakdown.length === 0) return 1;
    return Math.max(...categoryBreakdown.map((c) => c.totalQuantity), 1);
  }, [categoryBreakdown]);

  const navigateToAddItem = () => router.push('/item/new');
  const navigateToItemDetail = (itemId: string) => router.push(`/item/${itemId}`);
  const navigateToInventory = () => router.push('/(tabs)/inventory');

  return {
    items,
    history,
    isLoading,
    metrics,
    categoryBreakdown,
    currentDateFormatted,
    availabilityPercentage,
    maxCategoryUnits,
    navigateToAddItem,
    navigateToItemDetail,
    navigateToInventory,
  };
}
