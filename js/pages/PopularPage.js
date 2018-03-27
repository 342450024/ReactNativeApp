import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList
} from 'react-native';
import ScrollableTabView,{ScrollableTabBar} from 'react-native-scrollable-tab-view'
import {Navigator} from 'react-native-deprecated-custom-components';
import NavigationBar from '../common/NavigationBar'
import RepositoryCell from '../common/RepositoryCell'
import HomePage from './HomePage'
import DataRepository from '../expand/dao/DataRepository'
const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
export default class WelcomePage extends Component {
  constructor(props){
    super(props);
    this.dataRepository = new DataRepository;
    this.state = {
      result:""
    }
  }
  onLoad(){
     let url = this.getUrl(this.text);
     this.dataRepository.fetchNetRepository(url)
         .then(result=>{
           this.setState({
             result:JSON.stringify(result)
           })
         })
         .catch(error=>{
           this.setState({
             result:JSON.stringify(error)
           })
         })
  }
  getUrl(key){
    return URL+key+QUERY_STR;
  }
  render(){
    return <View style={styles.container}>
    <NavigationBar
        title={'最热'}
        statusBar={{
          backgroundColor:'#2196F3'
        }}

    />
    {/*<Text
    style={styles.tips}
    onPress={()=>{
      this.onLoad()
    }}
    >获取数据</Text>
    <TextInput
    style={{height:40,borderWidth:1}}
    onChangeText={text=>this.text=text}
    />
    <Text style={{height:500}}>{this.state.result}</Text>*/}
    <ScrollableTabView
    tabBarBackgroundColor='#2196F3'
    tabBarInactiveTextColor='mintcream'
    tabBarActiveTextColor="white"
    tabBarUnderlineStyle={{backgroundColor:'#e7e7e7',height:2}}
    renderTabBar={()=><ScrollableTabBar/>}>
        <PopularPage tabLabel="java"></PopularPage>
        <PopularPage tabLabel="ios"></PopularPage>
        <PopularPage tabLabel="android"></PopularPage>
        <PopularPage tabLabel="javaScript"></PopularPage>

      </ScrollableTabView>
    </View>
  }
}

class PopularPage extends Component {
  constructor(props) {
    super(props);
    this.dataRepository = new DataRepository;
    this.state = {
      result:'',
      sourceData:'',
      isFetching:false
    }
  }
  componentDidMount(){
    this.loadData();
  }
  //用箭头函数，在组件中可以直接调用
    loadData = () => {
    this.setState({
      isFetching: true
    })
     let url = URL+this.props.tabLabel+QUERY_STR;
     this.dataRepository.fetchNetRepository(url)
         .then(result=>{
           this.setState({
             sourceData:result.items,
             isFetching: false
           })
         })
         .catch(error=>{
           this.setState({
             result:JSON.stringify(error),
             isFetching: false
           })
         })
  }

  render(){
    return <View style={styles.container}>
    <FlatList
    ref={(flatList)=>this._flatList = flatList}
    keyExtractor={(item, index) => index}
    renderItem={(item)=><RepositoryCell item={item.item}/>}
    onRefresh={this.loadData}
    refreshing={this.state.isFetching}
    data={this.state.sourceData}
    />

    </View>
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1
  },
  tips:{
    fontSize:29
  }
})
