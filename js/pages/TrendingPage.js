import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Image,
  DeviceEventEmitter,
  TouchableOpacity
} from 'react-native';
import ScrollableTabView,{ScrollableTabBar} from 'react-native-scrollable-tab-view'
import {Navigator} from 'react-native-deprecated-custom-components';
import NavigationBar from '../common/NavigationBar'
import TrendingCell from '../common/TrendingCell'
import DataRepository,{FLAG_STORAGE} from '../expand/dao/DataRepository'
import LanguageDao,{FLAG_LANGUAGE} from "../expand/dao/LanguageDao"
import WebViewDetail from './WebViewDetail'
import TimeSpan from '../model/TimeSpan'
import Popover from '../common/Popover'
import FavoriteDao from "../expand/dao/FavoriteDao"
import Utils from '../util/utils'
import ProjectModel from '../model/ProjectModel'
var favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending);
const URL = 'https://github.com/trending/';
var timeSpanTextArray = [
  new TimeSpan('今 天','?since=daily')
  ,new TimeSpan('本 周','?since=weekly')
  ,new TimeSpan('本 月','?since=monthly')
]
export default class TrendingPage extends Component {
  constructor(props){
    super(props);
    this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_language);
    this.state = {
      languages:[],
      isVisible: false,
      buttonRect: {},
      timeSpan:timeSpanTextArray[0]
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
  renderTitleview(){
    return <View>
          <TouchableOpacity ref='button' onPress={()=>this.showPopover()}>
            <View style={styles.head}>
              <Text style={{color:'#fff',fontSize:18}}>趋势</Text>
              <Image style={{fontSize:20,marginLeft:5,tintColor:'#fff'}}source={require('../../res/images/ic_tiaozhuan_down.png')}/>
            </View>
          </TouchableOpacity>
    </View>
  }
  showPopover() {
    this.refs.button.measure((ox, oy, width, height, px, py) => {
      this.setState({
        isVisible: true,
        buttonRect: {x: px, y: py, width: width, height: height}
      });
    });
  }

  closePopover() {
    this.setState({isVisible: false});
  }
  //查询数据
   onItemClick(timeSpan){
     this.setState({
       isVisible: false,
       timeSpan:timeSpan
     });

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
      return lan.checked?<TrendingSon key={i} tabLabel={lan.name} timeSpan={this.state.timeSpan} {...this.props}></TrendingSon>:null;
    })}
      </ScrollableTabView>:null;


    return <View style={styles.container}>
        <NavigationBar
        titleView={this.renderTitleview()}
        statusBar={{
          backgroundColor:'#2196F3'
        }}/>
        {content}
        <Popover
               isVisible={this.state.isVisible}
               fromRect={this.state.buttonRect}
               placement="bottom"
               onClose={()=>this.closePopover()}

               contentStyle={{opacity:0.82,backgroundColor:'#343434'}}
        >
               <View style={{alignItems: 'center'}}>
                   {timeSpanTextArray.map((result, i, arr) => {
                       return <TouchableOpacity key={i} onPress={()=>this.onItemClick(arr[i])}>
                           <Text
                               style={{fontSize: 18,color:'white', padding: 8, fontWeight: '400'}}>
                               {arr[i].showText}
                           </Text>
                       </TouchableOpacity>
                   })
                   }
               </View>
           </Popover>

    </View>
  }
}

class TrendingSon extends Component {
  constructor(props) {
    super(props);
    this.dataRepository = new DataRepository(FLAG_STORAGE.flag_trending);
    this.isFavoriteChanged=false;
    this.state = {
      result:'',
      sourceData:'',
      isFetching:false,
      favoriteKeys:[]
    }
  }

  componentDidMount(){
    this.loadData(this.props.timeSpan);
    this.listener=DeviceEventEmitter.addListener('favoriteChanged_trending',()=>{
      this.isFavoriteChanged=true;
    })
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.timeSpan!==this.props.timeSpan){
      this.loadData(nextProps.timeSpan)
    }
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




  //收藏功能
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
  getFetchUrl(timeSpan,category){
    return URL + category + timeSpan.searchText;
  }
  //更新用户收藏数据
  updateState(dic){
    if(!this)return;
    this.setState(dic);
  }

  //用箭头函数，在组件中可以直接调用
    loadData = (timeSpan) => {
    this.setState({
      isFetching: true
    })
     let url = this.getFetchUrl(timeSpan,this.props.tabLabel);
     this.dataRepository
         .fetchRepository(url)
         .then(result=>{
           this.items = result&&result.items?result.items:result?result:[];

           this.getFavoriteKeys();


           if(result&&result.update_date&&!this.dataRepository.checkData(result.update_date)){
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
        flag:FLAG_STORAGE.flag_trending,
        ...this.props
      }
    })
  }
  /**
   * favoriteIcon的单机回调
   */
  onFavorite(item,isFavorite){
    if(isFavorite){
      favoriteDao.saveFavoriteItem(item.fullName,JSON.stringify(item));
    }else{
      favoriteDao.removeFavoriteItem(item.fullName);
    }
  }
  render(){
    return <View style={styles.container}>
    <FlatList
    ref={(flatList)=>this._flatList = flatList}
    keyExtractor={(item, index) => index}
    renderItem={(item)=><TrendingCell item={item.item} {...this.props} onSelect={()=>this.onSelect(item)} onFavorite={(item,isFavorite)=>this.onFavorite(item,isFavorite)}/>}
    onRefresh={()=>this.loadData(this.props.timeSpan)}
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
  },
  head:{
    flexDirection:'row',
    alignItems:'center',
    color:'#fff',
  }
})
