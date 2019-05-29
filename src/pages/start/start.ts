import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { SignInPage } from '../sign-in/sign-in';
import { SignUpPage } from '../sign-up/sign-up';

/**
 * Generated class for the StartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-start',
  templateUrl: 'start.html',
})
export class StartPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StartPage');
  }

  exploreApp(){
    this.navCtrl.push(HomePage)
  }
  signIn(){

    this.navCtrl.push(SignInPage)
  }
  signUp(){
    this.navCtrl.push(SignUpPage)

  }
}
