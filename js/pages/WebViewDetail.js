import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  WebView
} from 'react-native';
import {Navigator} from 'react-native-deprecated-custom-components';
import NavigationBar from '../common/NavigationBar'
import ViewUtils from '../util/ViewUtils'
const URL = 'https://www.baidu.com/';
export default class WebViewDetail extends Component {
  constructor(props){
    super(props);
    this.url = this.props.item.html_url;
    let title = this.props.item.full_name;
    this.state = {
      url:this.url,
      canGoBack:false,
      title:title
    }
  }
  componentDidMount(){

  }
  onBack(){
   if(this.state.canGoBack){
     this.webView.goBack();
   }else {
     this.props.navigator.pop();
   }
  }
  onNavigationStateChange(navState){
  this.setState({
    canGoBack: navState.canGoBack,
    url: navState.url,
    loading: navState.loading,
  });
}
  render(){

    return <View style={styles.container}>
    <NavigationBar
        title={this.state.title}
        leftButton={ViewUtils.getLeftButton(()=>{this.onBack()})}
    />
    <WebView
    ref={webView=>this.webView=webView}
    source={{uri:this.state.url}}
    onNavigationStateChange={(navState)=>this.onNavigationStateChange(navState)}
    startInLoadingState={true}
    />
    </View>
  }
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#fff'
  },
  tips:{
    fontSize:29
  }
})
