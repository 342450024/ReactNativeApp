import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator
} from 'react-native';

import NavigationBar from '../common/NavigationBar'
import ViewUtils from '../util/ViewUtils'
import FavoriteDao from "../expand/dao/FavoriteDao"
import Toast,{DURATION} from 'react-native-easy-toast';
import RepositoryCell from '../common/RepositoryCell'
import DataRepository,{FLAG_STORAGE} from '../expand/dao/DataRepository'
import GlobalStyles from '../../res/styles/GlobalStyles'
import WebViewDetail from './WebViewDetail'
import Utils from '../util/utils'
import ProjectModel from '../model/ProjectModel'
const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
var favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
export default class PopularPage extends Component {
  constructor(props){
    super(props);
    this.state = {
      rightText:'搜索',
      result:'',
      sourceData:'',
      isFetching:false,
      favoriteKeys:[],
      bottomButtonShow:false
    }
  }
  componentDidMount(){

  }

    flushFavoriteState(){
      let projectModels=[];
      let items = this.items;
      for(var i=0,len=items.length;i<len;i++){
        projectModels.push(new ProjectModel(items[i],Utils.checkFavorite(items[i],this.state.favoriteKeys)));
      }
      this.updateState({
        isFetching:false,
        sourceData:projectModels,
        rightText:'搜索',
        bottomButtonShow:true
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
  loadData = () => {
  this.updateState({
    isFetching: true
  })
  fetch(this.getFetchUrl(this.inputKey))
       .then(response=>response.json())
       .then(responseData=>{
         if(!this||!responseData||!responseData.items||responseData.items.length===0){
           this.toast.show(this.inputKey+'没有找到',DURATION.LENGTH_LONG);
           this.updateState({isFetching:false,rightText:'搜索'});
           return ;
         }
         this.items = responseData.items;
         this.getFavoriteKeys();
       })
       .catch(e=>{
         this.updateState({
           isFetching:false,
           rightText:'搜索'
         })
       })

}
getFetchUrl(key){
   return URL+key+QUERY_STR;
}
onBackPress(){
  this.refs.input.blur();
 this.props.navigator.pop();
}
updateState(dic){
   this.setState(dic)
}
SearchBtn(){
  //隐藏键盘

  this.refs.input.blur();
 if(this.state.rightText == '搜索'){
   this.updateState({rightText:'取消'});
   this.loadData();
 }else{
   this.updateState({rightText:'搜索'})
 }
}
  renderNavBar(){
    let backButton = ViewUtils.getLeftButton(()=>{this.onBackPress()});
    let inputView = <TextInput ref='input' onChangeText={(text)=>this.inputKey = text} style={styles.textTnput} />
    let rightView = <View style={{padding:5,marginRight:5}}>
   <TouchableOpacity onPress={()=>{this.SearchBtn()}}>
   <Text style={{color:'#fff'}}>{this.state.rightText}</Text>
   </TouchableOpacity>
    </View>
    return <View style={{
      backgroundColor:'#2196F3',
      flexDirection:'row',
      alignItems:'center',
      height:(Platform.OS === 'ios')?GlobalStyles.nav_bar_height_ios:GlobalStyles.nav_bar_height_android,
    }}>
          {backButton}
          {inputView}
          {rightView}
    </View>
  }
  render(){
    let statusBar = null;
    if(Platform.OS === 'ios'){
      statusBar=<View style={[styles.statusBar,{backgroundColor:'#2196F3'}]} />
    }
    let flatlist=!this.state.isFetching?<FlatList
    ref={(flatList)=>this._flatList = flatList}
    keyExtractor={(item, index) => index}
    renderItem={(item)=><RepositoryCell key={item.item.id} item={item.item} {...this.props} onSelect={()=>this.onSelect(item)} onFavorite={(item,isFavorite)=>this.onFavorite(item,isFavorite)}/>}

    data={this.state.sourceData}
    />:null;
    let indicaorView=this.state.isFetching?
    <ActivityIndicator
        style={styles.centering}
        size='large'
        animating={this.state.isFetching}
    />:null;
    let bottomButton=this.state.bottomButtonShow?<TouchableOpacity  style={[styles.bottomButton,{backgroundColor:'#2196F3'}]}>
     <Text style={{color:'#fff'}}>添加到主页</Text>
     </TouchableOpacity>:null;

    return <View style={GlobalStyles.root_container}>
         {statusBar}
         {this.renderNavBar()}
          {flatlist}
          {indicaorView}
          {bottomButton}
         <Toast ref={(e)=>this.toast=e}/>
        </View>
  }
}


const styles = StyleSheet.create({
  container:{
    flex:1
  },
  statusBar:{
     height:20
  },
  textTnput:{
    flex:1,
    height:(Platform.OS === 'ios')?30:40,
    borderWidth:(Platform.OS === 'ios')?1:0,
    borderColor:'#fff',
    alignSelf:'center',
    paddingLeft:5,
    marginRight:10,
    marginLeft:5,
    borderRadius:3,
    color:'#fff'
  },
  bottomButton:{
    alignItems:'center',
    justifyContent:'center',
    opacity:0.9,
    height:40,
    position:'absolute',
    left:15,
    top:GlobalStyles.window_height-80,
    right:15,
    borderRadius:5
  },
  centering:{
    alignItems:'center',
    justifyContent:'center',
    flex:1
  }
})
