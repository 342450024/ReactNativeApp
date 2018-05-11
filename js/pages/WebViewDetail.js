import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  WebView,
  Image,
  TouchableOpacity
} from 'react-native';
import {Navigator} from 'react-native-deprecated-custom-components';
import NavigationBar from '../common/NavigationBar'
import ViewUtils from '../util/ViewUtils'
import BackPressComponent from '../common/BackPressComponent'
const TRENDING_URL = 'https://github.com/';
const URL = 'https://www.baidu.com/';
import FavoriteDao from "../expand/dao/FavoriteDao"

export default class WebViewDetail extends Component {
  constructor(props){
    super(props);
    this.backPress=new BackPressComponent({backPress:(e)=>this.onBackPress(e)});
    this.url = this.props.item.item.html_url?this.props.item.item.html_url:TRENDING_URL+this.props.item.item.fullName;
    let title = this.props.item.item.full_name?this.props.item.item.full_name:this.props.item.item.fullName;
    this.favoriteDao = new FavoriteDao(this.props.flag);
    this.state = {
      url:this.url,
      canGoBack:false,
      title:title,
      theme:this.props.theme,
      isFavorite:this.props.item.isFavorite,
      favoriteIcon:this.props.item.isFavorite?require('../../res/images/ic_star.png'):require('../../res/images/ic_star_navbar.png')
    }
  }
  onBackPress(e){
    this.onBack();
    return true;
  }
  componentDidMount(){
     this.backPress.componentDidMount();
  }
  componentWillUnmount(){
    this.backPress.componentWillUnmount();
  }

  onBack(){
   if(this.state.canGoBack){
     this.webView.goBack();
   }else {
     this.props.navigator.pop();
   }
  }
  onNavigationStateChange(navState){
  this.setState({
    canGoBack: navState.canGoBack,
    url: navState.url,
    loading: navState.loading,
  });
}
setFavoriteState(isFavorite){
  this.setState({
    isFavorite:isFavorite,
    favoriteIcon:isFavorite?require('../../res/images/ic_star.png'):require('../../res/images/ic_star_navbar.png')
  })
}
onRightButtonClick(){
  var Item = this.props.item;
  this.setFavoriteState(Item.isFavorite=!Item.isFavorite);
  var key = Item.item.id?Item.item.id.toString():Item.item.fullName;
  if(Item.isFavorite){
    this.favoriteDao.saveFavoriteItem(key,JSON.stringify(Item.item));
  }else{
    this.favoriteDao.removeFavoriteItem(key);
  }
}
renderRightButton(){
  return <TouchableOpacity
        onPress={()=>this.onRightButtonClick()}
  >
        <Image
            style={{width:20,height:20,marginRight:10}}
            source={this.state.favoriteIcon}
        />
        </TouchableOpacity>
}
  render(){

    return <View style={styles.container}>
    <NavigationBar
        title={this.state.title}
         style={this.state.theme.styles.navBar}
        leftButton={ViewUtils.getLeftButton(()=>{this.onBack()})}
        rightButton={this.renderRightButton()}
    />
    <WebView
    ref={webView=>this.webView=webView}
    source={{uri:this.state.url}}
    onNavigationStateChange={(navState)=>this.onNavigationStateChange(navState)}
    startInLoadingState={true}
    />
    </View>
  }
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#fff'
  },
  tips:{
    fontSize:29
  }
})
