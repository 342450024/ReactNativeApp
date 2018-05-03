import React, { Component } from 'react';
import {
  Text,
  View,
  Linking,
  Alert,
  Clipboard,
  StyleSheet
} from 'react-native';
import ViewUtils from '../../util/ViewUtils'
import {MORE_MENU} from '../../common/MoreMenu'
import WebViewSite from '../WebViewSite'
import GlobalStyles from '../../../res/styles/GlobalStyles'
import AboutCommon,{FLAG_ABOUT} from './AboutCommon'
import Toast,{DURATION} from 'react-native-easy-toast';
import config from '../../../res/data/config.json'
const FLAG={
  REPOSITORY:'开源项目',
  BLOG:{
    name:'技术博客',
    items:{
      PERSONAL_BLOG:{
        title:'个人博客',
        url:'http://jiapenghui.com',
      },
      CSDN:{
        title:'CSDN',
        url:'http://blog.csdn.net/fengyuzhengfan',
      },
      JIANSHU:{
        title:'简书',
        url:'http://www.jianshu.com/users/ca3943a4172a/latest_articles',
      },
      GITHUB:{
        title:'GitHub',
        url:'https://github.com/crazycodeboy',
      },
    }
  },
  CONTACT:{
    name:'联系方式',
    items:{
      QQ:{
        title:'QQ',
        account:'342450024',
      },
      Email:{
        title:'Email',
        account:'342450024@qq.com',
      }
    }
  },
  QQ:{
    name:'技术交流群',
    items:{
      MD:{
        title:'移动开发者技术分享群',
        account:'342450024',
      },
      RN:{
        title:'React Native学习交流群',
        account:'342450024'
      }
    }
  }
}
export default class AboutMePage extends Component {
  constructor(props) {
    super(props);
    this.aboutCommon = new AboutCommon(props,(dic)=>this.updateState(dic),FLAG_ABOUT.flag_about_me,config);
    this.state={
      projectModels:[],
      author:config.author,
      showRepository:false,
      showBlog:false,
      showQQ:false,
      showContact:false,
      theme:this.props.theme
    }
  }
   updateState(dic){
     this.setState(dic)
   }

   componentDidMount(){
     this.aboutCommon.componentDidMount();
   }
   getClickIcon(isShow){
     return isShow?require('../../../res/images/ic_tiaozhuan_up.png'):require('../../../res/images/ic_tiaozhuan_down.png');
   }
    itemClick(menu){
      let TargetComponent,params = {...this.props,menuType:menu};
      switch (menu) {
          case FLAG.BLOG.items.CSDN:
          case FLAG.BLOG.items.PERSONAL_BLOG:
          case FLAG.BLOG.items.JIANSHU:
          case FLAG.BLOG.items.GITHUB:
           TargetComponent = WebViewSite;
           params.title = menu.title;
           params.url = menu.url;
          break;
          case FLAG.CONTACT.items.Email:
          let url = "mailto://"+menu.account;
          Linking.canOpenURL(url).then(supported => {
              if (!supported) {
                Alert.alert(
                    '友情提示',
                    '您的设备上没有安装Email',
                    [
                      {text: '了解', onPress: () => console.log('OK Pressed')},
                    ],
                  )
              } else {
                return Linking.openURL(url);
              }
              }).catch(err => console.error('An error occurred', err));
            break;
          case FLAG.CONTACT.items.QQ:
          case FLAG.QQ.items.MD:
          case FLAG.QQ.items.RN:
            Clipboard.setString(menu.account)
            this.toast.show('号码:'+menu.account+'已复制到剪切板')
            break;

          case FLAG.BLOG:
         this.updateState({showBlog:!this.state.showBlog});
          break;
          case FLAG.REPOSITORY:
         this.updateState({showRepository:!this.state.showRepository});
          break;
            case FLAG.QQ:
          this.updateState({showQQ:!this.state.showQQ});
              break;
              case FLAG.CONTACT:
          this.updateState({showContact:!this.state.showContact});
                break;

      }
      if(TargetComponent){
        this.props.navigator.push({
          component:TargetComponent,
          params:params
        })
      }
    }
    renderItems(dic,isShowAccount){
      if(!dic)return null;
      let views=[];
      for(let i in dic){
        let title=isShowAccount?dic[i].title+':'+dic[i].account:dic[i].title;
        views.push(
          <View key={i}>
            {ViewUtils.getSettingItem(()=>this.itemClick(dic[i]),'',title,{tintColor:this.state.theme.themeColor})}
          </View>
        )
      }
      return views;
    }

  render() {
    let content = <View>

    {ViewUtils.getSettingItem(()=>this.itemClick(FLAG.BLOG),require('../../../res/images/ic_computer.png'),FLAG.BLOG.name,{tintColor:this.state.theme.themeColor},
    this.getClickIcon(this.state.showBlog))}
    <View style={GlobalStyles.line}></View>
    {this.state.showBlog?this.renderItems(FLAG.BLOG.items):null}

    {ViewUtils.getSettingItem(()=>this.itemClick(FLAG.REPOSITORY),require('../../../res/images/ic_code.png'),FLAG.REPOSITORY,{tintColor:this.state.theme.themeColor},
    this.getClickIcon(this.state.showRepository))}
    <View style={GlobalStyles.line}></View>
    {this.state.showRepository?this.aboutCommon.renderRepository(this.state.projectModels):null}

    {ViewUtils.getSettingItem(()=>this.itemClick(FLAG.QQ),require('../../../res/images/ic_feedback.png'),FLAG.QQ.name,{tintColor:this.state.theme.themeColor},
    this.getClickIcon(this.state.showQQ))}
    <View style={GlobalStyles.line}></View>
    {this.state.showQQ?this.renderItems(FLAG.QQ.items,true):null}

    {ViewUtils.getSettingItem(()=>this.itemClick(FLAG.CONTACT),require('../../../res/images/ic_contacts.png'),FLAG.CONTACT.name,{tintColor:this.state.theme.themeColor},
    this.getClickIcon(this.state.showContact))}
    <View style={GlobalStyles.line}></View>
    {this.state.showContact?this.renderItems(FLAG.CONTACT.items,true):null}

    </View>;
    return (<View style={styles.container}>
      {this.aboutCommon.renderView(content,this.state.author)}
      <Toast ref={e=>this.toast=e}/>
      </View>)

  }
}
const styles = StyleSheet.create({
  container:{
    flex:1
  },

})
