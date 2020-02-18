import React, {Component} from 'react';
import {createAppContainer} from 'react-navigation';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {StyleSheet, View, Text, SafeAreaView, Button} from 'react-native';
import NavigationUtil from '../navigator/NavigationUtil';

export default class PopularPage extends Component {
  constructor(props) {
    super(props);
    this.tabNames = ['Java', 'Android', 'IOS', 'React', 'React Native', 'PHP'];
  }

  _genTabs() {
    const tabs = {};
    this.tabNames.forEach((item, index) => {
      tabs[`tab${index}`] = {
        screen: props => <PopularTab {...props} tabLabel={item} />,
        navigationOptions: {
          title: item,
        },
      };
    });
    return tabs;
  }

  render() {
    const TabNavigator = createAppContainer(
      createMaterialTopTabNavigator(this._genTabs(), {
        tabBarOptions: {
          tabStyle: styles.tabStyle,
          upperCaseLabel: false,
          scrollEnabled: true,
          style: {
            backgroundColor: '#678',
          },
          indicatorStyle: styles.indicatorStyle,
          labelStyle: styles.labelStyle,
        },
      }),
    );
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <TabNavigator />
      </SafeAreaView>
    );
  }
}

class PopularTab extends Component {
  render() {
    const {tabLabel} = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>{tabLabel}</Text>
        <Text
          onPress={() => {
            NavigationUtil.goPage(
              {navigation: this.props.navigation},
              'DetailPage',
            );
          }}>
          跳转详情页
        </Text>
        <Button
          title="Fetch 使用"
          onPress={() => {
            NavigationUtil.goPage(
              {navigation: this.props.navigation},
              'FetchDemoPage',
            );
          }}
        />
        <Button
          title="AsyncStorage 使用"
          onPress={() => {
            NavigationUtil.goPage(
              {navigation: this.props.navigation},
              'AsyncStorageDemoPage',
            );
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  tabStyle: {
    minWidth: 50,
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: '#fff',
  },
  labelStyle: {
    fontSize: 13,
    marginTop: 6,
    marginBottom: 6,
  },
});
