import React from 'react';
import {View, Linking} from 'react-native';
import {MORE_MENU} from '../../common/MORE_MENU';
import ViewUtil from '../../util/ViewUtil';
import NavigationUtil from '../../navigator/NavigationUtil';
import AboutCommon, {FLAG_ABOUT} from './AboutCommon';
import GlobalStyles from '../../res/styles/GlobalStyles';
import config from '../../res/data/GithubAppConfig.json';

const THEME_COLOR = '#678';

export default class AboutPage extends React.Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    this.aboutCommon = new AboutCommon(
      {
        ...this.params,
        navigation: this.props.navigation,
        flagAbout: FLAG_ABOUT.flag_about,
      },
      data => this.setState({...data}),
    );
    this.state = {
      data: config,
    };
  }

  onClick(menu) {
    let RouteName,
      params = {};
    switch (menu) {
      case MORE_MENU.Tutorial:
        RouteName = 'WebViewPage';
        params.title = '子贤的个人空间';
        params.url = 'https://space.bilibili.com/29431540';
        break;
      case MORE_MENU.About_Author:
        RouteName = 'AboutMePage';
        break;
      case MORE_MENU.Feedback:
        const url = 'mailto://jamessupermail@163.com';
        Linking.canOpenURL(url)
          .then(support => {
            if (!support) {
              console.log("Can't handle url: " + url);
            } else {
              Linking.openURL(url);
            }
          })
          .catch(e => {
            console.error('An error occurred', e);
          });
        break;
    }
    if (RouteName) {
      NavigationUtil.goPage(params, RouteName);
    }
  }

  getItem(menu) {
    return ViewUtil.getMenuItem(() => this.onClick(menu), menu, THEME_COLOR);
  }

  render() {
    const content = (
      <View>
        {this.getItem(MORE_MENU.Tutorial)}
        <View style={GlobalStyles.line} />
        {this.getItem(MORE_MENU.About_Author)}
        <View style={GlobalStyles.line} />
        {this.getItem(MORE_MENU.Feedback)}
      </View>
    );
    return this.aboutCommon.render(content, this.state.data.app);
  }
}
