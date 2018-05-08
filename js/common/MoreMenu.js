import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Linking,
  Alert,
  TouchableOpacity
} from 'react-native';
import CustomKeyPage from '../pages/my/CustomKeyPage'
import SortKeyPage from '../pages/my/SortKeyPage'
import AboutPage from '../pages/about/AboutPage'
import AboutMePage from '../pages/about/AboutMePage'
import {FLAG_LANGUAGE} from '../expand/dao/LanguageDao'
import Popover from './Popover'
import ShareUtil from './ShareUtil';

/**
 * 更多菜单
 */
 export const MORE_MENU = {
    Custom_Language:'自定义语言',
    Sort_Language:'语言排序',
    Custom_Key:'自定义标签',
    Sort_Key:'标签排序',
    Remove_Key:'标签移除',
    About_Author:'关于作者',
    About:'关于',
    Custom_Theme:'自定义主题',
    WebSite:'WebSite',
    Feedback:'反馈',
    Share:'分享'
 }
 export default class MoreMenu extends Component {
   constructor(props){
     super(props);
     this.state = {
       isVisible: false,
       buttonRect: {}
     }
   }
   static propTypes={
     contentStyle:View.propTypes.style,
     menus:PropTypes.array,
     anchorView:PropTypes.object,
   }
   open(){

     this.showPopover();
   }
   showPopover() {

     if(!this.props.anchorView)return;

     let anchorView=this.props.anchorView;
     anchorView.measure((ox, oy, width, height, px, py) => {
       this.setState({
         isVisible: true,
         buttonRect: {x: px, y: py, width: width, height: height}
       });
     });
   }

   closePopover() {
     this.setState({isVisible: false});
   }
   onMoreMenuSelect(tab){
     this.closePopover();
     if(typeof(this.props.onMoreMenuSelect)=='function')this.props.onMoreMenuSelect(tab);
     let TargetComponent,params = {...this.props,menuType:tab};
     switch (tab) {
       case MORE_MENU.Custom_Language:
         TargetComponent = CustomKeyPage;
         params.flag = FLAG_LANGUAGE.flag_language;
         break;
       case MORE_MENU.Sort_Language:
         TargetComponent = SortKeyPage;
         params.flag = FLAG_LANGUAGE.flag_language;
         break;
       case MORE_MENU.Custom_Key:
         TargetComponent = CustomKeyPage;
         params.flag = FLAG_LANGUAGE.flag_key;
         break;
       case MORE_MENU.Sort_Key:
         TargetComponent = SortKeyPage;
         params.flag = FLAG_LANGUAGE.flag_key;
         break;
         case MORE_MENU.Remove_Key:
           TargetComponent = CustomKeyPage;
           params.flag = FLAG_LANGUAGE.flag_key;
           params.isRemoveKey = true;
           break;
         case MORE_MENU.Custom_Theme:

           break;
         case MORE_MENU.About_Author:
         TargetComponent = AboutMePage;
           break;
         case MORE_MENU.About:
         TargetComponent = AboutPage;
           break;
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
             case MORE_MENU.Share:
             ShareUtil.shareboard('Check react-native umeng share sdk','imgUrl','https://github.com/ubbcou/blog/issues/18','this is Title.',[1,2],(code,message) =>{
 Alert.alert('title', 'msg:' + message);
});
               break;

     }
     if(TargetComponent){
       this.props.navigator.push({
         component:TargetComponent,
         params:params
       })
     }
   }
   renderMoreView(){
     let view = <Popover
            isVisible={this.state.isVisible}
            fromRect={this.state.buttonRect}
            placement="bottom"
            onClose={()=>this.closePopover()}
            contentMarginRight={20}
            contentStyle={{opacity:0.82,backgroundColor:'#343434'}}
     >
            <View style={{alignItems: 'center'}}>
                {this.props.menus.map((result, i, arr) => {
                    return <TouchableOpacity key={i} onPress={()=>this.onMoreMenuSelect(arr[i])}>
                        <Text
                            style={{fontSize: 18,color:'white', padding: 8, fontWeight: '400'}}>
                            {arr[i]}
                        </Text>
                    </TouchableOpacity>
                })
                }
            </View>
        </Popover>
     return view;
   }
   render(){
     return this.renderMoreView();
   }
 }
