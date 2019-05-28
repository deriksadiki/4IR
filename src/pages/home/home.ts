import { Component, ViewChild, ElementRef } from '@angular/core'
import { NavController, LoadingController, Loading,AlertController } from 'ionic-angular';
import { IRhubProvider } from '../../providers/i-rhub/i-rhub';
import { SignInPage } from '../sign-in/sign-in';
import { UserProfilePage } from '../user-profile/user-profile';
import { ViewOrganizationInforPage } from '../view-organization-infor/view-organization-infor';


declare var google ;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('map') mapRef: ElementRef;
  //arrays
  orgArray =  new Array();
  viewDetailsArray = new Array();
  img = "../../assets/imgs/Defaults/default.png";
  logInState;
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
  constructor(public navCtrl: NavController, public IRmethods: IRhubProvider, public loadingCtrl:LoadingController,public alertCtrl:AlertController) {
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
      console.log( this.lat );
      
      
      
    })



setTimeout(() => {
  this.IRmethods.getCurrentLocation(this.lat , this.lng).then((radius:any)=>{
   
    console.log(this.lat);
   console.log(this.lng);
    console.log(radius);
    
    this.IRmethods.getAllOrganizations().then((data:any)=>{
      console.log(data);
      console.log(radius);
      this.IRmethods.getNearByOrganizations(radius ,data).then((nearbyOrgs:any)=>{
        console.log(nearbyOrgs);
        
      })
    })
  })
  
}, 3000);
  

 
    this.IRmethods.checkAuthState().then(data => {
      if (data == true) {
        this.logInState = true;
        this.IRmethods.getProfile().then((data: any) => {
          console.log(this.logInState);

          this.img = data;
        })
      }
      else if (data == false) {
        this.img = "assets/imgs/default.png";
      }
    })
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

  

  }

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

  Userprofile() {
    this.IRmethods.checkAuthState().then(data => {
      if (data == false) {
        let alert = this.alertCtrl.create({
          subTitle: 'You have to sign in before you can view your profile, would you like to sign in now?',
          // cssClass: 'myAlert',
          buttons: [
            {
              text: 'Sign in',
              handler: data => {
                var opt = "profile";
                this.navCtrl.push(SignInPage, { option: opt })
              }
            },
            {
              text: 'Cancel',
              handler: data => {

              }
            }
          ]
        });
        alert.present();
      } else {
        this.navCtrl.push(UserProfilePage)
      }

    })
  }

  goToViewPage(name) {
    for (var x = 0; x < this.orgArray.length; x++) {
      if (name == this.orgArray[x].orgName) {
        this.navCtrl.push(ViewOrganizationInforPage, { orgObject: this.orgArray[x] });
      }
    }
  }
  
}
