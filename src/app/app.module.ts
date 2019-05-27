import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { IRhubProvider } from '../providers/i-rhub/i-rhub';
import { SignInPage } from '../pages/sign-in/sign-in';
import { SignUpPage } from '../pages/sign-up/sign-up';
import { EmailComposer } from '@ionic-native/email-composer'
import { CallNumber } from '@ionic-native/call-number';
import { SplashScreenPage } from '../pages/splash-screen/splash-screen';
import { UserProfilePage } from '../pages/user-profile/user-profile';
import { ViewOrganizationInforPage } from '../pages/view-organization-infor/view-organization-infor';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SignInPage,
    SignUpPage,
    SplashScreenPage,
    UserProfilePage,
    ViewOrganizationInforPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SignInPage,
    SignUpPage,
    SplashScreenPage,
    UserProfilePage,
    ViewOrganizationInforPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    IRhubProvider,
    EmailComposer,
    CallNumber
  ]
})
export class AppModule {}
