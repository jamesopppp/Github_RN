import React, {Component} from 'react';
import {BackHandler} from 'react-native';
import {NavigationAction} from 'react-navigation';
import {connect} from 'react-redux';
import NavigationUtil from '../navigator/NavigationUtil';
import DynamicTabNavigator from '../navigator/DynamicTabNavigator';

class HomePage extends Component {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  onBackPress = () => {
    const {dispatch, nav} = this.props;
    if (nav.routes[1].index === 0) {
      return false;
    }
    dispatch(NavigationAction.back());
    return true;
  };

  render() {
    NavigationUtil.navigation = this.props.navigation;
    return <DynamicTabNavigator />;
  }
}

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(HomePage);
