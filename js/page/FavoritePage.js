import React, {Component} from 'react';
import {createAppContainer} from 'react-navigation';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {
  StyleSheet,
  View,
  FlatList,
  DeviceEventEmitter,
  RefreshControl,
} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action/index';
import PopularItem from '../common/PopularItem';
import TrendingItem from '../common/TrendingItem';
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

export default class FavoritePage extends Component {
  constructor(props) {
    super(props);
    this.tabNames = ['最热', '趋势'];
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
      createMaterialTopTabNavigator(
        {
          Popular: {
            screen: props => (
              <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_popular} />
            ),
            navigationOptions: {
              title: '最热',
            },
          },
          Trending: {
            screen: props => (
              <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_trending} />
            ),
            navigationOptions: {
              title: '趋势',
            },
          },
        },
        {
          tabBarOptions: {
            tabStyle: styles.tabStyle,
            upperCaseLabel: false,
            scrollEnabled: false,
            style: {
              backgroundColor: '#678',
            },
            indicatorStyle: styles.indicatorStyle,
            labelStyle: styles.labelStyle,
          },
        },
      ),
    );
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        {navigationBar}
        <TabNavigator />
      </View>
    );
  }
}

class FavoriteTab extends Component {
  constructor(props) {
    super(props);
    const {flag} = this.props;
    this.storeName = flag;
    this.favoriteDao = new FavoriteDao(flag);
  }

  componentDidMount() {
    this.loadData();
    this.listener = DeviceEventEmitter.addListener(
      EventTypes.bottom_tab_select,
      data => {
        if (data.to === 2) {
          this.loadData(false);
        }
      },
    );
  }

  componentWillUnmount() {
    if (this.listener) {
      this.listener.remove();
    }
  }

  loadData(isShowLoading) {
    const {onLoadFavoriteData} = this.props;
    onLoadFavoriteData(this.storeName, isShowLoading);
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
    const {favorite} = this.props;
    let store = favorite[this.storeName];
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModels: [], //要显示的数据
      };
    }
    return store;
  }

  onFavorite(item, isFavorite) {
    FavoriteUtil.onFavorite(
      this.favoriteDao,
      item,
      isFavorite,
      this.props.flag,
    );
    if (this.storeName === FLAG_STORAGE.flag_popular) {
      DeviceEventEmitter.emit(EventTypes.favorite_changed_popular);
    } else {
      DeviceEventEmitter.emit(EventTypes.favorite_changed_trending);
    }
  }

  renderItem(data) {
    const item = data.item;
    const Item =
      this.storeName === FLAG_STORAGE.flag_popular ? PopularItem : TrendingItem;
    return (
      <Item
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
        onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
      />
    );
  }

  render() {
    let store = this._store();
    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectModels}
          renderItem={data => this.renderItem(data)}
          keyExtractor={item => '' + (item.item.id || item.item.fullName)}
          refreshControl={
            <RefreshControl
              title={'Loading'}
              titleColor={THEME_COLOR}
              colors={[THEME_COLOR]}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData(true)}
              tintColor={THEME_COLOR}
            />
          }
        />
        <Toast ref={'toast'} position={'center'} />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  favorite: state.favorite,
});

const mapDispatchToProps = dispatch => ({
  onLoadFavoriteData: (storeName, isShowLoading) => {
    dispatch(actions.onLoadFavoriteData(storeName, isShowLoading));
  },
});

const FavoriteTabPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(FavoriteTab);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabStyle: {
    minWidth: 100,
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
