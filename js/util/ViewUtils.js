import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';
export default class ViewUtils{
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
}
