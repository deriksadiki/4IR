import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { IRhubProvider } from '../providers/i-rhub/i-rhub';
import { SignInPage} from '../pages/sign-in/sign-in' ;
import {SignUpPage} from '../pages/sign-up/sign-up' ;
import { Geolocation } from '@ionic-native/geolocation';
import { CallNumber } from '@ionic-native/call-number';
import { SplashScreenPage } from '../pages/splash-screen/splash-screen';
import { UserProfilePage } from '../pages/user-profile/user-profile';
import { ViewOrganizationInforPage } from '../pages/view-organization-infor/view-organization-infor';
import { EditUserProfilePage } from '../pages/edit-user-profile/edit-user-profile';
import { EmailComposer } from '@ionic-native/email-composer';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { StartPage } from '../pages/start/start';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { GetDirectionModalPage } from '../pages/get-direction-modal/get-direction-modal';
import { OnboundingPage } from '../pages/onbounding/onbounding';
import { SqlProvider } from '../providers/sql/sql';
import { SQLite } from '@ionic-native/sqlite';



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SignInPage,
    SignUpPage,
    SplashScreenPage,
    UserProfilePage,
    ViewOrganizationInforPage,
    EditUserProfilePage,
    StartPage,
    GetDirectionModalPage,
    OnboundingPage

  
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicImageViewerModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SignInPage,
    SignUpPage,
    SplashScreenPage,
    UserProfilePage,
    ViewOrganizationInforPage,
    EditUserProfilePage,
    StartPage,
    GetDirectionModalPage,
    OnboundingPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    IRhubProvider,Geolocation ,
    EmailComposer,
    CallNumber , LaunchNavigator,
    SqlProvider,
    SQLite
  ]
})
export class AppModule {}
