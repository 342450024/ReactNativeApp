
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {

  DeviceEventEmitter
} from 'react-native';

import {ACTION_HOME} from './HomePage'
export default class BaseComponent extends Component{

  constructor(props){
    super(props);
    this.state = {
      theme:this.props.theme
    }
  }
 componentDidMount(){
   this.baselistener=DeviceEventEmitter.addListener('ACTION_BASE',(action,params)=>{
     this.onBaseAction(action,params);
   })
 }
 /**
  * 通知回调事件处理
  */
  onBaseAction(action,params){
    if(ACTION_HOME.A_THEME===action){
       this.onThemeChange(params)
    }
  }
  /**
   * 更改主题颜色
   */
   onThemeChange(theme){
     if(!theme)return;
     this.setState({
       theme:theme
     })
   }
 componentWillUnmount(){
   this.baselistener&&this.baselistener.remove();
 }

}
