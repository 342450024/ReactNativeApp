
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

      /*
        通多对比时间查看数据是否过期
      */
      static checkData(longTime){
        let cDate = new Date();
        let tDate = new Date();
        tDate.setTime(longTime);
        if(cDate.getMonth() !== tDate.getMonth())return false;
        if(cDate.getDay() !== tDate.getDay())return false;
        if(cDate.getHours() - tDate.getHours() > 4)return false;
        return true;
      }
}
