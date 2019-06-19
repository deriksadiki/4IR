import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StartPage } from '../start/start';

/**
 * Generated class for the OnboundingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-onbounding',
  templateUrl: 'onbounding.html',
})
export class OnboundingPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OnboundingPage');
  }
  goToStartPage(){
    this.navCtrl.push(StartPage)
  }

}
