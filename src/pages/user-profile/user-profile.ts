import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SignInPage } from '../sign-in/sign-in';
import { IRhubProvider } from '../../providers/i-rhub/i-rhub';

declare var firebase
/**
 * Generated class for the UserProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {
  detailArray = new Array();
  constructor(public navCtrl: NavController, public navParams: NavParams,public irhubProvider:IRhubProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserProfilePage');
  }
  ionViewDidEnter() {
    this.detailArray.length = 0;
    console.log('ionViewDidLoad ProfilePage');
    let userID = firebase.auth().currentUser;
    firebase.database().ref("Users/" + "/" + "App_Users/" + userID.uid).on('value', (data: any) => {
      let details = data.val();
      this.detailArray.length = 0;
      console.log(details)
      this.detailArray.push(details);
    });


  }

  logOut(){
    this.irhubProvider.logout().then(() => {
      this.navCtrl.push(SignInPage, {out:'logout'});
    }, (error) => {
      console.log(error.message);
    })
  }

}
