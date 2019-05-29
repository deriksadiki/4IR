import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,ToastController } from 'ionic-angular';
import { IRhubProvider } from '../../providers/i-rhub/i-rhub'
/**
 * Generated class for the EditUserProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-user-profile',
  templateUrl: 'edit-user-profile.html',
})
export class EditUserProfilePage implements OnInit{
  d = 1;
  uid;
  downloadurl;
  name;
  email;
  address;
  cell
  imageArr = new Array();
  constructor(public navCtrl: NavController, public navParams: NavParams,public irhubProvider:IRhubProvider,public alertCtrl:AlertController,public toastCtrl:ToastController) {
    this.retreivePics1()
  }

  ionViewDidLoad() {
    this.retreivePics1()
    console.log('ionViewDidLoad EditUserProfilePage');
  }

  ngOnInit() {
    this.irhubProvider.retrieveUserProfile().on('value', (data: any) => {
      let details = data.val();
      console.log(details)
      this.name = details.name;
      this.email = details.email;
      // this.address = details.address;;
      this.downloadurl = details.downloadurl;
      // this.tempImg = details.downloadurl;
  
    })
  }

  EditPrfile(){
    this.irhubProvider.uploadProfilePic(this.downloadurl, this.name).then(data => {
      console.log('added to db');
      this.irhubProvider.update(this.name, this.email, this.downloadurl,this.cell).then((data) => {
        this.imageArr.push(data);
      });
      console.log(this.imageArr);
      const toast = this.toastCtrl.create({
        message: 'Profile successfully updated!',
        duration: 3000
      });
      toast.present();

    },
      Error => {
        const alert = this.alertCtrl.create({
          subTitle: Error.message,
          buttons: ['OK']
        });
        alert.present();
      })
  }

  getUid1() {
    this.irhubProvider.getUserID().then(data => {
      this.uid = data
      console.log(this.uid);
    })
  }
  retreivePics1() {
    this.imageArr.length = 0;
    this.getUid1();
    this.irhubProvider.GetUserProfile().then(data => {
      var keys: any = Object.keys(data);
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        if (this.uid == data[k].uid) {
          let objt = {
            downloadurl: data[k].downloadurl
          }
          this.imageArr.push(objt);
        }
      }

    }, Error => {
      console.log(Error)
    });


  }
  UploadProfilePic(event:any){
    this.d = 1;

    let opts = document.getElementsByClassName('options') as HTMLCollectionOf<HTMLElement>;

    if (this.d == 1) {
      // opts[0].style.top = "10vh";
      if (event.target.files && event.target.files[0]) {
        let reader = new FileReader();

        if (event.target.files[0].size > 1500000) {
          let alert = this.alertCtrl.create({
            title: "Oh no!",
            subTitle: "your photo is too large, please choose a photo with 1.5MB or less.",
            buttons: ['OK']
          });
          alert.present();
        }
        else {
          reader.onload = (event: any) => {
            this.downloadurl = event.target.result;
          }
          reader.readAsDataURL(event.target.files[0]);
        }

      }

    }
  }


}
