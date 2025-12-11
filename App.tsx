import React, { useState, createContext, useContext } from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DatabaseProvider } from './contexts/DatabaseContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import screens
import DashboardScreen from './app/(tabs)/index';
import PlantsScreen from './app/(tabs)/plants';
import SearchScreen from './app/(tabs)/search';
import TimelineScreen from './app/(tabs)/timeline';
import AddPlantScreen from './app/plant/add';
import PlantDetailsScreen from './app/plant/[id]';
import SettingsScreen from './app/settings/index';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

const COLORS = {
  primary: '#4CAF50',
  secondary: '#66BB6A',
  accent: '#81C784',
  light: '#E8F5E9',
  lightBg: '#B3E5FC',
  background: '#E0F7FA',
  inactive: '#999',
  warning: '#FF9800',
  error: '#F44336',
};

// --- Menu context (no navigation in context) ---
const MenuContext = createContext<{ 
  menuVisible: boolean;
  setMenuVisible: (visible: boolean) => void;
}>({ 
  menuVisible: false, 
  setMenuVisible: () => {},
});

// navigation ref used for modal -> screen navigation
const navigationRef = createNavigationContainerRef<any>();

function useMenuContext() {
  return useContext(MenuContext);
}

function MenuScreen() {
  const { setMenuVisible } = useMenuContext();

  // MenuScreen may also receive a navigation prop if actually navigated to;
  // prefer using that, otherwise fallback to navigationRef.
  const handleNavigate = (screen: string, navigationProp?: any) => {
    setMenuVisible(false);
    if (navigationProp && navigationProp.navigate) {
      navigationProp.navigate(screen);
      return;
    }
    if (navigationRef.isReady()) navigationRef.navigate(screen);
  };

  return (
    <View style={styles.menuScreenContainer}>
      <Text style={styles.menuScreenTitle}>Menu</Text>
      <TouchableOpacity
        style={styles.menuScreenItem}
        onPress={() =>  handleNavigate('Settings')}
      >
        <Icon name="settings" size={24} color={COLORS.primary} />
        <Text style={styles.menuScreenItemText}>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuScreenItem}
        onPress={() => handleNavigate('Dashboard')}
      >
        <Icon name="person" size={24} color={COLORS.primary} />
        <Text style={styles.menuScreenItemText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuScreenItem}
        onPress={() => handleNavigate('Dashboard')}
      >
        <Icon name="help" size={24} color={COLORS.primary} />
        <Text style={styles.menuScreenItemText}>Help</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuScreenItem}
        onPress={() => handleNavigate('Dashboard')}
      >
        <Icon name="info" size={24} color={COLORS.primary} />
        <Text style={styles.menuScreenItemText}>About</Text>
      </TouchableOpacity>
    </View>
  );
}

function TabsNavigator({ navigation }: any) {
  const { setMenuVisible } = useMenuContext();

  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.inactive,
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
      }}
    >
      <Tabs.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Home',
          headerTitle: '🌱 Plant Care',
          tabBarIcon: ({ color }) => <Icon name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Plants"
        component={PlantsScreen}
        options={{
          title: 'My Plants',
          headerTitle: 'My Plants',
          tabBarIcon: ({ color }) => <Icon name="local-florist" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: 'Search',
          headerTitle: 'Search Plants',
          tabBarIcon: ({ color }) => <Icon name="search" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Timeline"
        component={TimelineScreen}
        options={{
          title: 'Timeline',
          headerTitle: 'Timeline',
          tabBarIcon: ({ color }) => <Icon name="timeline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Menu"
        component={MenuScreen}
        options={{
          title: 'Menu',
          headerTitle: 'Menu',
          headerShown: true,
          tabBarIcon: ({ color }) => <Icon name="more-vert" size={24} color={color} />,
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            setMenuVisible(true);
          },
        })}
      />
    </Tabs.Navigator>
  );
}

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Group>
        <Stack.Screen name="Main" component={TabsNavigator} />
        <Stack.Screen
          name="PlantDetails"
          component={PlantDetailsScreen}
          options={{
            presentation: 'card',
            headerShown: true,
            headerStyle: { backgroundColor: COLORS.primary },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            presentation: 'card',
            headerShown: true,
            title: 'Settings',
            headerStyle: { backgroundColor: COLORS.primary },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
            headerBackTitleVisible: false,
          }}
        />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen
          name="AddPlant"
          component={AddPlantScreen}
          options={{ headerShown: true, title: 'Add New Plant' }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}

export default function App() {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DatabaseProvider>
        <MenuContext.Provider value={{ menuVisible, setMenuVisible }}>
          <NavigationContainer ref={navigationRef}>
            <RootNavigator />
            {/* Bottom sheet menu modal */}
            <Modal visible={menuVisible} animationType="slide" transparent onRequestClose={() => setMenuVisible(false)}>
              <TouchableOpacity 
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setMenuVisible(false)}
              >
                <View style={styles.bottomSheetContainer}>
                  <View style={styles.bottomSheetHandle} />
                  <View style={styles.menuModal}>
                    <Text style={styles.menuModalTitle}>Menu</Text>
                    <TouchableOpacity
                      style={styles.menuModalItem}
                      onPress={() => {
                        setMenuVisible(false);
                        if (navigationRef.isReady()) navigationRef.navigate('Settings');
                      }}
                    >
                      <Icon name="settings" size={20} color={COLORS.primary} />
                      <Text style={styles.menuModalItemText}>Settings</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.menuModalItem}
                      onPress={() => setMenuVisible(false)}
                    >
                      <Icon name="person" size={20} color={COLORS.primary} />
                      <Text style={styles.menuModalItemText}>Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.menuModalItem}
                      onPress={() => setMenuVisible(false)}
                    >
                      <Icon name="help" size={20} color={COLORS.primary} />
                      <Text style={styles.menuModalItemText}>Help</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setMenuVisible(false)}
                    >
                      <Text style={{ color: '#fff' }}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </Modal>
          </NavigationContainer>
        </MenuContext.Provider>
      </DatabaseProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheetContainer: {
    backgroundColor: 'transparent',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  menuModal: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 30,
  },
  menuModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  menuModalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuModalItemText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    marginTop: 12,
    backgroundColor: COLORS.primary,
    padding: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  menuScreenContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  menuScreenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
  },
  menuScreenItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  menuScreenItemText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#333',
  },
});
