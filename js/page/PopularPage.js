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
  DeviceEventEmitter,
} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action/index';
import PopularItem from '../common/PopularItem';
import Toast from 'react-native-easy-toast';
import NavigationBar from '../common/NavigationBar';
import NavigationUtil from '../navigator/NavigationUtil';
import {FLAG_STORAGE} from '../expand/dao/DataStore';
import FavoriteDao from '../expand/dao/FavoriteDao';
import FavoriteUtil from '../util/FavoriteUtil';
import EventTypes from '../util/EventTypes';

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const THEME_COLOR = '#678';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);

class PopularPage extends Component {
  constructor(props) {
    super(props);
    this.tabNames = ['Java', 'Android', 'IOS', 'React', 'React Native', 'PHP'];
  }

  _genTabs() {
    const tabs = {};
    this.tabNames.forEach((item, index) => {
      tabs[`tab${index}`] = {
        screen: props => <PopularTabPage {...props} tabLabel={item} />,
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
        title={'最热'}
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

const mapPopularStateToProps = state => ({
  keys: state.language.keys,
});

const mapPopularDispatchToProps = dispatch => ({
  onLoadLanguage: flag => dispatch(actions.onLoadLanguage(flag)),
});

export default connect(
  mapPopularStateToProps,
  mapPopularDispatchToProps,
)(PopularPage);

const pageSize = 10; //设为常量，防止修改
class PopularTab extends Component {
  constructor(props) {
    super(props);
    const {tabLabel} = this.props;
    this.storeName = tabLabel;
    this.isFavoriteChanged = false;
  }

  componentDidMount() {
    this.loadData();
    this.favoriteChangeListener = DeviceEventEmitter.addListener(
      EventTypes.favorite_changed_popular,
      () => {
        this.isFavoriteChanged = true;
      },
    );
    this.bottomTabSelectListener = DeviceEventEmitter.addListener(
      EventTypes.bottom_tab_select,
      data => {
        if (data.to === 0 && this.isFavoriteChanged) {
          this.loadData(null, true);
        }
      },
    );
  }

  componentWillUnmount() {
    if (this.favoriteChangeListener) {
      this.favoriteChangeListener.remove();
    }
    if (this.bottomTabSelectListener) {
      this.bottomTabSelectListener.remove();
    }
  }

  loadData(loadMore, refreshFavorite) {
    const {
      onRefreshPopular,
      onLoadMorePopular,
      onFlushPopularFavorite,
    } = this.props;
    const store = this._store();
    const url = this.genFetchUrl(this.storeName);
    if (loadMore) {
      onLoadMorePopular(
        this.storeName,
        ++store.pageIndex,
        pageSize,
        store.items,
        favoriteDao,
        callBack => {
          this.refs.toast.show('没有更多了');
        },
      );
    } else if (refreshFavorite) {
      onFlushPopularFavorite(
        this.storeName,
        store.pageIndex,
        pageSize,
        store.items,
        favoriteDao,
      );
    } else {
      onRefreshPopular(this.storeName, url, pageSize, favoriteDao);
    }
  }

  genFetchUrl(key) {
    return URL + key + QUERY_STR;
  }

  /**
   * 获取与当前页面有关的数据
   * @returns {*}
   * @private
   */
  _store() {
    const {popular} = this.props;
    let store = popular[this.storeName];
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModels: [], //要显示的数据
        hideLoadingMore: true, //默认隐藏加载更多
      };
    }
    return store;
  }

  renderItem(data) {
    const item = data.item;
    return (
      <PopularItem
        projectModel={item}
        onSelect={callback => {
          NavigationUtil.goPage(
            {
              projectModel: item,
              flag: FLAG_STORAGE.flag_popular,
              callback,
            },
            'DetailPage',
          );
        }}
        onFavorite={(item, isFavorite) => {
          FavoriteUtil.onFavorite(
            favoriteDao,
            item,
            isFavorite,
            FLAG_STORAGE.flag_popular,
          );
        }}
      />
    );
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
          data={store.projectModels}
          renderItem={data => this.renderItem(data)}
          keyExtractor={item => '' + item.item.id}
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
  popular: state.popular,
});

const mapDispatchToProps = dispatch => ({
  onRefreshPopular: (storeName, url, pageSize, favoriteDao) => {
    dispatch(actions.onRefreshPopular(storeName, url, pageSize, favoriteDao));
  },
  onLoadMorePopular: (
    storeName,
    pageIndex,
    pageSize,
    items,
    favoriteDao,
    callBack,
  ) => {
    dispatch(
      actions.onLoadMorePopular(
        storeName,
        pageIndex,
        pageSize,
        items,
        favoriteDao,
        callBack,
      ),
    );
  },
  onFlushPopularFavorite: (
    storeName,
    pageIndex,
    pageSize,
    items,
    favoriteDao,
  ) => {
    dispatch(
      actions.onFlushPopularFavorite(
        storeName,
        pageIndex,
        pageSize,
        items,
        favoriteDao,
      ),
    );
  },
});

const PopularTabPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PopularTab);

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
