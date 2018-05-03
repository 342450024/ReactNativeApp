import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  PixelRatio,
  StyleSheet,
  Text,
  View,
  Platform
} from 'react-native';

import ParallaxScrollView from 'react-native-parallax-scroll-view';
import ViewUtils from '../../util/ViewUtils'
import Utils from '../../util/utils'
import RepositoryCell from '../../common/RepositoryCell'
import ProjectModel from '../../model/ProjectModel'
import WebViewDetail from '../WebViewDetail'
import FavoriteDao from "../../expand/dao/FavoriteDao"
import RepositoryUtils from "../../expand/dao/RepositoryUtils"
import {FLAG_STORAGE} from '../../expand/dao/DataRepository'
export var FLAG_ABOUT = {flag_about:'about',flag_about_me:'about_me'};
export default class AboutCommon{
  constructor(props,updateState,flag_about,config) {
    this.props = props;
    this.updateState = updateState;
    this.flag_about = flag_about;
    this.config = config;
    this.repositories = [];
    this.favoriteKeys = null;
    this.favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
    this.repositoryUtils = new RepositoryUtils(this);
  }
  /**
   * 通知数据发生改变
   */
   onNotifyDataChanged(items){
       this.updateFavorite(items);
   }

   componentDidMount(){
       if(this.flag_about==FLAG_ABOUT.flag_about){
          this.repositoryUtils.fetchRepository(this.config.info.currentRepoUrl);
       }else{
         var urls=[];
         var items=this.config.items;
         for(let i=0,l=items.length;i<l;i++){
           urls.push(this.config.info.url+items[i]);
         }
         this.repositoryUtils.fetchRepositories(urls);
       }
   }
   /**
    * 更新项目的用户收藏状态
    */
   async updateFavorite(repositories){
    if(repositories)this.repositories = repositories;
    if(!this.repositories)return;
    if(!this.favoriteKeys){
         this.favoriteKeys=await this.favoriteDao.getFavoriteKeys();
    }
    let projectModels = [];
    for(var i=0,len=this.repositories.length;i<len;i++){
      var data = this.repositories[i];
          data = data.item?data.item:data;
      projectModels.push({
        isFavorite:Utils.checkFavorite(data,this.favoriteKeys?this.favoriteKeys:[]),
        item:data,
      });
    }
    this.updateState({
      projectModels:projectModels
    })
   }
   onSelect(item){
     this.props.navigator.push({
       component:WebViewDetail,
       params:{
         item:item,
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
       this.favoriteDao.saveFavoriteItem(item.id.toString(),JSON.stringify(item));
     }else{
       this.favoriteDao.removeFavoriteItem(item.id.toString());
     }
   }
   /**
    * 创建项目视图
    */
  renderRepository(projectModels){
    if(!projectModels||projectModels.length ===0 )return null;
    let views=[];
    for(let i=0,l=projectModels.length;i<l;i++){
      let projectModel = projectModels[i];
      views.push(
        <RepositoryCell
        key={projectModel.item.id}
        item={projectModel}
        {...this.props}
        onSelect={()=>this.onSelect(projectModel)}
        onFavorite={(item,isFavorite)=>this.onFavorite(item,isFavorite)}/>
      )
    }
     return views;
  }
  getParallaxRnderConfig(params){
    let config = {};
    config.renderBackground=() => (
      <View key="background">
        <Image source={{uri:params.backgroundImg,
                        width: window.width,
                        height: PARALLAX_HEADER_HEIGHT}}/>
        <View style={{position: 'absolute',
                      top: 0,
                      width: window.width,
                      backgroundColor: 'rgba(0,0,0,.4)',
                      height: PARALLAX_HEADER_HEIGHT}}/>
      </View>
    );
    config.renderForeground=() => (
      <View key="parallax-header" style={ styles.parallaxHeader }>
        <Image style={ styles.avatar } source={{
          uri:params.avatar,
          width: AVATAR_SIZE,
          height: AVATAR_SIZE
        }}/>
        <Text style={ styles.sectionSpeakerText }>
          {params.name}
        </Text>
        <Text style={ styles.sectionTitleText }>
          {params.description}
        </Text>
      </View>
    );
    config.renderStickyHeader=() => (
      <View key="sticky-header" style={styles.stickySection}>
        <Text style={styles.stickySectionText}>{params.name}</Text>
      </View>
    );
    config.renderFixedHeader=() => (
      <View key="fixed-header" style={styles.fixedSection}>
        {ViewUtils.getLeftButton(()=>this.props.navigator.pop())}
      </View>
    );
    return config;

  }

  renderView(bottomView,params) {
    let renderConfig = this.getParallaxRnderConfig(params);
    return (
          <ParallaxScrollView
            headerBackgroundColor="#333"
            backgroundColor={this.props.theme.themeColor}
            stickyHeaderHeight={ STICKY_HEADER_HEIGHT }
            parallaxHeaderHeight={ PARALLAX_HEADER_HEIGHT }
            backgroundSpeed={10}
            {...renderConfig}

            >
          {bottomView}
          </ParallaxScrollView>
        );
  }

}

const window = Dimensions.get('window');

const AVATAR_SIZE = 120;
const ROW_HEIGHT = 60;
const PARALLAX_HEADER_HEIGHT = 350;
const STICKY_HEADER_HEIGHT = 70;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: window.width,
    height: PARALLAX_HEADER_HEIGHT
  },
  stickySection: {
    height: STICKY_HEADER_HEIGHT,
    justifyContent: 'center',
    alignItems:'center',
    paddingTop:(Platform.OS === 'ios')?20:0
  },
  stickySectionText: {
    color: 'white',
    fontSize: 20,
    margin: 10
  },
  fixedSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    top:0,
    bottom:0,
    flexDirection:'row',
    alignItems:'center',
    paddingTop:(Platform.OS === 'ios')?20:0,
  },
  fixedSectionText: {
    color: '#999',
    fontSize: 20
  },
  parallaxHeader: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    paddingTop: 100
  },
  avatar: {
    marginBottom: 10,
    borderRadius: AVATAR_SIZE / 2
  },
  sectionSpeakerText: {
    color: 'white',
    fontSize: 24,
    paddingVertical: 5
  },
  sectionTitleText: {
    color: 'white',
    fontSize: 18,
    paddingVertical: 5
  },
  row: {
    overflow: 'hidden',
    paddingHorizontal: 10,
    height: ROW_HEIGHT,
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderBottomWidth: 1,
    justifyContent: 'center'
  },
  rowText: {
    fontSize: 20
  }
});
