import {createStackNavigator} from 'react-navigation-stack';
import {
  createBottomTabNavigator,
  createMaterialTopTabNavigator,
} from 'react-navigation-tabs';
import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import WelcomePage from '../page/WelcomePage';
import HomePage from '../page/HomePage';
import DetailPage from '../page/DetailPage';

const InitNavigator = createStackNavigator({
  WelcomePage: {
    screen: WelcomePage,
    navigationOptions: {
      headerShown: false,
    },
  },
});

const MainNavigator = createStackNavigator({
  HomePage: {
    screen: HomePage,
    navigationOptions: {
      headerShown: false,
    },
  },
  DetailPage: {
    screen: DetailPage,
    navigationOptions: {},
  },
});

export default createAppContainer(
  createSwitchNavigator(
    {
      Init: InitNavigator,
      Main: MainNavigator,
    },
    {
      navigationOptions: {
        headerShown: false,
      },
    },
  ),
);
