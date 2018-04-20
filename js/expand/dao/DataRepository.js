import {
  AsyncStorage
} from 'react-native';
import GitHubTrending from 'GitHubTrending';
//标识区分两个模块
export var FLAG_STORAGE = {flag_popular:'popular',flag_trending:'trending',flag_my:'my'};
export default class DataRepository{
  constructor(flag){
    this.flag = flag;
    if(flag === FLAG_STORAGE.flag_trending)this.trending=new GitHubTrending();
  }

  fetchRepository(url){
     return new Promise((resolve,reject)=>{
       //获取本地的数据
       this.fetchLocalRepository(url)
           .then(result=>{
             if(result){
               resolve(result);
             }else{
               //若本地数据为空，获取网上数据
               this.fetchNetRepository(url)
                    .then(result=>{
                      resolve(result);
                    })
                    .catch(e=>{
                      reject(e);
                    })
             }
           })
           .catch(e=>{
             //获取本地的数据异常，获取网上数据
             this.fetchNetRepository(url)
                  .then(result=>{
                    resolve(result);
                  })
                  .catch(e=>{
                    reject(e);
                  })
           })


     })
  }

  /*
    获取本地数据
  */
  fetchLocalRepository(url){
    return new Promise((resolve,reject)=>{
      AsyncStorage.getItem(url,(error,result)=>{
          if(!error){
            try{
              resolve(JSON.parse(result));
            }catch(e){
              reject(e);
            }
          }else {
            reject(error);
          }
      })
    })
  }




  /*
    获取网络数据
  */

  fetchNetRepository(url){
    return new Promise((resolve,reject)=>{
         if(this.flag !== FLAG_STORAGE.flag_trending){
           //popular模块
           fetch(url)
                .then(response=>response.json())
                .then((responseData)=>{
                  if(this.flag === FLAG_STORAGE.flag_my&&responseData){
                    resolve(responseData);
                    this.saveRepository(url,responseData)
                  }else if(responseData&&responseData.items){
                    resolve(responseData.items);
                    this.saveRepository(url,responseData.items)
                  }else{
                    reject(new Error('responseData is null'));
                  }

                })
                .catch(error=>{
                  reject(error);
                })
         }else {
           this.trending.fetchTrending(url)
               .then(result=>{
                 if(!result){
                   reject(new Error('responseData is null'));
                   return;
                 }
                 this.saveRepository(url,result);
                 resolve(result);
               })

         }
    })
  }
  /*
    保存数据
  */
  saveRepository(url,items,callBack){
    if(!url||!items)return;
    let wrapData;
    if(this.flag === FLAG_STORAGE.flag_my){
      wrapData = {item:items,update_date:new Date().getTime()};
    }else{
      wrapData = {items:items,update_date:new Date().getTime()};
    }
     AsyncStorage.setItem(url,JSON.stringify(wrapData),callBack);
  }

}
