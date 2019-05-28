import { Component } from '@angular/core';
import { NavController, LoadingController, Loading,AlertController } from 'ionic-angular';
import { IRhubProvider } from '../../providers/i-rhub/i-rhub';
import { SignInPage } from '../sign-in/sign-in';
import { UserProfilePage } from '../user-profile/user-profile';
import { ViewOrganizationInforPage } from '../view-organization-infor/view-organization-infor';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  //arrays
  orgArray =  new Array();
  viewDetailsArray = new Array();
  img = "../../assets/imgs/Defaults/default.png";
  logInState;
  //variables
  loading;
  constructor(public navCtrl: NavController, public IRmethods: IRhubProvider, public loadingCtrl:LoadingController,public alertCtrl:AlertController) {
    this.IRmethods.getAllOrganizations().then((data:any) =>{
      this.orgArray = data;

      console.log(this.orgArray);
      // setTimeout(() => {
      //   this.loading.dismiss()
      // }, 2500);
    })

    this.IRmethods.checkAuthState().then(data => {
      if (data == true) {
        this.logInState = true;
        this.IRmethods.getProfile().then((data: any) => {
          console.log(this.logInState);

          this.img = data;
        })
      }
      else if (data == false) {
        this.img = "assets/imgs/default.png";
      }
    })
  }
  ionViewWillEnter(){
    // this.loading = this.loadingCtrl.create({
    //   spinner: "bubbles",
    //   content: "Please wait....",
    // });
    // this.loading.present();

    
  }

  Userprofile() {
    this.IRmethods.checkAuthState().then(data => {
      if (data == false) {
        let alert = this.alertCtrl.create({
          subTitle: 'You have to sign in before you can view your profile, would you like to sign in now?',
          // cssClass: 'myAlert',
          buttons: [
            {
              text: 'Sign in',
              handler: data => {
                var opt = "profile";
                this.navCtrl.push(SignInPage, { option: opt })
              }
            },
            {
              text: 'Cancel',
              handler: data => {

              }
            }
          ]
        });
        alert.present();
      } else {
        this.navCtrl.push(UserProfilePage)
      }

    })
  }

  goToViewPage(name) {
    for (var x = 0; x < this.orgArray.length; x++) {
      if (name == this.orgArray[x].orgName) {
        this.navCtrl.push(ViewOrganizationInforPage, { orgObject: this.orgArray[x] });
      }
    }
  }
  
}
