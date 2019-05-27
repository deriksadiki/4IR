import { Injectable, NgZone } from '@angular/core';
import { LoadingController } from "ionic-angular";
import { AlertController } from "ionic-angular";
declare var firebase;
/*
  Generated class for the IRhubProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class IRhubProvider {

  //arrays
  orgArray = new Array();


  constructor(public ngzone: NgZone, public alertCtrl: AlertController,
    public loadingCtrl: LoadingController) {
    console.log('Hello IRhubProvider Provider');
  }

  SignIn(email, password) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }
  
  Signup(email, password, name) {
    return new Promise((resolve, reject) => {
      this.ngzone.run(() => {
        let loading = this.loadingCtrl.create({
          spinner: 'bubbles',
          content: 'Signing up...',
          duration: 4000000
        });
        loading.present();
        return firebase.auth().createUserWithEmailAndPassword(email, password).then((newUser) => {
          var user = firebase.auth().currentUser
          firebase.database().ref("profiles/" + user.uid).set({
            name: name,
            email: email,
            downloadurl: "../../assets/imgs/Defaults/default.jpg",
            address: "",
          })
          var user = firebase.auth().currentUser;
          user.sendEmailVerification().then(function () {
            // Email sent.
          }).catch(function (error) {
            // An error happened.
          });
          resolve();
          loading.dismiss();
        }).catch((error) => {
          loading.dismiss();
          const alert = this.alertCtrl.create({
            subTitle: error.message,
            cssClass: 'myAlert',
            buttons: [
              {
                text: 'ok',
                handler: data => {
                  console.log('Cancel clicked');
                }
              }
            ]
          });
          alert.present();
          console.log(error);
        })
      })
    })
  }
  checkVerification() {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged((user) => {
        console.log(user);
        if (user.emailVerified == false) {
          this.logout();
          resolve(0)
        }
        else {
          resolve(1)
        }
      })
    })
  }
  logout() {
    return new Promise((resolve, reject) => {
      this.ngzone.run(() => {
        firebase.auth().signOut();
        resolve()
      });
    })
  }

  getAllOrganizations() {
    return new Promise((resolve, reject) => {
      this.ngzone.run(() => {
        var user = firebase.auth().currentUser;
        firebase.database().ref("Organizations").on("value", (data: any) => {
          if (data.val() != null) {
            this.orgArray.length = 0;
            let details = data.val();
            let keys = Object.keys(details);
            for (var x = 0; x < keys.length; x++) {
              let orgObject = {
                orgName: details[keys[x]].name,
                email: details[keys[x]].email,
                region: details[keys[x]].region,
                cell: details[keys[x]].contact,
                long: details[keys[x]].long,
                lat: details[keys[x]].lat,
                img: details[keys[x]].downloadurl,
                category: details[keys[x]].category,
                id: keys[x]
              }
              this.orgArray.push(orgObject)
            }
            resolve(this.orgArray)
          }
        });
      })
    })
  }

}
