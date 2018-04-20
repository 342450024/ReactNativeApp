import React, { Component } from 'react';
import {
  Text,
  View,
  Linking,
  Alert
} from 'react-native';
import ViewUtils from '../../util/ViewUtils'
import {MORE_MENU} from '../../common/MoreMenu'
import WebViewSite from '../WebViewSite'
import GlobalStyles from '../../../res/styles/GlobalStyles'
import AboutCommon,{FLAG_ABOUT} from './AboutCommon'
import config from '../../../res/data/config.json'
import AboutMePage from './AboutMePage'
export default class AboutPage extends Component {
  constructor(props) {
    super(props);
    this.aboutCommon = new AboutCommon(props,(dic)=>this.updateState(dic),FLAG_ABOUT.flag_about,config);
    this.state={
      projectModels:[],
      author:config.author
    }
  }
   updateState(dic){
     this.setState(dic)
   }

   componentDidMount(){
     this.aboutCommon.componentDidMount();
   }
    itemClick(menu){
      let TargetComponent,params = {...this.props,menuType:menu};
      switch (menu) {
          case MORE_MENU.Feedback:
          let url = "mqqwpa://im/chat?chat_type=wpa&uin=342450024";
          Linking.canOpenURL(url).then(supported => {
              if (!supported) {
                Alert.alert(
                    '友情提示',
                    '您的设备上没有安装QQ',
                    [
                      {text: '了解', onPress: () => console.log('OK Pressed')},
                    ],
                  )
              } else {
                return Linking.openURL(url);
              }
              }).catch(err => console.error('An error occurred', err));
            break;
          case MORE_MENU.WebSite:
            TargetComponent = WebViewSite;
            params.url = 'https://github.com/342450024';
            params.title = '网站'
            break;
          case MORE_MENU.About_Author:
           TargetComponent = AboutMePage;
            break;

      }
      if(TargetComponent){
        this.props.navigator.push({
          component:TargetComponent,
          params:params
        })
      }
    }


  render() {
    let content = <View>
    {this.aboutCommon.renderRepository(this.state.projectModels)}
    {ViewUtils.getSettingItem(()=>this.itemClick(MORE_MENU.WebSite),require('../../../res/images/ic_computer.png'),'网站',{tintColor:'#2196f3'})}
    <View style={GlobalStyles.line}></View>
    {ViewUtils.getSettingItem(()=>this.itemClick(MORE_MENU.About_Author),require('../my/img/ic_insert_emoticon.png'),'作者',{tintColor:'#2196f3'})}
    <View style={GlobalStyles.line}></View>
    {ViewUtils.getSettingItem(()=>this.itemClick(MORE_MENU.Feedback),require('../../../res/images/ic_feedback.png'),'QQ',{tintColor:'#2196f3'})}
    <View style={GlobalStyles.line}></View>
    </View>;
    return this.aboutCommon.renderView(content,{
         'name':'W-优选',
         'description':'优选豆瓣top电影,热度音乐,热门书籍!',
         'avatar':this.state.author.avatar1,
         'backgroundImg':this.state.author.backgroundImg1
    });

  }
}
