import {
  AsyncStorage
} from 'react-native';
const FAVORITE_KEY_PREFIX = 'favorite_';
export default class FavoriteDao{
  constructor(flag){
    this.flag = flag;
    this.favoriteKey = FAVORITE_KEY_PREFIX + flag;
  }
  //保存收藏的项目
   saveFavoriteItem(key,value,callBack){
     AsyncStorage.setItem(key,value,(error)=>{
       if(!error){
           this.updateFavoriteKeys(key,true);
       }
     })
   }
   /**
    * 更新 favorite key集合
      key
      isAdd true 添加，false 删除
    */
    updateFavoriteKeys(key,isAdd){
      AsyncStorage.getItem(this.favoriteKey,(error,result)=>{
        if(!error){
          var favoriteKeys=[];
          if(result){
            favoriteKeys = JSON.parse(result);
          }
          var index = favoriteKeys.indexOf(key);
          if(isAdd){
            if(index === -1)favoriteKeys.push(key);
          }else {
            if(index !== -1)favoriteKeys.splice(index,1);
          }
          AsyncStorage.setItem(this.favoriteKey,JSON.stringify(favoriteKeys));
        }
      })
    }
 //获取用户收藏列表
    getFavoriteKeys(){
      return new Promise((resolve,reject)=>{
        AsyncStorage.getItem(this.favoriteKey,(error,result)=>{
          if(!error){
            try{
               resolve(JSON.parse(result));
            }catch(e){
              reject(e);
            }
          }else{
            reject(error);
          }
        })
      })
    }
    /**
     * 取消收藏，移除已经收藏的项目
     */
    removeFavoriteItem(key){
      AsyncStorage.removeItem(key,(error)=>{
        if(!error){
          this.updateFavoriteKeys(key,false);
        }
      })
    }
    /**
     * 获取用户收藏的所有项目
     */
     getAllItems(){
       return new Promise((resolve,reject)=>{
         this.getFavoriteKeys().then(keys=>{
           var items = [];
           if(keys){
             AsyncStorage.multiGet(keys,(err,stores)=>{
               try{
                 stores.map((result,i,store)=>{
                   let value = store[i][1];
                   if(value) items.push(JSON.parse(value));
                 })
                 resolve(items);
               }catch(e){
                 reject(e);
               }
             })
           }else{
             resolve(items);
           }
         })
         .catch((e)=>{reject(e);})
       })
     }
}
