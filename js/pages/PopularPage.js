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
import LanguageDao,{FLAG_LANGUAGE} from "../expand/dao/LanguageDao"
const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
export default class PopularPage extends Component {
  constructor(props){
    super(props);
    this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
    this.state = {
      languages:[]
    }
  }
  componentDidMount(){
    this.loadData();
  }
  loadData(){
    this.languageDao.fetch()
        .then(result=>{
          this.setState({
            languages:result
          })
        })
        .catch(error=>{
          console.log(error);
        })
  }

  render(){
    let content=this.state.languages.length>0?<ScrollableTabView
    tabBarBackgroundColor='#2196F3'
    tabBarInactiveTextColor='mintcream'
    tabBarActiveTextColor="white"
    tabBarUnderlineStyle={{backgroundColor:'#e7e7e7',height:2}}
    renderTabBar={()=><ScrollableTabBar/>}>
    {this.state.languages.map((result,i,arr)=>{
      let lan = arr[i];
      return lan.checked?<PopularSon key={i} tabLabel={lan.name}></PopularSon>:null;
    })}
      </ScrollableTabView>:null;


    return <View style={styles.container}>
        <NavigationBar
        title={'最热'}
        statusBar={{
          backgroundColor:'#2196F3'
        }}/>
        {content}
    </View>
  }
}

class PopularSon extends Component {
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
