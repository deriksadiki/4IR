import { Component, ViewChild, ElementRef, OnInit } from '@angular/core'
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { EmailComposer } from '@ionic-native/email-composer'
import { CallNumber } from '@ionic-native/call-number';
import { IRhubProvider } from '../../providers/i-rhub/i-rhub'
import { SignInPage } from '../sign-in/sign-in';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { LoadingController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { GetDirectionModalPage } from '../get-direction-modal/get-direction-modal';

declare var google;
declare var firebase
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
export class ViewOrganizationInforPage implements OnInit {
  @ViewChild('map') mapRef: ElementRef;
  @ViewChild('destmap') mapRef2: ElementRef;

  orgArray = new Array();
  commentArr = new Array();
  detailArray = new Array();
  comments;

  showBtn: boolean = true;
  imageKey;
  map;
  marker;
  state = ["star-outline", "star-outline", "star-outline", "star-outline", "star-outline"]
  Star1 = "star-outline";
  Star2 = "star-outline";
  Star3 = "star-outline";
  Star4 = "star-outline";
  Star5 = "star-outline";
  icon = 'assets/imgs/loaction3.png'
  locIcon = 'assets/imgs/loc-user.svg'

  rateState: boolean;
  destlat;
  destlong;
  currentUserlat;
  currentUserlng;
  destMaker;
  showtime;
  showDistance;
  showMap: boolean = false;
  showContent: boolean = true;
  //Google services
  directionsService;
  directionsDisplay;
  service;
  geocoder;
  username;
  url;
  tabs;
  services;
  wifiRange1;
  website;
  image
  logopic
  address;
  loginState = this.navParams.get('loginState')
  currentLocState = false;
  hideMe;
  theTabs = "services";
  galleryArray = new Array();
  showandHideStars: boolean;
  theReader = "read more...";
  pet="programdetails";
  category;
  constructor(public navCtrl: NavController, public navParams: NavParams, private emailComposer: EmailComposer, private callNumber: CallNumber, public irhubProvider: IRhubProvider, public alertCtrl: AlertController, private launchNavigator: LaunchNavigator, public loadingCtrl: LoadingController, public modalCtrl: ModalController) {

    // 
    // this.pet = "programdetails"
    this.orgArray.push(this.navParams.get('orgObject'));
    console.log(this.orgArray);
    this.irhubProvider.getGallery(this.orgArray[0].id).then((data: any) => {
      this.galleryArray = data;
      console.log(this.galleryArray);

    })
    console.log(this.navParams.get('orgObject'))
    this.imageKey = this.orgArray[0].id;
    this.wifiRange1 = this.orgArray[0].wifiRange;
    this.image = this.orgArray[0].img
    this.logopic = this.orgArray[0].logo

    this.address = this.orgArray[0].address
    // console.log(this.logopic);

    this.website = this.orgArray[0].website
    // console.log(this.image)

    // console.log(this.image)
    this.services = this.orgArray[0].programmeService
    console.log(this.services)

    console.log(this.services)
    // console.log(this.imageKey);
    console.log(this.orgArray);


    console.log(this.orgArray[0].lat);
    this.category = this.orgArray[0].programCategory
    this.destlat = this.orgArray[0].lat
    this.destlong = this.orgArray[0].long

    // this.destinationMap()
    //this.initMap()
    if (this.loginState) {
      let userID = firebase.auth().currentUser;

      firebase.database().ref("Users/" + "/" + "App_Users/" + userID.uid).on('value', (data: any) => {
        let details = data.val();
        this.detailArray.length = 0;
        console.log(details)
        this.detailArray.push(details);
        console.log(this.detailArray);
        this.hideMe = true

        this.username = this.detailArray[0].name;
        this.url = this.detailArray[0].downloadurl

        console.log(this.username)
        console.log(userID.uid)



      });
    }
    console.log(this.loginState);


    // if(!this.loginState){

    //   this.hideMe = false;
    // }



  }



  ionViewWillEnter() {
    this.retrieveComments();
    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer;
    this.service = new google.maps.DistanceMatrixService();
    this.geocoder = new google.maps.Geocoder;

    this.irhubProvider.getUserLocation().then((data: any) => {
      if (data != null) {
        this.currentLocState = true;
        console.log(data);
        console.log(data.coords.latitude);
        console.log(data.coords.longitude);
        this.currentUserlat = data.coords.latitude;
        this.currentUserlng = data.coords.longitude;
      }
    })
  }


  getLocation() {
    this.irhubProvider.getUserLocation().then((data: any) => {
      if (data != null) {
        this.currentLocState = true;
        console.log(data);
        console.log(data.coords.latitude);
        console.log(data.coords.longitude);

        this.currentUserlat = data.coords.latitude;
        this.currentUserlng = data.coords.longitude

      }
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewOrganizationInforPage');


  }
  apply() {
    this.irhubProvider.updateApplied(this.orgArray[0].id, this.orgArray[0].applied);
  }
  ngOnInit() {

  
    console.log("testmap");



  }
  showFab: boolean;
  retrieveComments() {
    this.commentArr = [];
    this.irhubProvider.viewComments(this.comments, this.imageKey).then((data: any) => {
      this.commentArr.length = 0;
      this.irhubProvider.getAllComments().then((data2: any) => {
        this.commentArr = data2;
        console.log(this.commentArr)
        this.commentArr.reverse();
        let rating = this.irhubProvider.getRating();
        console.log(rating);

        if (rating > 0) {
          this.rate(rating);
          this.rateState = true;
          this.showFab = false
          console.log(this.showFab);
          console.log(this.rateState);


        }
        else if (rating == undefined || rating == 0) {
          this.rateState = false
          this.showFab = true;
        }

      })


    }, Error => {
      this.showFab = true;
      console.log(this.showFab);
    })

  }

  comment(num) {
    this.commentArr = [];
    this.irhubProvider.checkAuthState().then(data => {
      if (data == true) {
        console.log(data);
        if (this.rateState == false || this.rateState == undefined) {
          const prompt = this.alertCtrl.create({
            cssClass: "myAlert",
            // title: 'Comment',
            message: "Pleave leave your comment below",
            inputs: [
              {
                name: 'comments',
                placeholder: 'comments'
              },
            ],
            buttons: [
              {
                text: 'Cancel',
                handler: data => {
                  console.log('Cancel clicked');
                }
              },
              {
                text: 'Comment',
                handler: data => {
                  console.log('Saved clicked' + data.comments);
                  this.irhubProvider.comments(data.comments, this.imageKey, num, this.url, this.username).then((data) => {
                    this.irhubProvider.viewComments(this.comments, this.imageKey).then((data: any) => {
                      var y = this.orgArray[0].avg + 1;
                      var x = ((num - this.orgArray[0].rating) / y);
                      x = x + this.orgArray[0].rating
                      this.orgArray[0].rating = Math.round(x);
                      // this.commentArr = data;
                      // console.log(this.commentArr);
                      // this.commentArr.reverse();
                      this.retrieveComments();
                      this.rate(num);
                      this.rateState = true;
                      this.showandHideStars = false;
                      this.showFab = false;
                    })
                  })
                }
              }
            ],
            // cssClass: 'myAlert',
          });
          prompt.present();
        }
        else if (this.rateState == true) {
          let alert = this.alertCtrl.create({
            cssClass: "myAlert",
            title: 'Oops!',
            subTitle: 'You cannot rate more than once',
            buttons: ['Ok']
          });
          alert.present();

        }
      }
      else {
        let alert = this.alertCtrl.create({
          cssClass: "myAlert",
          title: '',
          subTitle: 'You have to sign in before you can rate this organistion, would you like to sign in now?',
          buttons: [
            {
              text: 'Sign in',
              handler: data => {
                var opt = "rate";
                this.navCtrl.push(SignInPage, { option: opt, obj: this.orgArray })
              }
            },
            {
              text: 'Cancel',
              handler: data => {
                this.retrieveComments();
              }
            }
          ],
        });
        alert.present();
      }
    })

  }

  rate(num) {
    if (num == 1) {
      if (this.Star1 == "star-outline") {
        this.Star1 = "star";
      }
      else {
        this.Star1 = "star-outline";
        this.Star2 = "star-outline"
        this.Star3 = "star-outline";
        this.Star4 = "star-outline"
        this.Star5 = "star-outline";
      }
    }
    else if (num == 2) {
      if (this.Star2 == "star-outline") {
        this.Star1 = "star";
        this.Star2 = "star";
      }
      else {
        this.Star1 = "star";
        this.Star2 = "star-outline"
        this.Star3 = "star-outline";
        this.Star4 = "star-outline"
        this.Star5 = "star-outline";
      }
    }
    else if (num == 3) {
      if (this.Star3 == "star-outline") {
        this.Star1 = "star";
        this.Star2 = "star";
        this.Star3 = "star";
      }
      else {
        this.Star1 = "star";
        this.Star2 = "star"
        this.Star3 = "star-outline";
        this.Star4 = "star-outline"
        this.Star5 = "star-outline";
      }
    }
    else if (num == 4) {
      if (this.Star4 == "star-outline") {
        this.Star1 = "star";
        this.Star2 = "star";
        this.Star3 = "star";
        this.Star4 = "star";
      }
      else {
        this.Star1 = "star";
        this.Star2 = "star"
        this.Star3 = "star";
        this.Star4 = "star-outline"
        this.Star5 = "star-outline";
      }
    }
    else if (num == 5) {
      if (this.Star5 == "star-outline") {
        this.Star1 = "star";
        this.Star2 = "star";
        this.Star3 = "star";
        this.Star4 = "star";
        this.Star5 = "star";
      }
      else {
        this.Star1 = "star";
        this.Star2 = "star"
        this.Star3 = "star";
        this.Star4 = "star"
        this.Star5 = "star-outline";
      }
    }
  }


  ifOrderYes() {

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
  //show map 
  map2;
  destinationMap() {
    // const loader = this.loadingCtrl.create({
    //   content: "Please wait...",
    //   duration: 3000
    // });
    // loader.present();

    setTimeout(() => {
      const options = {
        center: { lat: parseFloat(this.destlat), lng: parseFloat(this.destlong) },
        zoom: 15,
        disableDefaultUI: true,
        styles: this.mapStyles,
        icon: this.icon
      }
      this.map2 = new google.maps.Map(this.mapRef2.nativeElement, options);
      this.marker = new google.maps.Marker({
        map: this.map2,
        zoom: 15,
        icon: this.icon,
        position: this.map2.getCenter()
      });
    }, 4000);
    console.log("show-map");
  }


  initMap() {

    return new Promise((resolve, reject) => {
      // const loader = this.loadingCtrl.create({
      //   content: "Please wait...",
      // });
      // loader.present();

      setTimeout(() => {
        const options = {
          center: { lat: parseFloat(this.currentUserlat), lng: parseFloat(this.currentUserlng) },
          zoom: 10,
          disableDefaultUI: true,
        }
        this.map = new google.maps.Map(this.mapRef.nativeElement, options);
        this.marker = new google.maps.Marker({
          map: this.map,
          zoom: 10,
          icon: this.icon,
          styles: this.mapStyles,
          position: this.map.getCenter()
        });
        // loader.dismiss();
      }, 7000);
      console.log("show-map");


      resolve()
    })


  }

  ShowBtnMethod() {
    console.log("clicked")

    //this.rateState == true

    if (this.rateState == true) {
      this.showBtn = false;
    } else {
      this.showBtn = true;
    }

    console.log(this.rateState)
  }

  getDirection() {

    let obj = {
      lat: this.destlat,
      long: this.destlong,
      address: this.address,
      img: this.image,
      programCategory: this.category

    }

    coordinateArray.push(obj)
    console.log(coordinateArray)
    const modal = this.modalCtrl.create(GetDirectionModalPage);
    modal.present();

    console.log("clicked");
  }


  nnn = 0;
  showMore() {
    var btnMore = document.getElementById("readMore");
    var readMore = document.getElementsByClassName("ParagraphPadding-1") as HTMLCollectionOf<HTMLElement>;
    if (this.nnn == 0) {
      this.nnn = 1;
      this.theReader = "read less";
      btnMore.style.marginTop = "-10px";
      readMore[0].style.maxHeight = "500px";
    }
    else {
      this.nnn = 0;
      this.theReader = "read more";
      btnMore.style.marginTop = "10px";
      readMore[0].style.maxHeight = "50px";
    }
  }

  fabStar() {
    if (this.showandHideStars == undefined) {
      this.showandHideStars = true;
    }
    else if (this.showandHideStars == true) {
      this.showandHideStars = true
    }
  }




  mapStyles = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#bdbdbd"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dadada"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#c9c9c9"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    }
  ]



}




var coordinateArray = new Array();
export default coordinateArray;

