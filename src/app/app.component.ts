import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { SignInPage } from '../pages/sign-in/sign-in';
import { IRhubProvider } from '../providers/i-rhub/i-rhub';
import { SignUpPage } from '../pages/sign-up/sign-up';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,public IRhubProvider:IRhubProvider) {
    platform.ready().then(() => {

      
      IRhubProvider.checkstate().then((data: any) => {
        if (data == 1) {
          this.rootPage = HomePage
        }
        else {
          this.rootPage = SignInPage
        }
      })
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

