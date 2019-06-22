import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { SignInPage } from '../pages/sign-in/sign-in';
import { IRhubProvider } from '../providers/i-rhub/i-rhub';
import { SignUpPage } from '../pages/sign-up/sign-up';
import { ViewOrganizationInforPage } from '../pages/view-organization-infor/view-organization-infor';
import { UserProfilePage } from '../pages/user-profile/user-profile';
import { StartPage } from '../pages/start/start';
import { timer } from 'rxjs/observable/timer';
import { OnboundingPage } from '../pages/onbounding/onbounding';
import { SqlProvider } from '../providers/sql/sql';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  showSplash = true; 

  constructor(public sql: SqlProvider,  platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,public IRhubProvider:IRhubProvider) {
    platform.ready().then(() => {

      
      IRhubProvider.checkstate().then((data: any) => {
        if (data == 1) {
          this.rootPage = HomePage
        }
        else {
          this.sql.GetAllFavourite().then((data:any) =>{
              if (data != "true"){
                this.rootPage = OnboundingPage
                this.sql.storefavourite("true")
              }
              else{
                this.rootPage = StartPage
              }
          })
        
        }
      })

      IRhubProvider.getUserLocation().then(()=>{
        console.log("prompt");
        
      })
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // statusBar.styleDefault();
      statusBar.styleLightContent();
      splashScreen.hide();

      timer(3000).subscribe(() => this.showSplash = false)
    });
  }
}

