import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  WebView,
  Image,
  TouchableOpacity
} from 'react-native';
import {Navigator} from 'react-native-deprecated-custom-components';
import NavigationBar from '../common/NavigationBar'
import ViewUtils from '../util/ViewUtils'

export default class WebViewSite extends Component {
  constructor(props){
    super(props);

    this.state = {
      url:this.props.url,
      canGoBack:false,
      title:this.props.title,
      theme:this.props.theme
    }
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
        style={this.state.theme.styles.navBar}
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
