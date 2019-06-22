import { Injectable, NgZone } from '@angular/core';
import { LoadingController } from "ionic-angular";
import { AlertController } from "ionic-angular";
import moment from 'moment';
import { Geolocation } from '@ionic-native/geolocation';
// import { access } from 'fs';

declare var firebase;

declare var google;
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
  ProfileArr = new Array();
  downloadurl;
  rating;
  ratedOrgs = new Array();
  orgNames = new Array();
  categoryArray = new Array();
  url;
  totRating;
  auth = firebase.auth();
  nearByOrg;
  categoryArr;
  address;
  constructor(public ngzone: NgZone, public alertCtrl: AlertController,
    public loadingCtrl: LoadingController, public geo: Geolocation) {




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

  forgetPassword(email) {

    return new Promise((resolve, reject) => {
      firebase.auth().sendPasswordResetEmail(email).then(() => {
        resolve();
      }, (error) => {
        reject(error)
      })

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
          firebase.database().ref("Users/App_Users/" + user.uid).set({
            name: name,
            email: email,
            downloadurl: "../../assets/imgs/Defaults/default.jfif",
            cell: ""
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
            cssClass: 'myAlert',
            subTitle: error.message,
            buttons: [
              {
                text: 'ok',
                handler: data => {
                  // console.log('Cancel clicked');
                }
              }
            ]
          });
          alert.present();
          // console.log(error);
        })
      })
    })
  }
  checkVerification() {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged((user) => {
        // console.log(user);
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
          if (data.val() != null || data.val() != undefined) {
         
            this.orgArray.length = 0;
            this.orgNames.length = 0;
            var totRating = 0;
            var counter;
            var pay = 0;
            var wifi = 0;
            let details = data.val();
            let keys = Object.keys(details);
            for (var x = 0; x < keys.length; x++) {
              pay = 0;
              wifi = 0;
              totRating = 0;
              counter = 0;
              this.ratin = 0;
              this.ratings(keys[x])
                let orgObject = {
                  applied : details[keys[x]].applied ,
                  orgName: details[keys[x]].prograName,
                  applicationLink: details[keys[x]].applicationLink,
                  city: details[keys[x]].city,
                  closeApplicationDate: details[keys[x]].closeApplicationDate,
                  eligibleCreteria: details[keys[x]].eligibleCreteria,
                  email: details[keys[x]].email,
                  facebook: details[keys[x]].facebook,
                  fullDescription: details[keys[x]].fullDescription,
                  intro: details[keys[x]].intro,
                  lat: details[keys[x]].lat,
                  long: details[keys[x]].long,
                  id: keys[x],
                  objectives: details[keys[x]].objectives,
                  openApplicationDate: details[keys[x]].openApplicationDate,
                  additionalBenefits: details[keys[x]].additionalBenefits,
                  programBenefits: details[keys[x]].programBenefits,
                  programCategory: details[keys[x]].programCategory,
                  programCloseDate: details[keys[x]].programCloseDate,
                  programStartDate: details[keys[x]].programStartDate,
                  programType: details[keys[x]].programType,
                  programmeService: details[keys[x]].programmeService,
                  promPhone: details[keys[x]].promPhone,
                  targetAudience: details[keys[x]].targetAudience,
                  twitter: details[keys[x]].twitter,
                  img: details[keys[x]].downloadurl,
                  address: details[keys[x]].address,
                  logo: details[keys[x]].downloadurlLogo,
                  rating: this.getRate()
                }
                this.storeOrgNames(details[keys[x]].prograName, details[keys[x]].programCategory);
                this.orgArray.push(orgObject)      
            }
          
            resolve(this.orgArray)
          }
        });
      })
    })
  }


  ratings(key){
    var totRating = 0;
    var counter = 0
    firebase.database().ref("Reviews/" + key).on("value", (ratings: any) => {
      if (ratings.val() != null || ratings.val() != undefined) {
        // console.log(ratings.val());
        var ratns = ratings.val();
        var rKeys = Object.keys(ratns);
        for (var p = 0; p < rKeys.length; p++) {
          var rk = rKeys[p];
          totRating = totRating + ratns[rk].rate
          counter++;
        }
      }
      if (totRating != 0) {
        totRating = totRating / counter;
        totRating = Math.round(totRating)
        // console.log('1111111111111111111111111111111111111111'); 
        this.assignRatings(totRating);
      }
    })
  }

  ratin = 0;
  assignRatings(r){
    // console.log('222222222222222222222222222222222222222222222');
    // console.log(r);
    this.ratin = r;
  }

  getRate(){
    // console.log('3333333333333333333333333333333333333333333');
    return  this.ratin;
  }

updateApplied(key, num){
  num++;
  return firebase.database().ref("4IR_Hubs/"+ key).update({applied: num})
}

  storeOrgNames(name, cat) {
    this.orgNames.push(name);
    this.orgNames.push(cat);
    // console.log(this.orgNames);

  }

  getOrgNames() {
    // console.log('get names');
    return this.orgNames
  }

  getProfile() {
    return new Promise((accpt, rej) => {
      this.ngzone.run(() => {
        this.auth.onAuthStateChanged(function (user) {
          if (user) {
            firebase.database().ref("Users/" + "/" + "App_Users/" + user.uid).on('value', (data: any) => {
              let details = data.val();
              if (data.val() != null || data.val() != undefined) {
                // console.log(details)
                accpt(details.downloadurl)
              }
              else {
                details = null
              }

              // console.log(details.downloadurl)
            })
          } else {
            // console.log('no user');
          }
        });
      })
    })
  }


  getname(){
    return new Promise((accpt, rej) => {
    let user = firebase.auth().currentUser;
    firebase.database().ref("Users/" + "/" + "App_Users/" + user.uid).on('value', (data) => {
      var profileName = data.val();
      console.log(profileName)
      accpt(profileName)
    })

  })
  
  }
  galleryArray = new Array()
  getGallery(key) {
    return new Promise((accpt, rej) => {
      this.ngzone.run(() => {
        firebase.database().ref("Gallery/" + key).on('value', (data: any) => {
          if (data.val() != null) {
            this.galleryArray.length = 0;
            var pictures = data.val();
            var keys = Object.keys(pictures)
            for (var x = 0; x < keys.length; x++) {
              var k = keys[x];
              this.galleryArray.push(pictures[k].GalUrl)
            }
            accpt(this.galleryArray)
          }
          else {
            // console.log('no user');
          }
        })
      })
    })
  }

  retrieveUserProfile() {
    let userID = firebase.auth().currentUser;
    return firebase.database().ref("Users/" + "/" + "App_Users/" + userID.uid)
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
      });
    });
  }

  comments(comment: any, commentKey: any, rating, url, username) {
    let user = firebase.auth().currentUser;
    return new Promise((accpt, rejc) => {
      this.ngzone.run(() => {
        var day = moment().format('MMMM Do YYYY, h:mm:ss a');
        firebase.database().ref("Reviews/" + commentKey).push({
          comment: comment,
          uid: user.uid,
          date: day,
          url: url,
          username: username,
          rate: parseInt(rating)
        })
        accpt('success');
      });
    }).catch((error) => {
      // console.log(error)
    })
  }

  viewComments(comment: any, commentKey: any) {
    let tempArray = new Array();
    this.rating = 0;
    return new Promise((accpt, rejc) => {
      this.ngzone.run(() => {
        firebase.database().ref("Reviews/" + commentKey).on("value", (data: any) => {
          // this.commentArr.length = 0;
          this.commentsArray.length = 0;
          var obj;
          let user = firebase.auth().currentUser
          let CommentDetails = data.val();
          if (data.val() != null || data.val() != undefined) {
            let keys1: any = Object.keys(CommentDetails);
            for (var i = 0; i < keys1.length; i++) {
              let key = keys1[i];
              let chckId = CommentDetails[key].uid;
              obj = {
                comment: CommentDetails[key].comment,
                uid: CommentDetails[key].uid,
                url: CommentDetails[key].url,
                rating: parseInt(CommentDetails[key].rate),
                username: CommentDetails[key].username,
                date: moment(CommentDetails[key].date, 'MMMM Do YYYY, h:mm:ss a').startOf('minutes').fromNow(),
                key: key,
              }

              if (user) {
                if (user.uid == CommentDetails[key].uid) {
                  this.assignRating(CommentDetails[key].rate)
                }
              }
              this.setComments(obj);
              // console.log(obj)
              // console.log("before");
              // tempArray[i] = obj;

              // console.log(tempArray)
              // console.log("after");
              // console.log(tempArray)
              accpt('');

            }
          }
          else {
            rejc('')
          }

        }, Error => {
          rejc(Error.message)
        })

      })
    })
  }

  commentsArray = new Array();
  setComments(obj) {
    this.commentsArray.push(obj);
    // console.log(this.commentsArray);

  }

  getAllComments() {
    return new Promise((accpt, rejc) => {
      // console.log(this.commentsArray);

      accpt(this.commentsArray)
    })
  }


  assignRating(rating) {
    this.rating = rating;
  }

  getRating() {
    return this.rating;
  }

  viewUserProfile(userid: string) {
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
    // console.log(num)
  }

  getTotalRatings() {
    this.ratedOrgs = [];
    return new Promise((accpt, rej) => {
      this.ngzone.run(() => {
        let userID = firebase.auth().currentUser;
        var numRating = 0;
        firebase.database().ref("Reviews/").on("value", (data: any) => {
          this.ratedOrgs = [];
          if (data.val() != null || data.val() != undefined) {
            let details = data.val();
            // console.log(details)
            // console.log(data)
            let keys = Object.keys(data.val());
            for (var x = 0; x < keys.length; x++) {
              firebase.database().ref("Reviews/" + keys[x]).on("value", (data2: any) => {
                // console.log(keys[x])
                this.ratedOrgs = [];
                var values = data2.val();
                // console.log(values)

                let inderKeys = Object.keys(values);
                // console.log(inderKeys)
                for (var i = 0; i < inderKeys.length; i++) {

                  if (values[inderKeys[i]].uid == userID.uid) {
                    // console.log('in');

                    // console.log(values[inderKeys[i]].uid)
                    // console.log(userID.uid)
                    firebase.database().ref('4IR_Hubs/').on("value", (data3: any) => {
                      let deatils2 = data3.val();
                      // console.log(deatils2)
                      var xx = Object.keys(data3.val())
                      for (var p = 0; p < xx.length; p++) {
                        firebase.database().ref('4IR_Hubs/' + xx[p]).on("value", (data4: any) => {
                          // this.ratedOrgs = [];
                          if (data4.val() != undefined || data4.val() != null) {
                            // console.log(data4.val());
                            if (data3.val() != null || data3.val() != undefined) {
                              var orgs = data3.val();
                              // console.log(data3.val());
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
                              additionalBenefits: data4.val().additionalBenefits,
                              address: data4.val().address,
                              applicationLink: data4.val().applicationLink,
                              eligibleCreteria: data4.val().eligibleCreteria,
                              email: data4.val().email,
                              facebook: data4.val().facebook,
                              intro: data4.val().intro,
                              objectives: data4.val().objectives,
                              programmeService: data4.val().programmeService,
                              targetAudience: data4.val().targetAudience,
                              twitter: data4.val().twitter,
                              programCategory: data4.val().programCategory,
                              orgName: data4.val().prograName,
                              promPhone: "0" + data4.val().promPhone,
                              img: data4.val().downloadurl,
                              logo: data4.val().downloadurlLogo,
                              lat: data4.val().lat,
                              long: data4.val().long,
                              fullDescription: data4.val().fullDescription,
                              rating: values[inderKeys[i]].rate,
                              key: keys[x],
                              comment: values[inderKeys[i]].comment,

                              orgId: xx[p],
                              city: data4.val().region,
                            }
                            // console.log(organizationObject);

                            this.ratedOrgs.push(organizationObject)
                            // console.log(this.ratedOrgs)
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
          // console.log(this.ratedOrgs)
          accpt(this.ratedOrgs);

        })

      })
    })
  }

  uploadProfilePic(pic, name) {
    return new Promise((accpt, rejc) => {
      this.ngzone.run(() => {
        firebase.storage().ref(name).putString(pic, 'data_url').then(() => {
          accpt(name);
          // console.log(name);
        }, Error => {
          rejc(Error.message)
        })
      })
    })
  }

  storeToDB1(name) {
    return new Promise((accpt, rejc) => {
      this.ngzone.run(() => {
        this.ProfileArr.length = 0;
        var storageRef = firebase.storage().ref(name);
        storageRef.getDownloadURL().then(url => {
          // console.log(url)
          var userID = firebase.auth().currentUser;
          var link = url;
          firebase.database().ref("Users/" + "/" + "App_Users/" + userID.uid).update({
            downloadurl: link,
          });
          accpt('success');
        }, Error => {
          rejc(Error.message);
          // console.log(Error.message);
        });
      })
    })
  }

  getUserID() {
    return new Promise((accpt, rejc) => {
      this.ngzone.run(() => {
        var userID = firebase.auth().currentUser
        firebase.database().ref("Users/" + "/" + "App_Users/").on("value", (data: any) => {
          var profileDetails = data.val();
          if (profileDetails !== null) {
          }
          // console.log(profileDetails);
          accpt(userID.uid);
        }, Error => {
          rejc(Error.message)
        })
      })
    })
  }


  update(name, email, downloadurl, cell) {
    this.ProfileArr.length = 0;
    return new Promise((pass, fail) => {
      this.ngzone.run(() => {
        var userID = firebase.auth().currentUser
        firebase.database().ref("Users/" + "/" + "App_Users/" + userID.uid).update({
          name: name,
          email: email,
          downloadurl: downloadurl,
          cell: cell

        });
      })
    })
  }

  GetUserProfile() {
    return new Promise((accpt, rejc) => {
      this.ngzone.run(() => {
        let user = firebase.auth().currentUser
        firebase.database().ref("Users/" + "/" + "App_Users/").on("value", (data: any) => {
          let DisplayData = data.val();
          let keys = Object.keys(DisplayData);
          if (DisplayData !== null) {
          }
          for (var i = 0; i < keys.length; i++) {
            this.storeImgur(DisplayData[keys[i]].downloadurl);
            // console.log(DisplayData[keys[i]].downloadurl)
          }
          accpt(DisplayData);
        }, Error => {
          rejc(Error.message)
        })
      })
    })
  }

  storeImgur(url) {
    this.url = url;
    // console.log(this.url)
  }








  //user Location Method 

  getUserLocation() {
    return new Promise((resolve, reject) => {
      this.geo.getCurrentPosition().then((resp) => {
        resolve(resp)
      }).catch((error) => {
        resolve(null)
        // console.log('Error getting location', error);
      });
    })
  }

  //show direction on the map 

  calculateAndDisplayRoute(location, destination, directionsDisplay, directionsService) {
    directionsService.route({
      origin: location,
      destination: destination,
      travelMode: 'DRIVING',
        }, function (response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
        directionsDisplay.setOptions({ suppressMarkers: true });

      } else {
<<<<<<< HEAD
        // console.log(status);
        // console.log("not working");
=======
>>>>>>> 2fc67748cac4dd5192cd2f1fbe3e7ccb98e73ef1
      }
    });
  }

  //creating a  radius

  createPositionRadius(latitude, longitude) {
    var leftposition, rightposition, downposition, uposititon;
    return new Promise((accpt, rej) => {

      var downlat = new String(latitude);
      var latIndex = downlat.indexOf(".");
      var down = parseInt(downlat.substr(latIndex + 1, 2)) + 6;
      var down = parseInt(downlat.substr(latIndex + 1, 2)) + 12;
      if (down >= 100) {
        if (downlat.substr(0, 1) == "-") {
          var firstDigits = parseInt(downlat.substr(0, 3)) + 1;
        }
        else {
          var firstDigits = parseInt(downlat.substr(0, 2)) - 1;
        }
        var remainder = down - 100;
        if (remainder >= 10) {
          downposition = firstDigits + "." + remainder;
        }
        else {
          downposition = firstDigits + ".0" + remainder;
        }

      } else {
        if (downlat.substr(0, 1) == "-") {
          downposition = downlat.substr(0, 3) + "." + down;
        }
        else {
          downposition = downlat.substr(0, 2) + "." + down;
        }

      }

      //up  position
      var uplat = new String(latitude);
      var latIndex = uplat.indexOf(".");
      var up = parseInt(uplat.substr(latIndex + 1, 2)) - 6;
      var up = parseInt(uplat.substr(latIndex + 1, 2)) - 12;
      if (up <= 0) {
        if (uplat.substr(0, 1) == "-") {
          var firstDigits = parseInt(uplat.substr(0, 3)) + 1;
        }
        else {
          var firstDigits = parseInt(uplat.substr(0, 2)) - 1;
        }
        var remainder = down - 100;
        if (remainder >= 10) {
          uposititon = firstDigits + "." + remainder;
        }
        else {
          uposititon = firstDigits + ".0" + remainder;
        }
      } else {
        if (uplat.substr(0, 1) == "-") {
          uposititon = uplat.substr(0, 3) + "." + up;
        }
        else {
          uposititon = uplat.substr(0, 2) + "." + up;
        }

      }
      //left position
      var leftlat = new String(longitude);
      var longIndex = leftlat.indexOf(".");
      var left = parseInt(leftlat.substr(longIndex + 1, 2)) - 6;
      var left = parseInt(leftlat.substr(longIndex + 1, 2)) - 12;
      if (left >= 100) {
        if (leftlat.substr(0, 1) == "-") {
          var firstDigits = parseInt(leftlat.substr(0, 3)) - 1;
        } else {
          var firstDigits = parseInt(leftlat.substr(0, 2)) + 1;
        }
        var remainder = left - 100;
        leftposition = firstDigits + ".0" + remainder;
      } else {
        if (leftlat.substr(0, 1) == "-") {
          var firstDigits = parseInt(leftlat.substr(0, 3)) + 1;
        }
        else {
          var firstDigits = parseInt(leftlat.substr(0, 2)) - 1;
        }

        if (left == 0) {
          var remainder = 0;
        }
        else {
          var remainder = left - 12;
        }

        leftposition = firstDigits + ".0" + remainder;

      }
      //right position
      var rightlat = new String(longitude);
      var longIndex = rightlat.indexOf(".");
      var right = parseInt(rightlat.substr(longIndex + 1, 2)) + 6;
      var right = parseInt(rightlat.substr(longIndex + 1, 2)) + 12;
      if (right >= 100) {
        if (rightlat.substr(0, 1) == "-") {
          var firstDigits = parseInt(rightlat.substr(0, 3)) - 1;
        } else {
          var firstDigits = parseInt(rightlat.substr(0, 2)) + 1;
        }
        var remainder = right - 100;
        rightposition = firstDigits + ".0" + remainder;
      } else {
        rightposition = rightlat.substr(0, 2) + "." + right;
        if (left == 0) {
          var remainder = 0;
        }
        else {
          var remainder = left - 12;
        }

        rightposition = firstDigits + ".0" + remainder;
      }


      let radius = {
        left: leftposition,
        right: rightposition,
        up: uposititon,
        down: downposition
      }

      accpt(radius);

      // down  position


    })

  }

  //get current location

  getCurrentLocation(lat, lng) {

    return new Promise((accpt, rej) => {

      // console.log("provider outside getCurPos");
      this.createPositionRadius(lat, lng).then((data: any) => {
        accpt(data);
      })
    })

  }

  getCurrentLocations() {
    //get current location
    return new Promise((accpt, rej) => {

      this.geo.getCurrentPosition().then((resp) => {
        // console.log(resp);
        accpt(resp);
      }).catch((error) => {
        rej('')
        // console.log('Error getting location', error.message);

      });
    })


  }

  getNearByOrganizations(radius, org) {
    return new Promise((accpt, rej) => {

      this.nearByOrg = []
      this.getCurrentLocations().then((resp: any) => {
        // console.log(resp);

        var lat = new String(resp.coords.latitude).substr(0, 6);
        // console.log(lat);
        // console.log(resp.coords.latitude)
        var long = new String(resp.coords.longitude).substr(0, 5);
        // console.log(long);
        // console.log(resp.coords.longitude);
        for (var x = 0; x < org.length; x++) {
          var orglat = new String(org[x].lat).substr(0, 6);
          var orgLong = new String(org[x].long).substr(0, 5);




          if ((orgLong <= long && orgLong >= radius.left || orgLong >= long && orgLong <= radius.right) && (orglat >= lat && orglat <= radius.down || orglat <= lat && orglat >= radius.up)) {
            // console.log("In nearby");

            this.nearByOrg.push(org[x]);
            // console.log(this.nearByOrg);
            accpt(this.nearByOrg)

          } else {
            // console.log("kb");

          }
        }

      })


    })
  }

  DisplayCategory(Category) {
    return new Promise((accpt, rej) => {
      this.categoryArr.length = 0;
      firebase.database().ref('4IR_Hubs').on('value', (data) => {
        if (data.val() != undefined || data.val() != null) {
          this.ngzone.run(() => {
            this.categoryArr.length = 0;
            let SelectCategory = data.val();
            let keys = Object.keys(SelectCategory);
            for (var i = 0; i < keys.length; i++) {
              let k = keys[i];
              firebase.database().ref('Reviews/' + k).on('value', (data2) => {
                let totalRating = 0;
                let avg = 0;
                if (data2.val() != null || data2.val() != undefined) {
                  let ratings = data2.val();
                  let ratingsKeys = Object.keys(ratings);
                  for (var x = 0; x < ratingsKeys.length; x++) {
                    totalRating = totalRating + ratings[ratingsKeys[x]].rate
                    avg++;
                  }
                  if (totalRating != 0)
                    totalRating = totalRating / avg;
                  totalRating = Math.round(totalRating)
                }
                firebase.database().ref('4IR_Hubs/' + k).on('value', (data2) => {
                  var branch = data2.val();
                  var bKeys = Object.keys(branch)
                  for (var p = 0; p < bKeys.length; p++) {
                    var x = bKeys[p]
                    if (branch[x].category == Category) {

                      let obj = {
                        orgCat: branch[x].category,
                        orgName: branch[x].name,
                        orgContact: branch[x].Telephone,
                        orgPicture: branch[x].downloadurl,
                        orgLat: branch[x].lat,
                        orgLong: branch[x].long,
                        orgEmail: branch[x].Email,
                        orgAbout: branch[x].desc,
                        key: x,
                        rating: totalRating,
                        city: branch[x].region,
                        views: branch[x].views
                      }
                      this.categoryArr.push(obj);
                    }
                  }
                })
              })
            }
            // console.log(this.categoryArr)
            accpt(this.categoryArr);
          })
        }
      })
    })
  }


  getLocation(lat, lng) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        var geocoder = new google.maps.Geocoder;
        var latlng = { lat: parseFloat(lat), lng: parseFloat(lng) };
        geocoder.geocode({ 'location': latlng }, function (results, status) {
          var address = results[0].address_components[3].short_name;
          // console.log(address);
          // console.log(results[0]);
          resolve(address)
        }, 4000);

      })


    })
  }
}
