import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';
import WebViewDetail from '../pages/WebViewDetail'
import HTMLView from 'react-native-htmlview'
export default class TrendingCell extends Component{
  constructor(props){
     super(props);
     this.state = {
       theme:this.props.theme,
       isFavorite:this.props.item.isFavorite,
       favoriteIcon:require('../../res/images/ic_unstar_transparent.png')
     }
  }
  onPressFavorite(){
    this.setFavoriteState(!this.state.isFavorite);
    this.props.onFavorite(this.props.item.item,!this.state.isFavorite);
  }
  setFavoriteState(isFavorite){
    this.setState({
      isFavorite:isFavorite,
      favoriteIcon:isFavorite?require('../../res/images/ic_star.png'):require('../../res/images/ic_unstar_transparent.png')
    })
  }
  componentWillReceiveProps(nextProps){
     this.setFavoriteState(nextProps.item.isFavorite);
     if(nextProps.theme!==this.state.theme){
       this.setState({theme:nextProps.theme});

     }
  }


  render(){
    let description = '<p>'+this.props.item.item.description+'</p>';
    let favoriteButton=<TouchableOpacity
     onPress={()=>{this.onPressFavorite()}}
    >
      <Image style={[{width:20,height:20},{tintColor:this.state.theme.themeColor}]} source={this.state.favoriteIcon}/>
    </TouchableOpacity>
    return  <TouchableOpacity
    style={styles.container}
    onPress={this.props.onSelect}
    >
    <View style={styles.cell_container}>
    <Text style={styles.title}>{this.props.item.item.fullName}</Text>
    <Text style={styles.title}>{this.props.item.isFavorite?'11':'00'}</Text>
    <HTMLView
       value={description}
       onLinkPress={(url) => {}}
       stylesheet={{
         p:styles.content,
         a:styles.content
       }}
    />
    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
        <View style={{flexDirection:'row',alignItems:'center'}}>
            <Text>作者：</Text>
        {this.props.item.item.contributors.map((result,i,arr)=>{
        return <Image
         key={i}
         style={{height:22,width:22}}
         source={{uri:arr[i]}}
        />;
        })}



        </View>
        <View style={{flexDirection:'row',alignItems:'center'}}>
            <Text>点赞：</Text>
            <Text>{this.props.item.item.starCount}</Text>
        </View>
        {favoriteButton}
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
