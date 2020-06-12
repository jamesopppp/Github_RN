import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import {WebView} from 'react-native-webview';
import NavigationUtil from '../navigator/NavigationUtil';
import BackPressComponent from '../common/BackPressComponent';

const THEME_COLOR = '#678';

export default class DetailPage extends Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    const {title, url} = this.params;
    this.state = {
      title: title,
      url: url,
      canGoBack: false,
    };
    this.backPress = new BackPressComponent({
      backPress: () => this.onBackPress(),
    });
  }

  onBackPress() {
    this.onBack();
    return true;
  }

  componentDidMount() {
    this.backPress.componentDidMount();
  }

  componentWillUnmount() {
    this.backPress.componentWillUnmount();
  }

  onBack() {
    if (this.state.canGoBack) {
      this.webView.goBack();
    } else {
      NavigationUtil.goBack(this.props.navigation);
    }
  }

  onNavigationStateChange(navState) {
    this.setState({
      canGoBack: navState.canGoBack,
      url: navState.url,
    });
  }

  render() {
    let statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content',
    };
    let navigationBar = (
      <NavigationBar
        statusBar={statusBar}
        title={this.state.title}
        style={{backgroundColor: THEME_COLOR}}
        leftButton={ViewUtil.getLeftBackButton(() => this.onBackPress())}
      />
    );

    return (
      <View style={styles.container}>
        {navigationBar}
        <WebView
          ref={webView => (this.webView = webView)}
          startInLoadingState={true}
          onNavigationStateChange={e => this.onNavigationStateChange(e)}
          source={{uri: this.state.url}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
