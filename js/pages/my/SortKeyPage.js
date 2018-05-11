import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
  Alert,
  TouchableOpacity,
  DeviceEventEmitter
} from 'react-native';
import {ACTION_HOME,FLAG_TAB} from  '../HomePage'
import {Navigator} from 'react-native-deprecated-custom-components';
import NavigationBar from '../../common/NavigationBar'
import CustomKeyPage from './CustomKeyPage'
import ArrayUtils from '../../util/ArrayUtils';
import ViewUtils from '../../util/ViewUtils'
import SortableListView from 'react-native-sortable-listview';
import BackPressComponent from '../../common/BackPressComponent'
import LanguageDao,{FLAG_LANGUAGE} from "../../expand/dao/LanguageDao"
export default class SortKeyPage extends Component {
  constructor(Props){
    super(Props);
    this.backPress=new BackPressComponent({backPress:(e)=>this.onBackPress(e)});
    this.languageDao = new LanguageDao(this.props.flag);
    this.dataArray=[];
    this.sortResultArray=[];
    this.originalCheckedArray=[];
    this.state={
      checkedArray:[],
      theme:this.props.theme
    }
  }

  onBackPress(e){
    this.onBack();
    return true;
  }

  componentWillUnmount(){
    this.backPress.componentWillUnmount();
  }
  componentDidMount(){
    this.loadData();
    this.backPress.componentDidMount();
  }

  loadData(){
    this.languageDao.fetch()
        .then(result=>{
          this.getCheckedItems(result);
        })
        .catch(error=>{
          console.log(error);
        })
  }
  getCheckedItems(result){
    this.dataArray = result;
    let checkedArray = [];
    for(let i in result){
      if(result[i].checked){
        checkedArray.push(result[i])
      }
    }
    this.setState({
      checkedArray:checkedArray
    })
    this.originalCheckedArray = ArrayUtils.clone(checkedArray);

  }
 onBack(){

   if(ArrayUtils.isEqual(this.originalCheckedArray,this.state.checkedArray)){
     this.props.navigator.pop();
     return;
   }
   Alert.alert(
 '提示',
 '保存修改吗？',
 [
   {text: '不保存', onPress: () => {this.props.navigator.pop();}, style: 'cancel'},
   {text: '保存', onPress: () => {this.onSave(true)}},
 ],
 { cancelable: false }
)
 }
 onSave(isChecked){
   if(!isChecked&&ArrayUtils.isEqual(this.originalCheckedArray,this.state.checkedArray)){
     this.props.navigator.pop();
     return;
   }
   this.getSortResult();
   this.languageDao.save(this.sortResultArray);
   var jumpToTab=this.props.flag===FLAG_LANGUAGE.flag_key?FLAG_TAB.flag_popularTab:FLAG_TAB.flag_trendingTab;
   DeviceEventEmitter.emit('ACTION_HOME',ACTION_HOME.A_RESTART,jumpToTab);
   this.props.navigator.pop();
 }
 getSortResult(){
   this.sortResultArray = ArrayUtils.clone(this.dataArray);
   for(let i=0,l=this.originalCheckedArray.length;i<l;i++){
     let item = this.originalCheckedArray[i];
     let index = this.dataArray.indexOf(item);
     this.sortResultArray.splice(index,1,this.state.checkedArray[i]);
   }
 }
  render(){
    let order = Object.keys(this.state.checkedArray);
    let title = this.props.flag === FLAG_LANGUAGE.flag_language?'语言排序':'标签排序';
    let rightButton=<TouchableOpacity
          onPress={()=>{this.onSave()}}
        >
         <View style={{margin:10}}>
              <Text style={styles.title}>保存</Text>
         </View>
    </TouchableOpacity>
    return <View style={{flex:1,backgroundColor:'#fff'}}>
    <NavigationBar
        title={title}
        style={this.state.theme.styles.navBar}
        leftButton={ViewUtils.getLeftButton(()=>{this.onBack()})}
        rightButton={rightButton}
    />
    <SortableListView
        style={{flex:1}}
        data={this.state.checkedArray}
        order={order}
        onRowMoved={e => {
          this.state.checkedArray.splice(e.to, 0, this.state.checkedArray.splice(e.from, 1)[0]);
          this.forceUpdate()
        }}
        renderRow={row => <SortCell data={row} {...this.props}/>}
      />
    </View>
  }
}
class SortCell extends Component{
  render(){
    return  <TouchableHighlight
        underlayColor={'#eee'}
        style={{
          flex:1,
          padding: 20,
          backgroundColor: '#F8F8F8',
          borderBottomWidth: 1,
          borderColor: '#eee',
        }}
        {...this.props.sortHandlers}
      >
      <View style={styles.sortCell}>
        <Image
            source={require('./img/ic_sort.png')}
            tintColor={this.props.theme.themeColor}
         />
        <Text style={{marginLeft:20}}>{this.props.data.name}</Text>
      </View>
      </TouchableHighlight>

  }
}
const styles = StyleSheet.create({
  image:{
    tintColor:'#2196F3',
    height:16,
    width:16,
    marginRight:10
  },
  title:{
    fontSize:18,
    color:'#fff'
  },
  sortCell:{
    flexDirection:"row",
  }
})
