import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  TextInput,
  AsyncStorage,
} from 'react-native';
// import {connect} from 'react-redux';
// import actions from '../action/index';

const KEY = 'save_key';
export default class AsyncStorageDemoPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showText: '',
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>AsyncStorage 使用</Text>
        <TextInput
          style={styles.input}
          onChangeText={text => {
            this.value = text;
          }}
        />
        <View style={styles.input_container}>
          <Text
            onPress={() => {
              this.doSave();
            }}>
            存储
          </Text>
          <Text
            onPress={() => {
              this.doRemove();
            }}>
            删除
          </Text>
          <Text
            onPress={() => {
              this.getData();
            }}>
            获取
          </Text>
        </View>
        <Text>{this.state.showText}</Text>
      </View>
    );
  }

  async doSave() {
    try {
      await AsyncStorage.setItem(KEY, this.value);
    } catch (error) {
      // Error saving data
    }
  }

  async doRemove() {
    try {
      const value = await AsyncStorage.removeItem(KEY);
      if (value !== null) {
        // We have data!!
        console.log(value);
      }
    } catch (error) {
      // Error retrieving data
    }
  }

  async getData() {
    try {
      const value = await AsyncStorage.getItem(KEY);
      if (value !== null) {
        this.setState({
          showText: value,
        });
        // We have data!!
        console.log(value);
      }
    } catch (error) {
      // Error retrieving data
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  input: {
    height: 30,
    borderColor: 'black',
    borderWidth: 1,
    marginRight: 10,
  },
  input_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
