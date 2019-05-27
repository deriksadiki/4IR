import { Component, ViewChild, ElementRef } from '@angular/core'
import { NavController, LoadingController, Loading } from 'ionic-angular';
import { IRhubProvider } from '../../providers/i-rhub/i-rhub';
import { Geolocation } from '@ionic-native/geolocation';
declare var google ;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('map') mapRef: ElementRef;
  //arrays
  orgArray =  new Array();

  //variables
  map ;
  loading;
  lat;
  lng ;
  marker ;

  //Google services

 directionsService ; 
directionsDisplay  ;
 service ;
  geocoder ;
  constructor(public navCtrl: NavController, public IRmethods: IRhubProvider, public loadingCtrl:LoadingController) {

   
    
    this.IRmethods.getAllOrganizations().then((data:any) =>{
      this.orgArray = data;
      console.log(this.orgArray);
      // setTimeout(() => {
      //   this.loading.dismiss()
      // }, 2500);
    })

    this.IRmethods.getUserLocation().then((data:any)=>{
      console.log(data);
      console.log(data.coords.latitude);
      console.log(data.coords.longitude);

      this.lat =data.coords.latitude ;
      this.lng = data.coords.longitude
      
      
    })


  

  }
  ionViewWillEnter(){
    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer;
    this.service = new google.maps.DistanceMatrixService();
    this.geocoder = new google.maps.Geocoder;
    // this.loading = this.loadingCtrl.create({
    //   spinner: "bubbles",
    //   content: "Please wait....",
    // });
    // this.loading.present();
    
    this.initMap() ;
    
  }


  initMap(){

    const options = {
      center: { lat:  parseFloat(this.lat), lng: parseFloat(this.lng) },
      zoom: 8,
      disableDefaultUI: true,
      }

    this.map = new google.maps.Map(this.mapRef.nativeElement, options);

    // adding user marker to the map 

    this.marker = new google.maps.Marker({
      map: this.map,
      zoom: 10,
      position: this.map.getCenter()
      //animation: google.maps.Animation.DROP,
     });

  }


  
 


  getDirection(){
    
   

    
    if (this.directionsDisplay != null) {
      this.directionsDisplay.setMap(null);

      console.log("directionDisplay has something");

    } else {
      console.log("directionDisplay has nothing");
     
    }
    let userCurrentLocation =  new google.maps.LatLng(this.lat, this.lng);
    let destination =  new google.maps.LatLng(-26.2583,  27.9014);
    this.directionsDisplay.setMap(this.map);
    this.IRmethods.calculateAndDisplayRoute(userCurrentLocation , destination ,this.directionsDisplay , this.directionsService)

    //this.calculateAndDisplayRoute(userCurrentLocation , destination ,this.directionsDisplay , this.directionsService)

  }



  // get Distance and Time 


  getDistance() {
    let userCurrentLocation =  new google.maps.LatLng(this.lat, this.lng);
    let destination =  new google.maps.LatLng(-26.2583,  27.9014);
    
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
             
              }
          }
        }
      });
   
  }


  
}
