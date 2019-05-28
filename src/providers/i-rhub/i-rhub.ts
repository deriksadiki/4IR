import { Injectable, NgZone } from '@angular/core';
import { LoadingController } from "ionic-angular";
import { AlertController } from "ionic-angular";
import { Geolocation } from '@ionic-native/geolocation';
import moment from 'moment';
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
  commentArr = new Array();
  stayLoggedIn;
  downloadurl;
  rating;
  nearByOrg = new Array();
  ratedOrgs = new Array();
  totRating;
  auth = firebase.auth();

  constructor(public ngzone: NgZone, public alertCtrl: AlertController,
    public loadingCtrl: LoadingController, private geo: Geolocation) {
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

  comments(comment: any, commentKey: any, rating) {
    let user = firebase.auth().currentUser;
    return new Promise((accpt, rejc) => {
      this.ngzone.run(() => {
        var day = moment().format('MMMM Do YYYY, h:mm:ss a');
        firebase.database().ref("Reviews/" + commentKey).push({
          comment: comment,
          uid: user.uid,
          date: day,
          rate: parseInt(rating)
        })
        accpt('success');
      });
    })
  }

  viewComments(comment: any, commentKey: any) {
    this.rating = 0;
    return new Promise((accpt, rejc) => {
      this.ngzone.run(() => {
        firebase.database().ref("Reviews/" + commentKey).on("value", (data: any) => {
          this.commentArr.length = 0;
          let user = firebase.auth().currentUser
          let CommentDetails = data.val();
          if (data.val() != null || data.val() != undefined) {
            let keys1: any = Object.keys(CommentDetails);
            for (var i = 0; i < keys1.length; i++) {
              let key = keys1[i];
              let chckId = CommentDetails[key].uid;
              let obj = {
                comment: CommentDetails[key].comment,
                rating: parseInt(CommentDetails[key].rate),
                uid: CommentDetails[key].uid,
                url: this.downloadurl,
                username: "",
                date: moment(CommentDetails[key].date, 'MMMM Do YYYY, h:mm:ss a').startOf('minutes').fromNow(),
                key: key,
              }
              if (user) {
                if (user.uid == CommentDetails[key].uid) {
                  this.assignRating(CommentDetails[key].rate)
                }
              }
              this.viewProfileMain(chckId).then((profileData: any) => {
                obj.url = profileData.downloadurl;
                obj.username = profileData.name;
                this.commentArr.push(obj);
                console.log(this.commentArr)
              });
            }
            accpt(this.commentArr);
            console.log(this.commentArr);

          }
          else {
            this.orgArray.length = 0;
            accpt('');
          }

        }, Error => {
          rejc(Error.message)
        })

      })
    })
  }

  assignRating(rating) {
    this.rating = rating;
  }

  getRating() {
    return this.rating;
  }

  viewProfileMain(userid: string) {
    let user = firebase.auth().currentUser;
    return new Promise((accpt, rejc) => {
      this.ngzone.run(() => {
        firebase.database().ref("Users/" + "/" + "App_Users/" + user.uid).on("value", (data: any) => {
          var a = data.val();
          accpt(a);
        }, Error => {
          rejc(Error.message)
        })
      })
    })
  }


  getTotRating() {
    return this.totRating;
  }
  assignTotRating(num) {
    this.totRating = num;
    console.log(num)
  }

  getTotalRatings() {
    this.ratedOrgs = [];
    return new Promise((accpt, rej) => {
      this.ngzone.run(() => {
        let userID = firebase.auth().currentUser;
        var numRating = 0;
        firebase.database.ref("comments/").on("value", (data: any) => {
          if (data.val() != null || data.val() != undefined) {
            let keys = Object.keys(data.val());
            for (var x = 0; x < keys.length; x++) {
              firebase.database.ref("comments/" + keys[x]).on("value", (data2: any) => {
                var values = data2.val();
                let inderKeys = Object.keys(values);
                for (var i = 0; i < inderKeys.length; i++) {
                  if (values[inderKeys[i]].uid == userID.uid) {
                    firebase.database.ref('Websiteprofiles/').on("value", (data3: any) => {
                      var xx = Object.keys(data3.val())
                      for (var p = 0; p < xx.length; p++) {
                        firebase.database.ref('Websiteprofiles/' + xx[p] + '/' + keys[x]).on("value", (data4: any) => {
                          if (data4.val() != undefined || data4.val() != null) {
                            console.log(data4.val());
                            if (data3.val() != null || data3.val() != undefined) {
                              var orgs = data3.val();
                              console.log(data3.val());
                              var gal1;
                              var gal2;
                              var gal3;
                              if (gal1 == undefined || gal1 == null) {
                                gal1 = "../../assets/imgs/Defaults/DP.jpg"
                              }
                              if (gal2 == undefined || gal2 == null) {
                                gal2 = "../../assets/imgs/Defaults/DP.jpg"
                              }
                              if (gal3 == undefined || gal3 == null) {
                                gal3 = "../../assets/imgs/Defaults/DP.jpg"
                              }

                            }
                            let organizationObject = {
                              orgCat: data4.val().category,
                              orgName: data4.val().OrganisationName,
                              orgContact: "0" + data4.val().Telephone,
                              orgPicture: data4.val().Url,
                              orgLat: data4.val().latitude,
                              orgLong: data4.val().longitude,
                              // orgEmail:data4.val().Email,
                              orgAbout: data4.val().desc,
                              rating: values[inderKeys[i]].rate,
                              key: keys[x],
                              comment: values[inderKeys[i]].comment,
                              // orgPrice: orgs.Price,
                              orgGallery: gal1,
                              orgGallery1: gal2,
                              orgGallery2: gal3,
                              view: data4.val().view,
                              orgId: xx[p],
                              city: data4.val().city,
                              orgLogo: data4.val().Logo,
                            }
                            console.log(organizationObject);

                            this.ratedOrgs.push(organizationObject)
                          }
                        })
                      }


                    })
                    numRating++;
                  }
                }
              })
            }
          }
          this.assignTotRating(numRating);
          accpt(this.ratedOrgs);
        })
      })
    })
  }



 

  




  




}
