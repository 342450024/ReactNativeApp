package com.reactnativeapp;

import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;
// 引入文件
import com.reactnativeapp.invokenative.ShareModule;
import com.umeng.socialize.UMShareAPI;
import android.content.Intent;
import android.os.Bundle;
public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "ReactNativeApp";
    }

    //初始化代码
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this,true);//显示启动屏
   super.onCreate(savedInstanceState);
   ShareModule.initSocialSDK(this);
  }

  //回调所需代码
  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
   super.onActivityResult(requestCode, resultCode, data);
   UMShareAPI.get(this).onActivityResult(requestCode, resultCode, data);
  }




}
