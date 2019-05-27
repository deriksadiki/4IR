import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController ,LoadingController } from 'ionic-angular';
import { SignUpPage } from '../sign-up/sign-up';
import { HomePage } from '../home/home';
import { IRhubProvider } from '../../providers/i-rhub/i-rhub'

/**
 * Generated class for the SignInPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sign-in',
  templateUrl: 'sign-in.html',
})
export class SignInPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController,public loadingCtrl:LoadingController,public irhubProvider:IRhubProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignInPage');
  }
  GoToSignUp(){
    this.navCtrl.push(SignUpPage)
  }
  GoToHome(){
    this.navCtrl.push(HomePage)
  }
  SignIn(email: string, password: string) {
    console.log(email, password)
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Signing in...',
      duration: 40000
    });
    loading.present();
    this.irhubProvider.SignIn(email, password).then((user: any) => {
      // console.log(user);
      this.irhubProvider.checkVerification().then((data: any) => {
        if (data == 0) {
          const alert = this.alertCtrl.create({
            // title: "No Password",
            subTitle: "We have sent you a verification mail, Please activate your account with the link in the mail",
            buttons: ['OK'],
            cssClass: 'myAlert',
          });
          loading.dismiss()
          alert.present();
        }
        else if (data == 1) {
          loading.dismiss()
          this.navCtrl.setRoot(HomePage);
        }
      })
    }).catch((error) => {
      const alert = this.alertCtrl.create({
        // title: "No Password",
        subTitle: error.message,
        buttons: ['OK'],
        cssClass: 'myAlert',
      });
      loading.dismiss()
      alert.present();
    })
  }

}
