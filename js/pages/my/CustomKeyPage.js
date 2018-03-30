import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import {Navigator} from 'react-native-deprecated-custom-components';
import NavigationBar from '../../common/NavigationBar'
import ViewUtils from '../../util/ViewUtils'
import LanguageDao,{FLAG_LANGUAGE} from "../../expand/dao/LanguageDao"
import CheckBox from 'react-native-check-box';
import ArrayUtils from '../../util/ArrayUtils';
export default class CustomKeyPage extends Component {
  constructor(props){
     super(props);
     this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
     this.chanageValues = [];
     this.isRemoveKey = this.props.isRemoveKey?true:false;
     this.state={
       dataArray:[]
     }
  }
  componentDidMount(){
    this.loadData();
  }
  loadData(){
    this.languageDao.fetch()
        .then(result=>{
          this.setState({
            dataArray:result
          })
        })
        .catch(error=>{
          console.log(error);
        })
  }
  onSave(){
    if(this.chanageValues.length === 0){
      this.props.navigator.pop();
      return;
    }
    if(this.isRemoveKey){
      for(let i in this.chanageValues){
        ArrayUtils.remove(this.state.dataArray,this.chanageValues[i]);
      }
    }
    this.languageDao.save(this.state.dataArray);
    this.props.navigator.pop();
  }
  onBack(){
    if(this.chanageValues.length === 0){
      this.props.navigator.pop();
      return;
    }
    Alert.alert(
  '提示',
  '保存修改吗？',
  [
    {text: '不保存', onPress: () => {this.props.navigator.pop();}, style: 'cancel'},
    {text: '保存', onPress: () => {this.onSave()}},
  ],
  { cancelable: false }
)
  }
  renderView(){
 if(!this.state.dataArray || this.state.dataArray.length===0)return null;
 let len=this.state.dataArray.length;
 let views=[];
 for(let i in this.state.dataArray){
   views.push(
     <View key={i} style={{width:"50%"}}>
          <View style={styles.item}>
              {this.renderCheckBox(this.state.dataArray[i])}
          </View>
          {i==(len-1)?null:<View style={styles.line}></View>}

     </View>
   )
 }
 return views;
  }
  onClick(data){
   if(!this.isRemoveKey)data.checked=!data.checked;
   ArrayUtils.updateArray(this.chanageValues,data);
  }
  renderCheckBox(data){
    let leftText = data.name;
    let isChecked = this.isRemoveKey?false:data.checked;
    return(
      <CheckBox
       style={{padding:10,flex:1}}
        onClick={()=>this.onClick(data)}
        leftText={leftText}
        isChecked={isChecked}
        unCheckedImage={<Image style={{tintColor:'#2196F3'}} source={require('./img/ic_check_box_outline_blank.png')}/>}
        CheckedImage={<Image style={{tintColor:'#2196F3'}} source={require('./img/ic_check_box.png')}/>}

      />
    )
  }
  render(){
    let title = this.isRemoveKey?'删除标签':'自定义标签页';
    let rightText = this.isRemoveKey?'删除':'保存';
    let rightButton=<TouchableOpacity
          onPress={()=>{this.onSave()}}
        >
         <View style={{margin:10}}>
              <Text style={styles.title}>{rightText}</Text>
         </View>
    </TouchableOpacity>
    return <View style={styles.container}>
    <NavigationBar
        title={title}
        leftButton={ViewUtils.getLeftButton(()=>{this.onBack()})}
        rightButton={rightButton}
    />
    <ScrollView>
    <View style={styles.flex}>
    {this.renderView()}
    </View>
    </ScrollView>
    </View>
  }
}
const styles = StyleSheet.create({
    container:{
      flex:1,
      backgroundColor:"#fff"
    },
    title:{
      fontSize:18,
      color:'#fff'
    },
    flex:{
      flexDirection:"row",
      flexWrap:"wrap"
    },
    line:{
      backgroundColor:'#f1f1f1',
      height:1

    },
    item:{
    justifyContent:'center',

    }
})
