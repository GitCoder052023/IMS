import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { InventoryProvider } from '../features/inventory';
import { colors } from '../theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <InventoryProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.canvasMist },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="item/[id]" options={{ headerShown: false, animation: 'slide_from_right' }} />
          <Stack.Screen name="item/new" options={{ headerShown: false, presentation: 'modal' }} />
          <Stack.Screen name="item/edit" options={{ headerShown: false, presentation: 'modal' }} />
        </Stack>
      </InventoryProvider>
    </SafeAreaProvider>
  );
}
