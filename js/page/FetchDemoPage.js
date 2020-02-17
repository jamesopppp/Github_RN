import React from 'react';
import {StyleSheet, View, Text, Button, TextInput} from 'react-native';
// import {connect} from 'react-redux';
// import actions from '../action/index';

export default class FetchDemoPage extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Fetch Demo page</Text>
        <Button
          title={'改变主题色'}
          onPress={() => {
            this.props.onThemeChange('#206');
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
});
