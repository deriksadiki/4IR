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

import coordinateArray from "../view-organization-infor/view-organization-infor"

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
  @ViewChild('desmap') mapRef2: ElementRef;
  //@ViewChild('destmap') mapRef2: ElementRef;
  destCoords = coordinateArray;
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
  icon = 'assets/imgs/wifi2.svg'
  locIcon = 'assets/imgs/loc-user.svg'
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



  theTabs = "services";

  constructor(public navCtrl: NavController, public navParams: NavParams, private emailComposer: EmailComposer, private callNumber: CallNumber, public irhubProvider: IRhubProvider, public alertCtrl: AlertController, private launchNavigator: LaunchNavigator, public loadingCtrl: LoadingController, public modalCtrl: ModalController) {
  }



  ionViewWillEnter() {

    console.log(this.destCoords);

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

    this.initMap()
    this.initdscMap();
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

  ngOnInit() {
    console.log("testmap");
  }


  initMap() {
    return new Promise((resolve, reject) => {
      const loader = this.loadingCtrl.create({
        content: "Please wait...",
      });
      loader.present();

      setTimeout(() => {
        const options = {
          center: { lat: parseFloat(this.currentUserlat), lng: parseFloat(this.currentUserlng) },
          zoom: 8,
          disableDefaultUI: true,
          styles: this.mapStyles
        }
        this.map = new google.maps.Map(this.mapRef.nativeElement, options);
        this.marker = new google.maps.Marker({
          map: this.map,
          zoom: 10,
          styles: this.mapStyles,
          icon: this.locIcon,
          position: this.map.getCenter()
        });
        loader.dismiss();
      }, 7000);
      console.log("show-map");


      resolve()
    })


  }
  

  initdscMap() {
    return new Promise((resolve, reject) => {
      const loader = this.loadingCtrl.create({
        content: "Please wait...",
      });
      loader.present();

      setTimeout(() => {
        const options = {
          center: { lat: parseFloat(this.currentUserlat), lng: parseFloat(this.currentUserlng) },
          zoom: 8,
          disableDefaultUI: true,
          styles: this.mapStyles
        }
        this.map = new google.maps.Map(this.mapRef2.nativeElement, options);
        this.marker = new google.maps.Marker({
          map: this.map,
          zoom: 10,
          styles: this.mapStyles,
          icon: this.locIcon,
          position: this.map.getCenter()
        });
        loader.dismiss();
      }, 7000);
      console.log("show-map");


      resolve()
    })


  }

  getDistance() {
    let userCurrentLocation = new google.maps.LatLng(this.currentUserlat, this.currentUserlng);
    let destination = new google.maps.LatLng(this.destCoords[0].lat, this.destCoords[0].long);
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
              this.showDistance = "Distance: " + element.distance.text;

              console.log(this.showtime);
              console.log(this.showDistance);
            }
          }

          this.destinationMarker();
        }
      });

  }

  destinationMarker() {
    this.destMaker = new google.maps.Marker({
      map: this.map,
      icon: this.icon,
      position: { lat: parseFloat(this.destCoords[0].lat), lng: parseFloat(this.destCoords[0].long) },
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
      let destination = new google.maps.LatLng(this.destCoords[0].lat, this.destCoords[0].long);
      this.directionsDisplay.setMap(this.map);
      console.log(this.directionsDisplay);

      this.irhubProvider.calculateAndDisplayRoute(userCurrentLocation, destination, this.directionsDisplay, this.directionsService);
      // this.destinationMarker()
    }, 1000);


  }

  googleMap() {
    this.launchNavigator.navigate(this.destCoords[0].address)
      .then(
        success => console.log('Launched navigator'),
        error => console.log('Error launching navigator', error)
      );
  }

}
