import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createSwitchNavigator} from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TeamDetails from '../screens/TeamDetails';
import LoadingScreen from '../screens/LoadingScreen';
import Liked from '../screens/Liked';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  TeamDetails: TeamDetails,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
  tabBarOptions: {
    activeTintColor: '#03DAC5',
    inactiveTintColor: '#ffffff40',
    tabStyle: {
      backgroundColor: '#121212',
    },
    style: {
      borderTopColor: '#121212'
    }
  },
  
};

const LikedStack = createStackNavigator({
  Links: Liked,
});

LikedStack.navigationOptions = {
  tabBarLabel: 'Liked',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-star' : 'md-star'}
    />
  ),
  tabBarOptions: {
    activeTintColor: '#03DAC5',
    inactiveTintColor: '#ffffff40',
    tabStyle: {
      backgroundColor: '#121212',
      borderTopColor: '#121212'
    },
    style: {
      borderTopColor: '#121212'
    }
  },
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
  ),
};

const MainTab = createBottomTabNavigator({
  HomeStack,
  LikedStack,
});

export default createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Main: MainTab,
  Loading: LoadingScreen
}, {
  initialRouteName: 'Loading'
});