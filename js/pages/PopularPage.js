import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  DeviceEventEmitter
} from 'react-native';
import ScrollableTabView,{ScrollableTabBar} from 'react-native-scrollable-tab-view'
import {Navigator} from 'react-native-deprecated-custom-components';
import NavigationBar from '../common/NavigationBar'
import RepositoryCell from '../common/RepositoryCell'
import HomePage from './HomePage'
import DataRepository from '../expand/dao/DataRepository'
import LanguageDao,{FLAG_LANGUAGE} from "../expand/dao/LanguageDao"
import WebViewDetail from './WebViewDetail'
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
      return lan.checked?<PopularSon key={i} tabLabel={lan.name} {...this.props}></PopularSon>:null;
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
     this.dataRepository
         .fetchRepository(url)
         .then(result=>{
           let items = result&&result.items?result.items:result?result:[];
           this.setState({
             sourceData:items,
             isFetching: false
           });

           if(result&&result.update_date&&!this.dataRepository.checkData(result.update_date)){
             DeviceEventEmitter.emit('showToast','数据过时');
             return this.dataRepository.fetchNetRepository(url);
           }else{
             DeviceEventEmitter.emit('showToast','显示缓存数据');
           }
         })
         .then(items=>{
           if(!items||items.length === 0) return;
           this.setState({
             sourceData:items,
             isFetching: false
           });
           DeviceEventEmitter.emit('showToast','显示网络数据');
         })
         .catch(error=>{
           this.setState({
             result:JSON.stringify(error),
             isFetching: false
           })
         })
  }
  onSelect(item){
    this.props.navigator.push({
      component:WebViewDetail,
      params:{
        item:item.item,
        ...this.props
      }
    })
  }
  render(){
    return <View style={styles.container}>
    <FlatList
    ref={(flatList)=>this._flatList = flatList}
    keyExtractor={(item, index) => index}
    renderItem={(item)=><RepositoryCell item={item.item} {...this.props} onSelect={()=>this.onSelect(item)}/>}
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
