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



export default class boy extends Component{
  constructor(props){
    super(props);
    this.state = {
      word:"i love u"
    }
  }
  render() {
    return (
        <View style={styles.container}>
          <Text style={styles.text}>123</Text>
        </View>
    );
  }
}
const styles = StyleSheet.create({
   container:{
     flex:1,
     backgroundColor:'gray'
   },
   text:{

   }
})
