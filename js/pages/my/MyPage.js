import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Navigator} from 'react-native-deprecated-custom-components';
import NavigationBar from '../../common/NavigationBar'
import CustomKeyPage from './CustomKeyPage'
export default class MyPage extends Component {
  // this.props.navigator.resetTo({
  //       component:HomePage
  // })
  render(){
    return <View>
    <NavigationBar
        title={'我的'}
    />
    <Text
    onPress={()=>{
      this.props.navigator.push({
        component:CustomKeyPage,
        params:{...this.props}
      })
    }}
    >进入自定义标签页</Text>
    </View>
  }
}
