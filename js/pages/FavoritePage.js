import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Image,
  DeviceEventEmitter,
  RefreshControl
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
import MoreMenu,{MORE_MENU} from '../common/MoreMenu'
import {FLAG_TAB} from './HomePage'
import ViewUtils from '../util/ViewUtils'
import BaseComponent from './BaseComponent'
import CustomThemePage from './my/CustomTheme'
export default class FavoritePage extends BaseComponent {
  constructor(props){
    super(props);
    this.state = {
      theme:this.props.theme,
      customThemeViewVisible:false,
    }
  }
  rightRenderView(){
    return <View style={{marginRight:0,flexDirection:'row'}}>

      {ViewUtils.getMoreButton(()=>this.refs.moreMenu.open())}
    </View>
  }
  renderMoreView = ()=>{
  let params={...this.props,fromPage:FLAG_TAB.flag_popularTab}
    return <MoreMenu
    ref='moreMenu'
    {...params}
    menus={[MORE_MENU.Custom_Theme,
            MORE_MENU.About_Author,
            MORE_MENU.About]}
    anchorView={this.refs.moreMenuButton}
    onMoreMenuSelect={(e)=>{
      if(e===MORE_MENU.Custom_Theme){
        this.setState({customThemeViewVisible:true})
      }
    }}
    />;
  }
  renderCustomThemeView(){
    return (<CustomThemePage
      visible={this.state.customThemeViewVisible}
      {...this.props}
      onClose={()=>this.setState({customThemeViewVisible:false})}
      />)
  }

  render(){
    let statusBar = {backgroundColor:this.state.theme.themeColor};
    let content=<ScrollableTabView
    tabBarBackgroundColor={this.state.theme.themeColor}
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
        statusBar={statusBar}
        style={this.state.theme.styles.navBar}
        rightButton={this.rightRenderView()}
        />
        {content}
        {this.renderMoreView()}
          {this.renderCustomThemeView()}
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
      favoriteKeys:[],
      theme:this.props.theme
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
  theme={this.props.theme}
  onSelect={()=>this.onSelect(item)}
  onFavorite={(item,isFavorite)=>this.onFavorite(item,isFavorite)}
  />
  }
  noneData(){
    return <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
    <Image
        style={{width:50,height:50,marginTop:100,marginBottom:20,tintColor:this.props.theme.themeColor}}
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
    data={this.state.sourceData}
    refreshControl={
      <RefreshControl
               refreshing={this.state.isFetching}
               onRefresh={()=>this.loadData()}
               colors={[this.props.theme.themeColor]}
               progressBackgroundColor="#fff"
             />
}
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
