import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableHighlight
} from 'react-native';
export default class ViewUtils{
  /**
   * callBack 回调函数
   * icon 左侧图标
     text显示的文本
     tintStyle 图标颜色
     expandableIcon 右侧图标
   */
     static getSettingItem(callBack,icon,text,tintStyle,expandableIcon){
            return (
              <TouchableHighlight
                onPress={callBack}
              >
              <View style={styles.item}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                          <Image source={icon} resizeMode='stretch'
                               style={[{width:20,height:20,marginRight:15,marginLeft:15},tintStyle]}
                          />
                          <Text>{text}</Text>
                    </View>
                   <Image source={expandableIcon?expandableIcon:require('../../res/images/ic_tiaozhuan.png')}
                   style={[{width:22,height:22,marginRight:10},tintStyle]}
                   />
              </View>
              </TouchableHighlight>
            );
     }
       static getLeftButton(callBack){
         return <TouchableOpacity
          style={{padding:8}}
          onPress={callBack}>
         <Image
              style={{width:26,height:26,tintColor:'#fff'}}
              source={require('../../res/images/ic_arrow_back_white_36pt.png')}
         />
         </TouchableOpacity>
       }
       /**
        * 获取更多按钮
        */
        static getMoreButton(callBack){
          return <TouchableHighlight
              underlayColor={'transparent'}
              ref='moreMenuButton'
              style={{padding:5}}
              onPress={callBack}
          >
          <View style={{paddingRight:8}}>
              <Image style={{width:24,height:24}} source={require('../../res/images/ic_more_vert_white_48pt.png')}/>
          </View>
          </TouchableHighlight>
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
    backgroundColor:'#fff',
    padding:10,
    height:60
  },
  tips:{
    fontSize:29
  }
})
