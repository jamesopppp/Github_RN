import React, {Component} from 'react';
import {createAppContainer} from 'react-navigation';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  SafeAreaView,
  FlatList,
  Text,
  RefreshControl,
} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action/index';
import TrendingItem from '../common/TrendingItem';
import Toast from 'react-native-easy-toast';
import NavigationBar from '../common/NavigationBar';

const URL = 'https://github.com/trending/';
const THEME_COLOR = '#678';

export default class TrendingPage extends Component {
  constructor(props) {
    super(props);
    this.tabNames = ['All', 'JavaScript', 'Python', 'Dart', 'Java', 'PHP'];
  }

  _genTabs() {
    const tabs = {};
    this.tabNames.forEach((item, index) => {
      tabs[`tab${index}`] = {
        screen: props => <TrendingTabPage {...props} tabLabel={item} />,
        navigationOptions: {
          title: item,
        },
      };
    });
    return tabs;
  }

  render() {
    let statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content',
    };
    let navigationBar = (
      <NavigationBar
        title={'趋势'}
        statusBar={statusBar}
        style={{backgroundColor: THEME_COLOR}}
      />
    );
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
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        {navigationBar}
        <TabNavigator />
      </View>
    );
  }
}

const pageSize = 10; //设为常量，防止修改
class TrendingTab extends Component {
  constructor(props) {
    super(props);
    const {tabLabel} = this.props;
    this.storeName = tabLabel;
  }

  componentDidMount() {
    this.loadData();
  }

  loadData(loadMore) {
    const {onRefreshTrending, onLoadMoreTrending} = this.props;
    const store = this._store();
    const url = this.genFetchUrl(this.storeName);
    if (loadMore) {
      onLoadMoreTrending(
        this.storeName,
        ++store.pageIndex,
        pageSize,
        store.items,
        callBack => {
          this.refs.toast.show('没有更多了');
        },
      );
    } else {
      onRefreshTrending(this.storeName, url, pageSize);
    }
  }

  genFetchUrl(key) {
    if (key === 'All') {
      return URL + '?since=daily';
    } else {
      return URL + key + '?since=daily';
    }
  }

  /**
   * 获取与当前页面有关的数据
   * @returns {*}
   * @private
   */
  _store() {
    const {trending} = this.props;
    let store = trending[this.storeName];
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModes: [], //要显示的数据
        hideLoadingMore: true, //默认隐藏加载更多
      };
    }
    return store;
  }

  renderItem(data) {
    const item = data.item;
    return <TrendingItem item={item} onSelect={() => {}} />;
  }

  genIndicator() {
    return this._store().hideLoadingMore ? null : (
      <View style={styles.indicatorContainer}>
        <ActivityIndicator style={styles.indicator} />
        <Text>正在加载更多</Text>
      </View>
    );
  }

  render() {
    let store = this._store();
    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectModes}
          renderItem={data => this.renderItem(data)}
          keyExtractor={item => '' + (item.id || item.fullName)}
          refreshControl={
            <RefreshControl
              title={'Loading'}
              titleColor={THEME_COLOR}
              colors={[THEME_COLOR]}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData()}
              tintColor={THEME_COLOR}
            />
          }
          ListFooterComponent={() => this.genIndicator()}
          onEndReached={() => {
            setTimeout(() => {
              if (this.canLoadMore) {
                this.loadData(true);
                this.canLoadMore = false;
              }
            }, 100);
          }}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={() => {
            this.canLoadMore = true;
          }}
        />
        <Toast ref={'toast'} position={'center'} />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  trending: state.trending,
});

const mapDispatchToProps = dispatch => ({
  onRefreshTrending: (storeName, url, pageSize) => {
    dispatch(actions.onRefreshTrending(storeName, url, pageSize));
  },
  onLoadMoreTrending: (storeName, pageIndex, pageSize, items, callBack) => {
    dispatch(
      actions.onLoadMoreTrending(
        storeName,
        pageIndex,
        pageSize,
        items,
        callBack,
      ),
    );
  },
});

const TrendingTabPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TrendingTab);

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  indicatorContainer: {
    alignItems: 'center',
  },
  indicator: {
    color: 'red',
    margin: 10,
  },
});
