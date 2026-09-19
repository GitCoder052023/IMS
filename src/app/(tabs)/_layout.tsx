import React from 'react';
import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { colors } from '../../theme/tokens';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.carbon,
          borderTopColor: colors.graphite,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 84 : 64,
          paddingBottom: Platform.OS === 'ios' ? 24 : 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.acidLime,
        tabBarInactiveTintColor: colors.fog,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          letterSpacing: -0.1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Feather name="grid" size={size - 2} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          title: 'Inventory',
          tabBarIcon: ({ color, size }) => (
            <Feather name="box" size={size - 2} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Feather name="sliders" size={size - 2} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
