import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SignInPage } from '../sign-in/sign-in';
import { IRhubProvider } from '../../providers/i-rhub/i-rhub';
import { EditUserProfilePage } from '../edit-user-profile/edit-user-profile';
import { ViewOrganizationInforPage } from '../view-organization-infor/view-organization-infor';
// import { stat } from 'fs';
import { StartPage } from '../start/start';

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
  totrating = 0;
  ratings = new Array();
  popState = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams, public irhubProvider: IRhubProvider) {
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
      console.log(details);
      
    });

    this.irhubProvider.getTotalRatings().then((data:any) =>{
      this.ratings.length =0;
      this.totrating = this.irhubProvider.getTotRating();
      if (this.totrating == undefined || this.totrating == null){
        this.totrating = 0;
        this.ratings.length =0;
      }
      this.ratings = data;
      console.log(data)
    })


  }

  logOut() {
    this.bodyClick()
    this.irhubProvider.logout().then(() => {
      this.navCtrl.push(StartPage, { out: 'logout' });
    }, (error) => {
      console.log(error.message);
    })
  }
  GoToEditProfile() {
    this.navCtrl.push(EditUserProfilePage);
    this.bodyClick()
  }
  m = 0;

  togglePopover() {
    var popo = document.getElementById("popover")
    if (this.m == 0) {
      this.m = 1;
      popo.style.right = "0";
    }
    else {
      this.m = 0;
      popo.style.right = "-160px";
    }
  }
  removePopover() {
    this.m = 0;
    var popo = document.getElementById("popover")
    popo.style.right = "-160px";
  }
  viewMore(ind){
    this.navCtrl.push(ViewOrganizationInforPage, { orgObject:this.ratings[ind] });
  }

  
  showPopover(){
    this.popState =1
    console.log(this.popState);
    var thePop = document.getElementsByClassName("popover") as HTMLCollectionOf <HTMLElement>;
    let theState = this.popState;
    var setBtn = document.getElementsByClassName("settings") as HTMLCollectionOf <HTMLElement>;

    if (theState == 1){
      thePop[0].style.right = "0";
      setBtn[0].style.right = "-50px";
      thePop[0].style.zIndex = "10000000";
    }
    else{
      thePop[0].style.right = "-50%";
      setBtn[0].style.right = "10px";
    }
  }
  removePopper(){
    this.popState = 0;
    var setBtn = document.getElementsByClassName("settings") as HTMLCollectionOf <HTMLElement>;
    var thePop = document.getElementsByClassName("popover") as HTMLCollectionOf <HTMLElement>;
    let theState = this.popState;
    if (theState == 1){
      thePop[0].style.right = "0";
      thePop[0].style.opacity = "0";
      thePop[0].style.zIndex = "10000000";
      setBtn[0].style.right = "-50px";
    }
    else{
      thePop[0].style.right = "-50%";
      thePop[0].style.opacity = "1";
      thePop[0].style.zIndex = "-1000";
      setBtn[0].style.right = "-10px";
      
    }
    console.log(this.popState);
    
  }
  bodyClick(){
    this.removePopper()
  }

}
