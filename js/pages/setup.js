import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Navigator} from 'react-native-deprecated-custom-components';
import WelcomePage from './WelcomePage';

function Setup(){
  //进行一些初始化的配置
  class Root extends Component{
    renderScene(route,navigator){
      let Component = route.component;
      return <Component {...route.params} navigator={navigator}/>
    }
    render(){
      return <Navigator
              initialRoute={{component:WelcomePage}}
              renderScene={(route,navigator)=>this.renderScene(route,navigator)}
      />
    }
  }
  return <Root/>
}
module.exports=Setup;
