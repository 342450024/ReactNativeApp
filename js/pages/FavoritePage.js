import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Image,
  DeviceEventEmitter
} from 'react-native';
import ScrollableTabView,{ScrollableTabBar} from 'react-native-scrollable-tab-view'
import {Navigator} from 'react-native-deprecated-custom-components';
import NavigationBar from '../common/NavigationBar'
import RepositoryCell from '../common/RepositoryCell'
import TrendingCell from '../common/TrendingCell'
import {FLAG_STORAGE} from '../expand/dao/DataRepository'
import FavoriteDao from "../expand/dao/FavoriteDao"
import WebViewDetail from './WebViewDetail'
import ProjectModel from '../model/ProjectModel'
import ArrayUtils from '../util/ArrayUtils'
export default class PopularPage extends Component {
  constructor(props){
    super(props);

  }

  render(){
    let content=<ScrollableTabView
    tabBarBackgroundColor='#2196F3'
    tabBarInactiveTextColor='mintcream'
    tabBarActiveTextColor="white"
    tabBarUnderlineStyle={{backgroundColor:'#e7e7e7',height:2}}
    renderTabBar={()=><ScrollableTabBar/>}>
  <FavoriteSon tabLabel={'最热'} {...this.props} flag={FLAG_STORAGE.flag_popular}></FavoriteSon>
  <FavoriteSon tabLabel={'趋势'} {...this.props} flag={FLAG_STORAGE.flag_trending}></FavoriteSon>
      </ScrollableTabView>;


    return <View style={styles.container}>
        <NavigationBar
        title={'收藏'}
        statusBar={{
          backgroundColor:'#2196F3'
        }}/>
        {content}
    </View>
  }
}

class FavoriteSon extends Component {
  constructor(props) {
    super(props);
    this.favoriteDao = new FavoriteDao(this.props.flag);
    this.unFavoriteItem=[];
    this.state = {
      result:'',
      sourceData:'',
      isFetching:false,
      favoriteKeys:[]
    }
  }
  componentDidMount(){
    this.loadData(true);
  }
  componentWillReceiveProps(nextProps){
  this.loadData(false);
  }




  //更新用户收藏数据
  updateState(dic){
    if(!this)return;
    this.setState(dic);
  }
  //用箭头函数，在组件中可以直接调用
    loadData(isShowLoading){
 if(isShowLoading){
   this.setState({
     isFetching: true
   })
 }

    this.favoriteDao.getAllItems()
    .then(items=>{
      var resultData=[];
      for(var i = 0,len = items.length;i<len;i++){
        resultData.push(new ProjectModel(items[i],true))
      }
      this.updateState({
        sourceData:resultData,
        isFetching:false,
      })
    })
    .catch(e=>{
      this.updateState({
        isFetching:false,
      })
    })

  }
  onSelect(item){
    this.props.navigator.push({
      component:WebViewDetail,
      params:{
        item:item.item,
        flag:this.props.flag,
        ...this.props
      }
    })
  }
  /**
   * favoriteIcon的单机回调
   */
  onFavorite(item,isFavorite){
    var key = this.props.flag===FLAG_STORAGE.flag_popular?item.id.toString():item.fullName;
    if(isFavorite){
      this.favoriteDao.saveFavoriteItem(key,JSON.stringify(item));
    }else{
      this.favoriteDao.removeFavoriteItem(key);
    }
    ArrayUtils.updateArray(this.unFavoriteItem,item);
    if(this.unFavoriteItem.length>0){
      if(this.props.flag === FLAG_STORAGE.flag_popular){
        DeviceEventEmitter.emit('favoriteChanged_popular');
      }else{
        DeviceEventEmitter.emit('favoriteChanged_trending');
      }
    }
  }
  renderCell(item){
 let CellComponent=this.props.flag===FLAG_STORAGE.flag_popular?RepositoryCell:TrendingCell;
  return <CellComponent
  item={item.item}
  {...this.props}

  onSelect={()=>this.onSelect(item)}
  onFavorite={(item,isFavorite)=>this.onFavorite(item,isFavorite)}
  />
  }
  noneData(){
    return <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
    <Image
        style={{width:50,height:50,marginTop:100,marginBottom:20}}
        source={require('../../res/images/404_72.png')}
    />
    <Text>我已经尽力了╭(╯^╰)╮</Text>
    </View>

  }
  render(){
    return <View style={styles.container}>
    <FlatList
    ref={(flatList)=>this._flatList = flatList}
    ListEmptyComponent={()=>this.noneData()}
    keyExtractor={(item, index) => index}
    renderItem={(item)=>this.renderCell(item)}
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
