import { Component } from '@angular/core';
import { NavController, LoadingController, Loading } from 'ionic-angular';
import { IRhubProvider } from '../../providers/i-rhub/i-rhub';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  //arrays
  orgArray =  new Array();

  //variables
  loading;
  constructor(public navCtrl: NavController, public IRmethods: IRhubProvider, public loadingCtrl:LoadingController) {
    this.IRmethods.getAllOrganizations().then((data:any) =>{
      this.orgArray = data;
      console.log(this.orgArray);
      setTimeout(() => {
        this.loading.dismiss()
      }, 2500);
    })
  }
  ionViewWillEnter(){
    this.loading = this.loadingCtrl.create({
      spinner: "bubbles",
      content: "Please wait....",
    });
    this.loading.present();
  }
}
