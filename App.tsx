import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import DashboardScreen from './src/screens/DashboardScreen';
import BookingsScreen from './src/screens/BookingsScreen';
import TrackerScreen from './src/screens/TrackerScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AchievementsScreen from './src/screens/AchievementsScreen';

const Tab = createBottomTabNavigator();
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarStyle: {
                backgroundColor: '#0a0a0a',
                borderTopColor: '#27272a',
                paddingBottom: 5,
                paddingTop: 5,
                height: 60,
              },
              tabBarActiveTintColor: '#c45c26',
              tabBarInactiveTintColor: '#71717a',
              tabBarIcon: ({ focused, color, size }) => {
                let iconName: keyof typeof Ionicons.glyphMap;

                switch (route.name) {
                  case 'Dashboard':
                    iconName = focused ? 'home' : 'home-outline';
                    break;
                  case 'Bookings':
                    iconName = focused ? 'calendar' : 'calendar-outline';
                    break;
                  case 'Tracker':
                    iconName = focused ? 'pulse' : 'pulse-outline';
                    break;
                  case 'Achievements':
                    iconName = focused ? 'trophy' : 'trophy-outline';
                    break;
                  case 'Profile':
                    iconName = focused ? 'person' : 'person-outline';
                    break;
                  default:
                    iconName = 'ellipse';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
            })}
          >
            <Tab.Screen 
              name="Dashboard" 
              component={DashboardScreen}
              options={{ tabBarLabel: 'Home' }}
            />
            <Tab.Screen 
              name="Bookings" 
              component={BookingsScreen}
              options={{ tabBarLabel: 'Book' }}
            />
            <Tab.Screen 
              name="Tracker" 
              component={TrackerScreen}
              options={{ tabBarLabel: 'Track' }}
            />
            <Tab.Screen 
              name="Achievements" 
              component={AchievementsScreen}
              options={{ tabBarLabel: 'Awards' }}
            />
            <Tab.Screen 
              name="Profile" 
              component={ProfileScreen}
              options={{ tabBarLabel: 'Profile' }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
