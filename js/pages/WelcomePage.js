import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Navigator} from 'react-native-deprecated-custom-components';
import NavigationBar from '../common/NavigationBar'
import HomePage from './HomePage'
import ThemeDao from '../expand/dao/ThemeDao'
import SplashScreen from 'react-native-splash-screen'
export default class WelcomePage extends Component {
  componentDidMount(){
    new ThemeDao().getTheme().then((data)=>{
      this.theme = data;
    })
    this.timer = setTimeout(()=>{
      SplashScreen.hide();
      this.props.navigator.resetTo({
            component:HomePage,
            params:{
              theme:this.theme
            }
      })
    },500)
  }
  componentWillUnmount(){
    this.timer&&clearTimeout(this.timer);
  }
  render(){
    return null;
  }
}
