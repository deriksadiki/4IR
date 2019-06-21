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
  // @ViewChild('desmap') mapRef2: ElementRef;
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
  icon = 'assets/imgs/loaction3.png'
  locIcon = 'assets/imgs/loc-user.svg'
  infowindow;
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
    // this.initdscMap();
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
        content: "Loading Map...",
      });
      loader.present();

      setTimeout(() => {
        const options = {
          center: { lat: parseFloat(this.currentUserlat), lng: parseFloat(this.currentUserlng) },
          zoom: 12,
          disableDefaultUI: true,
          styles: this.mapStyles
        }
        this.map = new google.maps.Map(this.mapRef.nativeElement, options);
        this.marker = new google.maps.Marker({
          map: this.map,
          zoom: 15,
          styles: this.mapStyles,
          icon: this.locIcon,
          position: this.map.getCenter()
        });
        loader.dismiss();
      }, 7000);
      // console.log("show-map");


      resolve()
    })


  }
  

  // initdscMap() {
  //   return new Promise((resolve, reject) => {
  //     const loader = this.loadingCtrl.create({
  //       content: "Loading Map...",
  //     });
  //     loader.present();

  //     setTimeout(() => {
  //       const options = {
  //         center: { lat: parseFloat(this.currentUserlat), lng: parseFloat(this.currentUserlng) },
  //         zoom: 14,
  //         disableDefaultUI: true,
  //         styles: this.mapStyles
  //       }
  //       this.map = new google.maps.Map(this.mapRef2.nativeElement, options);
  //       this.marker = new google.maps.Marker({
  //         map: this.map,
  //         zoom: 14,
  //         styles: this.mapStyles,
  //         icon: this.locIcon,
  //         position: this.map.getCenter()
  //       });
  //       loader.dismiss();
  //     }, 7000);
  //     console.log("show-map");


  //     resolve()
  //   })


  // }

  getDistance() {
    let userCurrentLocation = new google.maps.LatLng(this.currentUserlat, this.currentUserlng);
    let destination = new google.maps.LatLng(this.destCoords[0].lat, this.destCoords[0].long);
    this.service.getDistanceMatrix(
      {
        origins: [userCurrentLocation],
        destinations: [destination],
        travelMode: 'DRIVING'
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
      zoom: 20,
    });

    this.infowindow = new google.maps.InfoWindow({
      content:
          '<div style="float: left; width: 150%; transition: 300ms;"><b>' +
          '<p style="font-size:10px;">' + this.destCoords[0].img  + '</p>' +
          '<img style="height: 66px;  width: 80px; display: block;  border-radius: 8px;  object-fit: cover;" src=' +
          ">" +
          '<div style="padding-left: 10px;padding-right: 10px">' +
          // this.orgArray[index].intro +
          "</div><br>" +
          "</div>"
    });
    this.infowindow.open(this.map, this.destMaker);
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
