/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';



export default class HelloComponent extends Component{
  render() {
    return (
        <Text style={{fontSize:20,backgroundColor:'red'}}>
          Welcome!
        </Text>
    );
  }
}
