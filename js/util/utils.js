
//检查该item是否被收藏过
export default class Utils{
      static checkFavorite(item,items){
      for(var i=0,len=items.length;i<len;i++){
        let id=item.id?item.id.toString():item.fullName;
         if(id === items[i]){
             return true;
         }
      }
      return false;
      }
}
