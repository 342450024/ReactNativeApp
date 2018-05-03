
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
  Button,
  Alert,
  Image,
  StatusBar,
  DeviceEventEmitter
} from 'react-native';
// import {Navigator} from 'react-native-deprecated-custom-components';
import TabNavigator from 'react-native-tab-navigator';
import PopularPage from './PopularPage';
import MyPage from './my/MyPage';
import Toast,{DURATION} from 'react-native-easy-toast';
import WebViewDetail from './WebViewDetail';
import TrendingPage from './TrendingPage';
import FavoritePage from './FavoritePage';
import BaseComponent from './BaseComponent'
export const ACTION_HOME={A_SHOW_TOAST:'showToast',A_RESTART:'restart',A_THEME:'theme'};
export const FLAG_TAB={
  flag_popularTab:'图书',
  flag_trendingTab:'电影',
  flag_favoriteTab:'音乐',
  flagmy:'我的'
}
export default class HomePage extends BaseComponent{

  constructor(props){
    super(props);
    let selectedTab = this.props.selectedTab?this.props.selectedTab:"图书";
    this.state = {
      selectedTab:selectedTab,
      theme:this.props.theme
    }
  }
 componentDidMount(){
   //BaseComponent中重写了componentDidMount所以这样调用
   super.componentDidMount();
   this.listener=DeviceEventEmitter.addListener('ACTION_HOME',(action,params)=>{
     this.onAction(action,params);
   })
 }
 /**
  * 通知回调事件处理
  */
  onAction(action,params){
    if(ACTION_HOME.A_RESTART===action){
       this.onRestart(params)
    }else if(ACTION_HOME.A_SHOW_TOAST===action){
      this.toast.show(params.text,DURATION.LENGTH_LONG);
    }
  }
  /**
   * 重启首页
   */
   onRestart(jumpToTab){
     this.props.navigator.resetTo({
       component:HomePage,
       params:{
         ...this.props,
         selectedTab:jumpToTab
       }
     })
   }
 componentWillUnmount(){
   super.componentWillUnmount();
   this.listener&&this.listener.remove();
 }
  render() {

    return (

      <View style={styles.container}>
      <TabNavigator>
 <TabNavigator.Item
   selected={this.state.selectedTab === '图书'}
   selectedTitleStyle={{color:this.state.theme.themeColor}}
   title="图书"
   renderIcon={() => <Image style={styles.image} source={require('../../res/images/ic_polular.png')} />}
   renderSelectedIcon={() => <Image style={[styles.image,{tintColor:this.state.theme.themeColor}]} source={require('../../res/images/ic_polular.png')} />}
   onPress={() => this.setState({ selectedTab: '图书' })}>
  <PopularPage {...this.props} theme={this.state.theme}/>
 </TabNavigator.Item>
 <TabNavigator.Item
   selected={this.state.selectedTab === '电影'}
   selectedTitleStyle={{color:this.state.theme.themeColor}}
   title="电影"
   renderIcon={() => <Image style={styles.image} source={require('../../res/images/ic_computer.png')} />}
   renderSelectedIcon={() => <Image style={[styles.image,{tintColor:this.state.theme.themeColor}]} source={require('../../res/images/ic_computer.png')} />}
   onPress={() => this.setState({ selectedTab: '电影' })}>
    <TrendingPage {...this.props} theme={this.state.theme}/>
 </TabNavigator.Item>
 <TabNavigator.Item
   selected={this.state.selectedTab === '音乐'}
   selectedTitleStyle={{color:this.state.theme.themeColor}}
   title="音乐"
   renderIcon={() => <Image style={styles.image} source={require('../../res/images/ic_unstar_navbar.png')} />}
   renderSelectedIcon={() => <Image style={[styles.image,{tintColor:this.state.theme.themeColor}]} source={require('../../res/images/ic_unstar_navbar.png')} />}
   onPress={() => this.setState({ selectedTab: '音乐' })}>
    <FavoritePage {...this.props} theme={this.state.theme}/>

 </TabNavigator.Item>
 <TabNavigator.Item
   selected={this.state.selectedTab === '我的'}
   selectedTitleStyle={{color:this.state.theme.themeColor}}
   title="我的"
   renderIcon={() => <Image style={styles.image} source={require('../../res/images/ic_my.png')} />}
   renderSelectedIcon={() => <Image style={[styles.image,{tintColor:this.state.theme.themeColor}]} source={require('../../res/images/ic_my.png')} />}
   onPress={() => this.setState({ selectedTab: '我的' })}>
    <MyPage {...this.props} theme={this.state.theme}/>
 </TabNavigator.Item>
</TabNavigator>

 <Toast ref={toast=>this.toast=toast}/>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  image:{
    height:22,
    width:22
  }

});
