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
  orgNames =  new Array();
  viewDetailsArray = new Array();
  img = "../../assets/imgs/Defaults/default.png";
  logInState;

  //variables
  loading;
  items;
  constructor(public navCtrl: NavController, public IRmethods: IRhubProvider, public loadingCtrl:LoadingController,public alertCtrl:AlertController) {
    this.IRmethods.getAllOrganizations().then((data:any) =>{
      this.orgArray = data;
      console.log(this.orgArray);
      setTimeout(() => {
        var names = this.IRmethods.getOrgNames()
        this.storeOrgNames(names)
        this.loading.dismiss()
      }, 2500);
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

  storeOrgNames(names){
    this.orgNames = names;
    console.log(this.orgNames);
    
  }

  initializeItems() {
    this.items = this.orgNames
  }

 getItems(ev) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the ev target
    var val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
    else if (val == "" ||val == null) {
      this.items = [];
    }
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
