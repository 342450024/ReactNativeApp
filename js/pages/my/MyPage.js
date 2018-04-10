import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import NavigationBar from '../../common/NavigationBar'
import CustomKeyPage from './CustomKeyPage'
import SortKeyPage from './SortKeyPage'
import {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao'
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
        params:{
          ...this.props,
          flag:FLAG_LANGUAGE.flag_key
        }
      })
    }}
    >进入自定义标签页</Text>

    <Text
    onPress={()=>{
      this.props.navigator.push({
        component:CustomKeyPage,
        params:{
          ...this.props,
          flag:FLAG_LANGUAGE.flag_language
        }
      })
    }}
    >自定义语言</Text>

    <Text
    onPress={()=>{
      this.props.navigator.push({
        component:SortKeyPage,
        params:{
          ...this.props,
          flag:FLAG_LANGUAGE.flag_key
        }
      })
    }}
    >标签排序</Text>
    <Text
    onPress={()=>{
      this.props.navigator.push({
        component:SortKeyPage,
        params:{
          ...this.props,
          flag:FLAG_LANGUAGE.flag_language
        }
      })
    }}
    >语言排序</Text>

    <Text
    onPress={()=>{
      this.props.navigator.push({
        component:CustomKeyPage,
        params:{
          ...this.props,
          isRemoveKey:true
        }
      })
    }}
    >删除标签</Text>
    </View>
  }
}
