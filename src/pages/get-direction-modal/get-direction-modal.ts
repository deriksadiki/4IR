import { Component, ViewChild, ElementRef, OnInit } from '@angular/core'
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { EmailComposer } from '@ionic-native/email-composer'
import { CallNumber } from '@ionic-native/call-number';
import { IRhubProvider } from '../../providers/i-rhub/i-rhub'
import { SignInPage } from '../sign-in/sign-in';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { LoadingController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
// import { GetDirectionModalPage } from '../get-direction-modal/get-direction-modal';

declare var google;
declare var firebase
/**
 * Generated class for the GetDirectionModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-get-direction-modal',
  templateUrl: 'get-direction-modal.html',
})
export class GetDirectionModalPage {

  @ViewChild('map') mapRef: ElementRef;
  //@ViewChild('destmap') mapRef2: ElementRef;

  orgArray = new Array();
  commentArr = new Array();
  detailArray = new Array();
  comments;
  imageKey;
  map;
  marker;
  state = ["star-outline", "star-outline", "star-outline", "star-outline", "star-outline"]
  Star1 = "star-outline";
  Star2 = "star-outline";
  Star3 = "star-outline";
  Star4 = "star-outline";
  Star5 = "star-outline";


  mapStyles = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ebe3cd"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#523735"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#f5f1e6"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#c9b2a6"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#dcd2be"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#ae9e90"
        }
      ]
    },
    {
      "featureType": "landscape.natural",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#93817c"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#a5b076"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#447530"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f5f1e6"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#fdfcf8"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f8c967"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#e9bc62"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e98d58"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#db8555"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#806b63"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#8f7d77"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#ebe3cd"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#b9d3c2"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#92998d"
        }
      ]
    }
  ]




  rateState: boolean;
  destlat;
  destlong;
  currentUserlat;
  currentUserlng;
  destMaker  ;
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
  address ;
  loginState = this.navParams.get('loginState')
currentLocState = false;

    theTabs = "services";

  constructor(public navCtrl: NavController, public navParams: NavParams, private emailComposer: EmailComposer, private callNumber: CallNumber, public irhubProvider: IRhubProvider, public alertCtrl: AlertController, private launchNavigator: LaunchNavigator, public loadingCtrl: LoadingController,public modalCtrl: ModalController) {
    //this.initMap()
 
    
    // this.orgArray.push(this.navParams.get('orgObject'));
    // console.log(this.orgArray);
    
    // console.log(this.navParams.get('orgObject'))
    // this.imageKey = this.orgArray[0].id;
    // this.wifiRange1 = this.orgArray[0].wifiRange;
    // this.image = this.orgArray[0].img
    // this.logopic = this.orgArray[0].logo

    // this.address =this.orgArray[0].address 
    // console.log(this.logopic);
    
    // this.website = this.orgArray[0].website
    // // console.log(this.image)

    // // console.log(this.image)
    // this.services = this.orgArray[0].service[0]

    // console.log(this.services)
    // console.log(this.imageKey);
    // console.log(this.wifiRange1);


    // console.log(this.orgArray[0].lat);

    // this.destlat = this.orgArray[0].lat
    // this.destlong = this.orgArray[0].long

    
    //this.initMap()

    // if (this.loginState){
    // let userID = firebase.auth().currentUser;
    // firebase.database().ref("Users/" + "/" + "App_Users/" + userID.uid).on('value', (data: any) => {
    //   let details = data.val();
    //   this.detailArray.length = 0;
    //   console.log(details)
    //   this.detailArray.push(details);
    //   console.log(details);


    //   this.username = this.detailArray[0].name;
    //   this.url = this.detailArray[0].downloadurl

    //   console.log(this.username)
    //   console.log(this.url)

    // });
    // }

  }



  ionViewWillEnter() {
    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer;
    this.service = new google.maps.DistanceMatrixService();
    this.geocoder = new google.maps.Geocoder;

    this.irhubProvider.getUserLocation().then((data: any) => {
      if (data != null){
        this.currentLocState = true;
      console.log(data);
      console.log(data.coords.latitude);
      console.log(data.coords.longitude);
      this.currentUserlat = data.coords.latitude;
      this.currentUserlng = data.coords.longitude;
      }
    })
  }


getLocation(){
  this.irhubProvider.getUserLocation().then((data: any) => {
    if (data != null){
      this.currentLocState = true;
    console.log(data);
    console.log(data.coords.latitude);
    console.log(data.coords.longitude);

    this.currentUserlat = data.coords.latitude;
    this.currentUserlng = data.coords.longitude
    this.showMapContent();
    }
  })
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewOrganizationInforPage');
    this.destinationMap()

  }

  ngOnInit() {
    // setTimeout(()=>{
    //   this.initMap();
    // }, 4000)

    console.log("testmap");

    //this.retrieveComments();
  }

  


  

  //show map 
  
  destinationMap(){
    // const loader = this.loadingCtrl.create({
    //   content: "Please wait...",
    //   duration: 3000
    // });
    // loader.present();

    setTimeout(() => {
      const options = {
        center: {  lat: parseFloat(this.destlat), lng: parseFloat(this.destlong) },
        zoom: 8,
        disableDefaultUI: true,
        styles: this.mapStyles
      }
    
     
      this.map = new google.maps.Map(this.map.nativeElement, options);
      this.marker = new google.maps.Marker({
        map: this.map,
        zoom: 10,
        position: this.map.getCenter()
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
          zoom: 8,
          disableDefaultUI: true,
        }
        this.map = new google.maps.Map(this.mapRef.nativeElement, options);
        this.marker = new google.maps.Marker({
          map: this.map,
          zoom: 10,
          styles: this.mapStyles,
          position: this.map.getCenter()
        });
        // loader.dismiss();
      }, 7000);
      console.log("show-map");


      resolve()
    })


}

  getDistance() {
    console.log(this.destlat, this.destlong);
    //WALKING ,BICYCLING , 
    let userCurrentLocation = new google.maps.LatLng(this.currentUserlat, this.currentUserlng);
    let destination = new google.maps.LatLng(this.destlat, this.destlong);
    this.service.getDistanceMatrix(
      {
        origins: [userCurrentLocation],
        destinations: [destination],
        travelMode: 'WALKING'
      }, (response, status) => {
        if (status == 'OK') {
          var origins = response.originAddresses;
          var destinations = response.destinationAddresses;

          for (var i = 0; i < origins.length; i++) {
            var results = response.rows[i].elements;
            for (var j = 0; j < results.length; j++) {
              var element = results[j];
              console.log(element);

              this.showtime = element.duration.text;
              this.showDistance = element.distance.text;

              console.log(this.showtime);
              console.log(this.showDistance);


          }
          }

          this.destinationMarker() ;
         }
      });

  }
  q = 0
  loadMap = 0
  getDirection() {

    const modal = this.modalCtrl.create(GetDirectionModalPage);
    modal.present();
    if (this.currentLocState == false){
      const confirm = this.alertCtrl.create({
        message: 'Your location is currently turned off, do you want to turn it on now?',
        buttons: [
          {
            text: 'Disagree',
            handler: () => {
              console.log('Disagree clicked');
            }
          },
          {
            text: 'Agree',
            handler: () => {
              console.log('Agree clicked');
              this.getLocation();
            }
          }
        ]
      });
      confirm.present();

    }
    else{
    var theMap = document.getElementById("theMap");
    var theContent = document.getElementById("orgView");
    if (this.loadMap == 0) {
      this.loadMap = 1;
      this.initMap();
      if (this.q == 0) {
        this.q = 1
        theMap.style.display = "block";
        theContent.style.display = "none";
      }
    }
    else {
      if (this.q == 0) {
        this.q = 1
        theMap.style.display = "block";
        theContent.style.display = "none";
      }
      else {

        this.q = 0
        theMap.style.display = "none";
        theContent.style.display = "block";
      }
    }
  }

    console.log(this.q);


  }


  showMapContent(){
    var theMap = document.getElementById("theMap");
    var theContent = document.getElementById("orgView")
    if (this.loadMap == 0) {
      this.loadMap = 1;
      this.initMap();
      if (this.q == 0) {
        this.q = 1
        theMap.style.display = "block";
        theContent.style.display = "none";
      }
    }
    else {
      if (this.q == 0) {
        this.q = 1
        theMap.style.display = "block";
        theContent.style.display = "none";
      }
      else {

        this.q = 0
        theMap.style.display = "none";
        theContent.style.display = "block";
      }
    }
  }


  destinationMarker(){
//this.destlat, this.destlong
let deslat = this.destlat ;
let deslng = this.destlat ;


this.destMaker = new google.maps.Marker({
  map: this.map,
  //  icon: this.icon,
  position: { lat: parseFloat(this.destlat), lng: parseFloat(this.destlong) },
  label: name,
  zoom: 8,
});


  }

  navigate() {
    if (this.directionsDisplay != null) {
      this.directionsDisplay.setMap(null);

      console.log("directionDisplay has something");
      this.getDistance()

    } else {
      console.log("directionDisplay has nothing");

    }

    setTimeout(() => {


      let userCurrentLocation = new google.maps.LatLng(this.currentUserlat, this.currentUserlng);
      let destination = new google.maps.LatLng(this.destlat, this.destlong);
      this.directionsDisplay.setMap(this.map);
      console.log(this.directionsDisplay);

      this.irhubProvider.calculateAndDisplayRoute(userCurrentLocation, destination, this.directionsDisplay, this.directionsService);
    }, 1000);

  }

  googleMap(){

    console.log(this.address);
    
   
  this.launchNavigator.navigate(this.address) 
  .then(
    success => console.log('Launched navigator'),
    error => console.log('Error launching navigator', error)
  );

  }

}
