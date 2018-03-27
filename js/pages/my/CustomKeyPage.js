import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import {Navigator} from 'react-native-deprecated-custom-components';
import NavigationBar from '../../common/NavigationBar'
import ViewUtils from '../../util/ViewUtils'
import LanguageDao,{FLAG_LANGUAGE} from "../../expand/dao/LanguageDao"
export default class CustomKeyPage extends Component {
  constructor(props){
     super(props);
     this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
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
    this.props.navigator.pop();
  }
  render(){
    let rightButton=<TouchableOpacity
          onPress={()=>{this.onSave}}
        >
         <View style={{margin:10}}>
              <Text style={styles.title}>保存</Text>
         </View>
    </TouchableOpacity>
    return <View style={styles.container}>
    <NavigationBar
        title={'自动以标签页'}
        leftButton={ViewUtils.getLeftButton(()=>{this.onSave()})}
        rightButton={rightButton}
    />
    <ScrollView>
    <Text style={{fontSize:20}}>{JSON.stringify(this.state.dataArray)}</Text>


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
    }
})
