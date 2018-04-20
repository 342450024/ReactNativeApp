import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  DeviceEventEmitter,
  TouchableOpacity,
  Image
} from 'react-native';
import ScrollableTabView,{ScrollableTabBar} from 'react-native-scrollable-tab-view'
import {Navigator} from 'react-native-deprecated-custom-components';
import NavigationBar from '../common/NavigationBar'
import RepositoryCell from '../common/RepositoryCell'
import DataRepository,{FLAG_STORAGE} from '../expand/dao/DataRepository'
import LanguageDao,{FLAG_LANGUAGE} from "../expand/dao/LanguageDao"
import FavoriteDao from "../expand/dao/FavoriteDao"
import WebViewDetail from './WebViewDetail'
import Utils from '../util/utils'
import ProjectModel from '../model/ProjectModel'
import SearchPage from './SearchPage'
const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
var favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
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
  rightRenderView(){
    return <View style={{marginRight:20}}>
    <TouchableOpacity onPress={()=>{
      this.props.navigator.push({
        component:SearchPage,
        params:{
          ...this.props
        }
      })
    }}>
    <View>
        <Image
         style={{width:24,height:24}}
         source={require('../../res/images/ic_search_white_48pt.png')}
         />
    </View>

    </TouchableOpacity>
    </View>
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
        }}
          rightButton={this.rightRenderView()}
        />
        {content}
    </View>
  }
}

class PopularSon extends Component {
  constructor(props) {
    super(props);
    this.dataRepository = new DataRepository(FLAG_STORAGE.flag_popular);
    this.isFavoriteChanged = false;
    this.state = {
      result:'',
      sourceData:'',
      isFetching:false,
      favoriteKeys:[]
    }
  }
  componentDidMount(){
    this.loadData();
    this.listener=DeviceEventEmitter.addListener('favoriteChanged_popular',()=>{
      this.isFavoriteChanged=true;
    })
  }
  componentWillReceiveProps(){
      if(this.isFavoriteChanged){
        this.isFavoriteChanged = false;
        this.getFavoriteKeys();
      }
  }
  comonentWillUnmount(){
    if(this.listener){
      this.listener.remove();
    }
  }


  flushFavoriteState(){
    let projectModels=[];
    let items = this.items;
    for(var i=0,len=items.length;i<len;i++){
      projectModels.push(new ProjectModel(items[i],Utils.checkFavorite(items[i],this.state.favoriteKeys)));
    }
    this.updateState({
      isFetching:false,
      sourceData:projectModels
    })

  }

  getFavoriteKeys(){
    favoriteDao.getFavoriteKeys()
       .then(keys=>{
         if(keys){
           this.updateState({favoriteKeys:keys})
         }
          this.flushFavoriteState();
       })
       .catch(e=>{
         this.flushFavoriteState();
       })
  }
  //更新用户收藏数据
  updateState(dic){
    if(!this)return;
    this.setState(dic);
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
           this.items = result&&result.items?result.items:result?result:[];
           this.getFavoriteKeys();

           if(result&&result.update_date&&!Utils.checkData(result.update_date)){
             DeviceEventEmitter.emit('showToast','数据过时');
             return this.dataRepository.fetchNetRepository(url);
           }else{
             DeviceEventEmitter.emit('showToast','显示缓存数据');
           }
         })
         .then(items=>{
           if(!items||items.length === 0) return;
           this.items = items;
           this.getFavoriteKeys();
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
        flag:FLAG_STORAGE.flag_popular,
        ...this.props
      }
    })
  }
  /**
   * favoriteIcon的单机回调
   */
  onFavorite(item,isFavorite){


    if(isFavorite){
      favoriteDao.saveFavoriteItem(item.id.toString(),JSON.stringify(item));
    }else{
      favoriteDao.removeFavoriteItem(item.id.toString());
    }

  }
  render(){
    return <View style={styles.container}>
    <FlatList
    ref={(flatList)=>this._flatList = flatList}
    keyExtractor={(item, index) => index}
    renderItem={(item)=><RepositoryCell key={item.item.id} item={item.item} {...this.props} onSelect={()=>this.onSelect(item)} onFavorite={(item,isFavorite)=>this.onFavorite(item,isFavorite)}/>}
    onRefresh={()=>this.loadData()}
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
