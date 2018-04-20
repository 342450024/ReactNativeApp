import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  ScrollView
} from 'react-native';

import NavigationBar from '../../common/NavigationBar'
import CustomKeyPage from './CustomKeyPage'
import SortKeyPage from './SortKeyPage'
import AboutPage from '../about/AboutPage'
import AboutMePage from '../about/AboutMePage'
import {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao'
import {MORE_MENU} from '../../common/MoreMenu'
import GlobalStyles from '../../../res/styles/GlobalStyles'
import ViewUtils from '../../util/ViewUtils'
export default class MyPage extends Component {
  // this.props.navigator.resetTo({
  //       component:HomePage
  // })
  itemClick(menu){
    let TargetComponent,params = {...this.props,menuType:menu};
    switch (menu) {
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

    }
    if(TargetComponent){
      this.props.navigator.push({
        component:TargetComponent,
        params:params
      })
    }
  }
  render(){
    let top = <NavigationBar title={'我的'}/>
    return <View style={GlobalStyles.root_container}>
         {top}
         <ScrollView>
         <TouchableHighlight
         activeOpacity={0.5}
         onPress={()=>this.itemClick(MORE_MENU.About)}
         >
         <View style={styles.item}>
               <View style={{flexDirection:'row',alignItems:'center'}}>
                     <Image source={require('../../../res/images/ic_trending.png')}
                          style={[{width:40,height:40,marginRight:10},{tintColor:'#2196f3'}]}
                     />
                     <Text>天龙八部</Text>
               </View>
              <Image source={require('../../../res/images/ic_tiaozhuan.png')}
              style={[{width:22,height:22,marginRight:10},{tintColor:'#2196f3'}]}
              />

         </View>
         </TouchableHighlight>
         <View style={GlobalStyles.line}></View>
         {/*趋势管理*/}
         <Text style={styles.groupTitle}>趋势管理</Text>
         <View style={GlobalStyles.line}></View>
         {ViewUtils.getSettingItem(()=>this.itemClick(MORE_MENU.Custom_Language),require('./img/ic_custom_language.png'),'自定义语言',{tintColor:'#2196f3'})}
         <View style={GlobalStyles.line}></View>
         {ViewUtils.getSettingItem(()=>this.itemClick(MORE_MENU.Sort_Language),require('./img/ic_swap_vert.png'),'语言排序',{tintColor:'#2196f3'})}
         <View style={GlobalStyles.line}></View>
          {/*标签管理*/}
          <Text style={styles.groupTitle}>标签管理</Text>
          <View style={GlobalStyles.line}></View>
          {ViewUtils.getSettingItem(()=>this.itemClick(MORE_MENU.Custom_Key),require('./img/ic_custom_language.png'),'自定义标签',{tintColor:'#2196f3'})}
          <View style={GlobalStyles.line}></View>
          {ViewUtils.getSettingItem(()=>this.itemClick(MORE_MENU.Sort_Key),require('./img/ic_swap_vert.png'),'标签排序',{tintColor:'#2196f3'})}
          <View style={GlobalStyles.line}></View>
          {ViewUtils.getSettingItem(()=>this.itemClick(MORE_MENU.Remove_Key),require('./img/ic_remove.png'),'标签移除',{tintColor:'#2196f3'})}
          <View style={GlobalStyles.line}></View>
          {/*设置*/}
          <Text style={styles.groupTitle}>设置</Text>
          <View style={GlobalStyles.line}></View>
          {ViewUtils.getSettingItem(()=>this.itemClick(MORE_MENU.Custom_Theme),require('./img/ic_view_quilt.png'),'自定义主题',{tintColor:'#2196f3'})}
          <View style={GlobalStyles.line}></View>
          {ViewUtils.getSettingItem(()=>this.itemClick(MORE_MENU.About_Author),require('./img/ic_insert_emoticon.png'),'关于作者',{tintColor:'#2196f3'})}
          <View style={GlobalStyles.line}></View>
         </ScrollView>








    </View>
  }
}
const styles = StyleSheet.create({
  container:{
    flex:1
  },
  item:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    padding:10,
    height:60,
    backgroundColor:'#fff'
  },
  tips:{
    fontSize:29
  },
  groupTitle:{
    marginLeft:10,
    marginTop:10,
    marginBottom:5,
    fontSize:12,
    color:'gray'
  }
})
