import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EmailComposer } from '@ionic-native/email-composer'
import { CallNumber } from '@ionic-native/call-number';
/**
 * Generated class for the ViewOrganizationInforPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-organization-infor',
  templateUrl: 'view-organization-infor.html',
})
export class ViewOrganizationInforPage {
  orgArray = new Array();
  constructor(public navCtrl: NavController, public navParams: NavParams,private emailComposer: EmailComposer,private callNumber: CallNumber) {
    this.orgArray.push(this.navParams.get('orgObject'));
    console.log(this.navParams.get('orgObject'))
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewOrganizationInforPage');
  }
  
  call(cell) {
    console.log(cell);

    this.callNumber.callNumber(cell, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }
  email(emails) {
    let email = {
      to: emails,
      cc: [],
      bcc: [],
      attachment: [],
      subject: '',
      body: '',
      isHtml: false,
      app: 'Gmail'
    };
    // Send a text message using default options
    this.emailComposer.open(email);
  }


}
