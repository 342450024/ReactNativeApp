
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
} from 'react-native';
import {Navigator} from 'react-native-deprecated-custom-components';
import TabNavigator from 'react-native-tab-navigator';




export default class HomePage extends Component{
  constructor(props){
    super(props);
    this.state = {
      selectedTab:"图书"
    }
  }
  render() {

    return (

      <View style={styles.container}>
      <TabNavigator>
 <TabNavigator.Item
   selected={this.state.selectedTab === '图书'}
   selectedTitleStyle={{color:'pink'}}
   title="图书"
   renderIcon={() => <Image style={styles.image} source={require('../../res/images/ic_polular.png')} />}
   renderSelectedIcon={() => <Image style={[styles.image,{tintColor:'pink'}]} source={require('../../res/images/ic_polular.png')} />}
   onPress={() => this.setState({ selectedTab: '图书' })}>
  <View style={styles.page1}></View>
 </TabNavigator.Item>
 <TabNavigator.Item
   selected={this.state.selectedTab === '电影'}
   selectedTitleStyle={{color:'pink'}}
   title="电影"
   renderIcon={() => <Image style={styles.image} source={require('../../res/images/ic_computer.png')} />}
   renderSelectedIcon={() => <Image style={[styles.image,{tintColor:'pink'}]} source={require('../../res/images/ic_computer.png')} />}
   onPress={() => this.setState({ selectedTab: '电影' })}>
    <View style={styles.page2}></View>
 </TabNavigator.Item>
 <TabNavigator.Item
   selected={this.state.selectedTab === '音乐'}
   selectedTitleStyle={{color:'pink'}}
   title="音乐"
   renderIcon={() => <Image style={styles.image} source={require('../../res/images/ic_unstar_navbar.png')} />}
   renderSelectedIcon={() => <Image style={[styles.image,{tintColor:'pink'}]} source={require('../../res/images/ic_unstar_navbar.png')} />}
   onPress={() => this.setState({ selectedTab: '音乐' })}>
    <View style={styles.page3}></View>
 </TabNavigator.Item>
 <TabNavigator.Item
   selected={this.state.selectedTab === '我的'}
   selectedTitleStyle={{color:'pink'}}
   title="我的"
   renderIcon={() => <Image style={styles.image} source={require('../../res/images/ic_my.png')} />}
   renderSelectedIcon={() => <Image style={[styles.image,{tintColor:'pink'}]} source={require('../../res/images/ic_my.png')} />}
   onPress={() => this.setState({ selectedTab: '我的' })}>
    <View style={styles.page4}></View>
 </TabNavigator.Item>
</TabNavigator>


      </View>

    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  page1:{
    flex:1,
    backgroundColor:'red',
  },
  page2:{
    flex:1,
    backgroundColor:'yellow',
  },
  page3:{
    flex:1,
    backgroundColor:'blue',
  },
  page4:{
    flex:1,
    backgroundColor:'pink',
  },
  image:{
    height:22,
    width:22
  }

});
