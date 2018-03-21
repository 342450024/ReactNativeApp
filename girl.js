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
  Image,
  TouchableOpacity
} from 'react-native';
import NavigationBar from './NavigationBar';


export default class girl extends Component{
  constructor(props){
    super(props);
    this.state = {

    }
  }
  renderButton(image){
    return <TouchableOpacity
     onPress={()=>{
       this.props.navigator.pop();
     }}
    >
     <Image style={{width:22,height:22,margin:5}} source={image}></Image>
    </TouchableOpacity>
  }
  render() {
    return (
        <View style={styles.container}>
        <NavigationBar
        title={'girl'}
        style={{
          backgroundColor:'#EE6363'
        }}
        leftButton={
          this.renderButton(require('./res/images/ic_arrow_back_white_36pt.png'))

        }
        rightButton={
          this.renderButton(require('./res/images/ic_star.png'))
        }
        />
          <Text style={styles.text}>i am girl</Text>

          <Text style={styles.text}>{this.props.word}</Text>
          <Text style={styles.text} onPress={()=>{
            this.props.onCallBacak('巧克力')
            this.props.navigator.pop()
          }}>送巧克力</Text>
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
