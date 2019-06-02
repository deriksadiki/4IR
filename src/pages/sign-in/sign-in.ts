import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController ,LoadingController } from 'ionic-angular';
import { SignUpPage } from '../sign-up/sign-up';
import { PlaceObject } from '../../app/class';
import { HomePage } from '../home/home';
import { IRhubProvider } from '../../providers/i-rhub/i-rhub';
declare var firebase;
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
  email;
  PlaceObject = {} as object;
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
            cssClass: "myAlert",
            // title: "No Password",
            subTitle: "We have sent you a verification mail, Please activate your account with the link in the mail",
            buttons: ['OK'],
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
        cssClass: "myAlert",
        // title: "No Password",
        subTitle: error.message,
        buttons: ['OK'],
        // cssClass: 'myAlert',
      });
      loading.dismiss()
      alert.present();
    })
  }

  forgotpassword(PlaceObject: object) {
    return new Promise((resolve, reject) => {
      if (this.email == null || this.email == undefined) {
        const alert = this.alertCtrl.create({
          cssClass: "myAlert",
          title: 'Forgot your password?',
          message: "We just need your registered email address to reset your password.",
          
          // cssClass: 'myAlert',
          inputs: [
            {
              name: 'email',
              placeholder: 'Your email address'
            },
          ],
          buttons: [
            {
              text: 'Cancel',
              handler: data => {
                console.log('Cancel clicked');
              }
            },
            {
              text: 'Send',
              handler: data => {
                console.log('Saved clicked');

                this.irhubProvider.forgetPassword(data.email).then(()=>{
                  console.log("forgot password works");
                  const alert = this.alertCtrl.create({
                    title: 'Confirmation',
                    subTitle: "Please check your email to reset your password",
                    buttons: ['OK']
                  });
                  alert.present();
                })
              }
            }
          ],
        });
        alert.present();
      }
      else if (this.email != null || this.email != undefined) {
        firebase.auth().sendPasswordResetEmail(this.email).then(() => {
          const alert = this.alertCtrl.create({
            cssClass: "myAlert",
            title: 'Password request Sent',
            subTitle: "We've sent you and email with a reset link, go to your email to recover your account.",
            buttons: ['OK'],

          });
          alert.present();
          resolve()
        }, Error => {
          const alert = this.alertCtrl.create({
            cssClass: "myAlert",
            subTitle: Error.message,
            buttons: ['OK'],
            // cssClass: 'myAlert'
          });
          alert.present();
          resolve()
        });
      }
    }).catch((error) => {
      const alert = this.alertCtrl.create({
        cssClass: "myAlert",
        subTitle: error.message,
        buttons: [
          {
            text: 'ok',
            handler: data => {
              console.log('Cancel clicked');
            }
          }
        ],
      });
      alert.present();
    })
  }

}
