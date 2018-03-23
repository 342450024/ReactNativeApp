/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Button
} from 'react-native';
import NavigationBar from './NavigationBar';
var ITEM_HEIGHT = 80;

export default class FlatListText extends Component{
  dataContainer = [];
  constructor(props){
    super(props);
    this.state = {
    isFetching: false,
    sourceData:[]
    }
  }


  componentDidMount() {
    // 初始化数据
    for (let i = 0; i < 20; i ++) {
        let obj = {
            id: i
            ,title: i + '只柯基'
        };
        this.dataContainer.push(obj);
    }
    this.setState({
        sourceData: this.dataContainer
    });
}


  // 下拉刷新
  _renderRefresh = () => {
      this.setState({isFetching: true})//开始刷新
      //这里模拟请求网络，拿到数据，3s后停止刷新
      setTimeout(() => {
          this.setState({isFetching: false});
      }, 3000);
  };
  // 上拉加载更多
_onEndReached = () => {
    let newData = [];

    for (let i = 20; i < 30; i ++) {
        let obj = {
            id: i
            ,title:'生了只小柯基'
        };

        newData.push(obj);
    }

    this.dataContainer = this.dataContainer.concat(newData);
    this.setState({
        sourceData: this.dataContainer
    });
};


 _renderItem = (item) => {
     var txt = '第' + item.index + '个' + ' title=' + item.item.title;
     var bgColor = item.index % 2 == 0 ? 'red' : 'blue';
     return <Text style={[{height:ITEM_HEIGHT},styles.txt]}>{txt}</Text>
 }

 _header = () => {
     return <Text style={[styles.txt,{backgroundColor:'black'}]}>这是头部</Text>;
 }

 _footer = () => {
     return <Text style={[styles.txt,{backgroundColor:'black'}]}>这是尾部</Text>;
 }

 _separator = () => {
     return <View style={{
        height: 1,
        width: "90%",
        backgroundColor: "#CED0CE",
        marginLeft: "5%",
        marginRight: "5%"
        }}/>;
 }

  render() {


    return (
        <View style={styles.container}>
        <NavigationBar
        title={'FlatList'}
        style={{
          backgroundColor:'#EE6363'
        }}
        />

                  {/*<Button title='滚动到指定位置' onPress={()=>{
                      this._flatList.scrollToEnd();
                      this._flatList.scrollToIndex({index:0});
                      this._flatList.scrollToOffset({animated: true, offset: 2000});
                  }}/>*/}

                      <FlatList
                          ref={(flatList)=>this._flatList = flatList}
                          // ListHeaderComponent={this._header}
                          // ListFooterComponent={this._footer}
                          ItemSeparatorComponent={this._separator}
                          renderItem={this._renderItem}
                          onRefresh={this._renderRefresh}
                          refreshing={this.state.isFetching}
                          // 决定当距离内容最底部还有多远时触发onEndReached回调；数值范围0~1，例如：0.5表示可见布局的最底端距离content最底端等于可见布局一半高度的时候调用该回调
                         onEndReachedThreshold={0.1}
                         // 当列表被滚动到距离内容最底部不足onEndReacchedThreshold设置的距离时调用
                         onEndReached={ this._onEndReached }
                         keyExtractor={(item, index) => index}
                          // initialScrollIndex={5}
                          //numColumns ={3}
                          // columnWrapperStyle={{borderWidth:2,borderColor:'black',paddingLeft:20}}

                          // horizontal={true}

                          getItemLayout={(data,index)=>(
                          {length: ITEM_HEIGHT, offset: (ITEM_HEIGHT+1) * index, index}
                          )}

                          //onEndReachedThreshold={5}
                          //onEndReached={(info)=>{
                          //console.warn(info.distanceFromEnd);
                          //}}

                          //onViewableItemsChanged={(info)=>{
                          //console.warn(info);
                          //}}
                          data={this.state.sourceData}>
                      </FlatList>




        </View>
    );
  }
}
const styles = StyleSheet.create({
   container:{
     flex:1,
     backgroundColor:'#fff'
   },
   text:{
       fontSize:20
   },
   txt: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color: '#000',
        fontSize: 25,
    }
})
