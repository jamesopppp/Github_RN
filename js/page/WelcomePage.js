import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

const WelcomePage = () => {
  return (
    <>
      <View style={styles.containerr}>
        <Text style={styles.welcome}>WelcomePage</Text>
      </View>
    </>
  );
};

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

export default WelcomePage;
