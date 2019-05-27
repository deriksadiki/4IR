import { Injectable, NgZone } from '@angular/core';
import { LoadingController } from "ionic-angular";
import { AlertController } from "ionic-angular";
declare var firebase
/*
  Generated class for the IRhubProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class IRhubProvider {

  //arrays
  orgArray = new Array();
  stayLoggedIn
  auth = firebase.auth();

  constructor(public ngzone: NgZone, public alertCtrl: AlertController,
    public loadingCtrl: LoadingController) {
    console.log('Hello IRhubProvider Provider');
  }

  SignIn(email, password) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }
  checkstate() {
    return new Promise((resolve, reject) => {
      this.ngzone.run(() => {
        firebase.auth().onAuthStateChanged((user) => {
          if (user != null) {
            this.stayLoggedIn = 1
          }
          else {
            this.stayLoggedIn = 0
          }
          resolve(this.stayLoggedIn)
        })
      })
    })
  }

  forgotpassword(email) {
    return new Promise((resolve, reject) => {
      this.ngzone.run(() => {
        if (email == null || email == undefined) {
          const alert = this.alertCtrl.create({
            subTitle: 'Please enter your Email.',
            buttons: ['OK']
          });
          alert.present();
        }
        else if (email != null || email != undefined) {
          firebase.auth().sendPasswordResetEmail(email).then(() => {
            const alert = this.alertCtrl.create({
              title: 'Password request Sent',
              subTitle: "We've sent you and email with a reset link, go to your email to recover your account.",
              buttons: ['OK']

            });
            alert.present();
            resolve()
          }, Error => {
            const alert = this.alertCtrl.create({
              subTitle: Error.message,
              buttons: ['OK']
            });
            alert.present();
            resolve()
          });
        }
      })
    }).catch((error) => {
      const alert = this.alertCtrl.create({
        subTitle: error.message,
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
    })
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
          firebase.database().ref("Users/" + "/" + "App_Users/" + user.uid).set({
            name: name,
            email: email,
            downloadurl: "../../assets/imgs/Defaults/default.png",
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
            // cssClass: 'myAlert',
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
        firebase.database().ref("4IR_Hubs").on("value", (data: any) => {
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

  getProfile() {
    return new Promise((accpt, rej) => {
      this.ngzone.run(() => {
        this.auth.onAuthStateChanged(function (user) {
          if (user) {
            firebase.database().ref("Users/" + "/" + "App_Users/" + user.uid).on('value', (data: any) => {
              let details = data.val();
              console.log(details)
              accpt(details.downloadurl)
            })
          } else {
            console.log('no user');
          }
        });
      })
    })
  }

  
  checkAuthState() {
    return new Promise((accpt, rej) => {
      this.ngzone.run(() => {
        this.auth.onAuthStateChanged(function (user) {
          if (user) {
            accpt(true)
          } else {
            accpt(false)
          }
        });
      })
    })
  }

  // AddViewers( key, id) {
  //   views = views + 1;
  //   console.log(views);
  //   console.log(key);
  //   console.log(id);

  //   return new Promise((accpt, rej) => {
  //     this.ngzone.run(() => {
  //       firebase
  //         .database()
  //         .ref("Organizations/")
  //         .update({ Views: views });
  //       accpt("View added");
  //     });
  //   });
  // }






}
