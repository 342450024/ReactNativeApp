import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';
import WebViewDetail from '../pages/WebViewDetail'
export default class RepositoryCell extends Component{
  render(){
    return  <TouchableOpacity
    style={styles.container}
    onPress={this.props.onSelect}
    >
    <View style={styles.cell_container}>
    <Text style={styles.title}>{this.props.item.full_name}</Text>
    <Text style={styles.content}>{this.props.item.description}</Text>
    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
        <View style={{flexDirection:'row',alignItems:'center'}}>
            <Text>作者：</Text>
            <Image
               style={{height:22,width:22}}
               source={{uri:this.props.item.owner.avatar_url}}
            />
        </View>
        <View style={{flexDirection:'row',alignItems:'center'}}>
            <Text>点赞：</Text>
            <Text>{this.props.item.stargazers_count}</Text>
        </View>
        <Image style={{width:20,height:20}} source={require('../../res/images/ic_star.png')}/>
    </View>
    </View>
     </TouchableOpacity>
  }
}
const styles = StyleSheet.create({
  container:{
    flex:1
  },
  title:{
    fontSize:18,
    color:'#000',
    marginBottom:3
  },
  content:{
    fontSize:15,
    color:'#333333',
    marginBottom:3
  },
  cell_container:{
    backgroundColor:'white',
    padding:10,
    marginLeft:5,
    marginRight:5,
    marginVertical:3,
    borderWidth:0.5,
    borderRadius:2,
    borderColor:'#f1f1f1',
    elevation:2
  }

})
