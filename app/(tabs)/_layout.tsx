// TabLayout.tsx
import React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const COLORS = {
  primary: '#4CAF50',
  inactive: '#999',
};

type RootTabParamList = {
  Dashboard: undefined;
  Plants: undefined;
  Search: undefined;
  Timeline: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

/* Placeholder screens — replace with your real screen components */
function DashboardScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Dashboard</Text>
    </View>
  );
}
function PlantsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>My Plants</Text>
    </View>
  );
}
function SearchScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Search Plants</Text>
    </View>
  );
}
function TimelineScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Timeline</Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <NavigationContainer theme={DefaultTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: true,
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.inactive,
          tabBarStyle: {
            borderTopColor: '#E0E0E0',
            paddingBottom: 8,
          },
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
          tabBarIcon: ({ color, size = 24 }) => {
            // default icon; will be overridden per screen below as needed
            return <MaterialIcons name="home" size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            title: 'Dashboard',
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="home" size={size} color={color} />
            ),
            headerTitle: '🌱 Plant Care',
          }}
        />

        <Tab.Screen
          name="Plants"
          component={PlantsScreen}
          options={{
            title: 'My Plants',
            tabBarLabel: 'Plants',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="local-florist" size={size} color={color} />
            ),
            headerTitle: 'My Plants',
          }}
        />

        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{
            title: 'Search',
            tabBarLabel: 'Search',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="search" size={size} color={color} />
            ),
            headerTitle: 'Search Plants',
          }}
        />

        <Tab.Screen
          name="Timeline"
          component={TimelineScreen}
          options={{
            title: 'Timeline',
            tabBarLabel: 'Timeline',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="timeline" size={size} color={color} />
            ),
            headerTitle: 'Timeline',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

/* Example Person class (TypeScript) */
export class Person {
  name: string;
  age: number;

  constructor(name: string, age = 0) {
    this.name = name;
    this.age = age;
  }

  getAge(): number {
    return this.age;
  }
}
