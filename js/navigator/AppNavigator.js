import {createStackNavigator} from 'react-navigation-stack';
import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import WelcomePage from '../page/WelcomePage';
import HomePage from '../page/HomePage';
import WebViewPage from '../page/WebViewPage';
import DetailPage from '../page/DetailPage';
import {connect} from 'react-redux';
import {
  createReduxContainer,
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';

export const rootCom = 'Init';

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
    navigationOptions: {
      headerShown: false,
    },
  },
  WebViewPage: {
    screen: WebViewPage,
    navigationOptions: {},
  },
});

export const RootNavigator = createAppContainer(
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

export const middleware = createReactNavigationReduxMiddleware(
  state => state.nav,
  'root',
);

const AppWithNavigationState = createReduxContainer(RootNavigator, 'root');

const mapStateToProps = state => ({
  state: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);
