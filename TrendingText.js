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
  TextInput
} from 'react-native';

import NavigationBar from './js/common/NavigationBar';
import GitHubTrending from 'GitHubTrending';
const URL = 'https://github.com/trending/';
export default class TrendingText extends Component{
  constructor(props){
    super(props);
    this.trending = new GitHubTrending();
    this.state = {
      result:""
    }
  }
  onLoad(){
    let url = URL+this.text;
     this.trending.fetchTrending(url)
         .then((result)=>{
           this.setState({
             result:JSON.stringify(result)
           })
         })
  }

  render() {
    return (
        <View style={styles.container}>
        <NavigationBar
        title={'Trending的使用'}

        />
         <Text
              style={styles.text}
              onPress={()=>this.onLoad()}
         >获取数据</Text>


         <TextInput style={{height:30,borderWidth:1}}
                    onChangeText={(text)=>{
                      this.text = text;
                    }}
         />

         <Text style={styles.text}>返回数据：{this.state.result}</Text>



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
