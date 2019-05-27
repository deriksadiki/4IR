import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { IRhubProvider } from '../../providers/i-rhub/i-rhub'
import { SignInPage } from '../sign-in/sign-in';
declare var firebase
/**
 * Generated class for the SignUpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {
  username:any;
  email;
  password
  constructor(public navCtrl: NavController, public navParams: NavParams,public irhubProvider:IRhubProvider,public alertCtrl :AlertController ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignUpPage');
  }

  SignUp(username,email,password) {
      this.irhubProvider.Signup(email,password,username).then(() => {
        const alert = this.alertCtrl.create({
          // title: "No Name",
          subTitle: "We have sent you a link on your email ,Please verify your email",
          // cssClass : 'myAlert',
          buttons: [
            {
              text: 'Ok',
              handler: () => {
             this.navCtrl.pop()
              }
            },
          ]
        });
        alert.present();

      }, (error) => {
        console.log(error.message);
      })
    
  }

}
