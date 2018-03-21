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
import girl from './girl';
import NavigationBar from './NavigationBar';

export default class boy extends Component{
  constructor(props){
    super(props);
    this.state = {
      word:""
    }
  }
  render() {
    return (
        <View style={styles.container}>
        <NavigationBar
        title={'boy'}
        statusBar={{
          backgroundColor:'red'
        }}
        style={{
          backgroundColor:'red'
        }}
        />
          <Text style={styles.text}>i am boy</Text>
          <Text style={styles.text}
              onPress={()=>{
                 this.props.navigator.push({
                   component:girl,
                   params:{
                     word:'送你玫瑰',
                     onCallBacak:(word)=>{
                       this.setState({
                         word:word
                       })
                     }
                   }
                 })
              }}>送玫瑰</Text>
              <Text style={styles.text}>{this.state.word}</Text>
        </View>
    );
  }
}
const styles = StyleSheet.create({
   container:{
     flex:1,

   },
   text:{
       fontSize:20
   }
})
