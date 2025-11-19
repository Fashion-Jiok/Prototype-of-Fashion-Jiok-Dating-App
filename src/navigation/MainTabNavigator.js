import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// 화면
import ExploreScreen from '../screens/Main/ExploreScreen';
import MapScreen from '../screens/Main/MapScreen';
import MatchesScreen from '../screens/Main/MatchesScreen';
import ChatListScreen from '../screens/Chat/ChatListScreen';
import MyProfileScreen from '../screens/Main/MyProfileScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Explore') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Matches') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#F93BA0',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{ title: '탐색' }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{ title: '지도' }}
      />
      <Tab.Screen
        name="Matches"
        component={MatchesScreen}
        options={{ title: '매칭' }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatListScreen}
        options={{ title: '채팅' }}
      />
      <Tab.Screen
        name="Profile"
        component={MyProfileScreen}
        options={{ title: '프로필' }}
      />
    </Tab.Navigator>
  );
}
