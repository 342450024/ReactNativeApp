import {
  AsyncStorage
} from 'react-native';
export default class DataRepository{
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
         fetch(url)
              .then(response=>response.json())
              .then(result=>{
                if(!result){
                  reject(new Error('responseData is null'));
                  return;
                }
                resolve(result.items);
                this.saveRepository(url,result.items)
              })
              .catch(error=>{
                reject(error);
              })
    })
  }
  /*
    保存数据
  */
  saveRepository(url,items,callBack){
    if(!url||!items)return;
     let wrapData = {items:items,update_date:new Date().getTime()};
     AsyncStorage.setItem(url,JSON.stringify(wrapData),callBack);
  }
  /*
    通多对比时间查看数据是否过期
  */
  checkData(longTime){
    let cDate = new Date();
    let tDate = new Date();
    tDate.setTime(longTime);
    if(cDate.getMonth() !== tDate.getMonth())return false;
    if(cDate.getDay() !== tDate.getDay())return false;
    if(cDate.getHours() - tDate.getHours() > 4)return false;
    return true;
  }
}
