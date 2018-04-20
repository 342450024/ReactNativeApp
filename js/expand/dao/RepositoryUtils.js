import {AsyncStorage} from 'react-native'
import DataRepository,{FLAG_STORAGE} from './DataRepository'
import Utils from '../../util/utils'

export default class RepositoryUtils {
  constructor(aboutCommon) {
     this.aboutCommon = aboutCommon;
     this.dataRepository = new DataRepository(FLAG_STORAGE.flag_my);
     this.itemMap = new Map();
  }
  /**
   * 更新数据
   */
  updateData(k,v){
       this.itemMap.set(k,v);
       var arr = [];
       for(var value of this.itemMap.values()){
         arr.push(value);
       }
       this.aboutCommon.onNotifyDataChanged(arr);
  }

  /**
   * 获取指定url下的数据
   */
   fetchRepository(url){
        this.dataRepository.fetchRepository(url)
            .then(result=>{
              if(result){
                this.updateData(url,result);
                if(!Utils.checkData(result.update_date))
                  return this.dataRepository.fetchNetRepository(url);
              }
            }).then((item)=>{
              if(item){
                this.updateData(url,item);
              }
            }).catch(e=>{

            })
   }
   /**
    * 获取批量urls列表下的数据
    */
    fetchRepositories(urls){
         for(let i=0,l=urls.length;i<l;i++){
           var url = urls[i];
           this.fetchRepository(url);
         }
    }
}
