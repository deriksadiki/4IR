
import { NavController, LoadingController, Loading, AlertController } from 'ionic-angular';
import { IRhubProvider } from '../../providers/i-rhub/i-rhub';
import { SignInPage } from '../sign-in/sign-in';
import { UserProfilePage } from '../user-profile/user-profile';
import { ViewOrganizationInforPage } from '../view-organization-infor/view-organization-infor';
import { Component, ViewChild, ElementRef } from '@angular/core'
import { Geolocation } from '@ionic-native/geolocation';

declare var google;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapRef: ElementRef;
  orgArray = new Array();
  viewDetailsArray = new Array();
  logInState;

  //variables
  loading;
  nearby = new Array() ;
  //variables
  items = new Array()
  orgNames = new Array()
  map;
  lat;
  lng;
  marker;
  showMultipleMarker;
  searchDismissState = "search";
  textField;
  img = "../../assets/imgs/Defaults/default.png";
  toggleState = "map";
  showNearbyList:boolean =false ;
  showAllOrganisation:boolean =true ;

  //Google services
  directionsService;
  directionsDisplay;
  service;
  geocoder;
  constructor(public navCtrl: NavController, public IRmethods: IRhubProvider, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {

    this.IRmethods.getAllOrganizations().then((data: any) => {
      this.orgArray = data;

      console.log(this.orgArray);
      setTimeout(() => {
        var names = this.IRmethods.getOrgNames()
        console.log(names);
        
        this.storeOrgNames(names)
        // this.loading.dismiss()
      }, 2500);
    })

    this.IRmethods.getUserLocation().then((data: any) => {
      console.log(data);
      console.log(data.coords.latitude);
      console.log(data.coords.longitude);

      this.lat = data.coords.latitude;
      this.lng = data.coords.longitude
      console.log(this.lat);



    }).catch(()=>{
      console.log("show-map-error");
      const options = {
        center: { lat: -25.7479, lng: 28.2293},
        zoom: 8,
        disableDefaultUI: true,
      }
      this.map = new google.maps.Map(this.mapRef.nativeElement, options);

      

    })



    setTimeout(() => {
      this.IRmethods.getCurrentLocation(this.lat, this.lng).then((radius: any) => {

        console.log(this.lat);
        console.log(this.lng);
        console.log(radius);

        this.IRmethods.getAllOrganizations().then((data: any) => {
          console.log(data);
          console.log(radius);
          this.IRmethods.getNearByOrganizations(radius, data).then((nearbyOrgs: any) => {
            console.log(nearbyOrgs);
            this.nearby =nearbyOrgs ;

            console.log(this.nearby);
            


          })
        })
      })

    }, 8000);

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



  ionViewWillEnter() {
    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer;
    this.service = new google.maps.DistanceMatrixService();
    this.geocoder = new google.maps.Geocoder;
  
   this.initMap().then(()=>{
     console.log("showMap");
     
   }) ;

  }


  initMap() {
   return new Promise((resolve , reject)=>{
  const options = {
    center: { lat: parseFloat(this.lat), lng: parseFloat(this.lng) },
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

  setTimeout(() => {
    this.markers().then(()=>{
      console.log("show Marker");
      
    });
  }, 4000)
resolve () ;
})
    
}






  getDirection() {
    if (this.directionsDisplay != null) {
      this.directionsDisplay.setMap(null);

      console.log("directionDisplay has something");

    } else {
      console.log("directionDisplay has nothing");

    }
    let userCurrentLocation = new google.maps.LatLng(this.lat, this.lng);
    let destination = new google.maps.LatLng(-26.2583, 27.9014);
    this.directionsDisplay.setMap(this.map);
    this.IRmethods.calculateAndDisplayRoute(userCurrentLocation, destination, this.directionsDisplay, this.directionsService)



  }



  // get Distance and Time 


  getDistance() {
    let userCurrentLocation = new google.maps.LatLng(this.lat, this.lng);
    let destination = new google.maps.LatLng(-26.2583, 27.9014);
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


  // get all marker for all organisation

  markers() {

    return new Promise((resolve , reject)=>{
      console.log(this.orgArray);
      for (let index = 0; index < this.orgArray.length; index++) {
        var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/'
        this.showMultipleMarker = new google.maps.Marker({
          map: this.map,
          //  icon: this.icon,
          position: { lat: parseFloat(this.orgArray[index].lat), lng: parseFloat(this.orgArray[index].long) },
          label: name,
          zoom: 8,
        });

        resolve() ;
      }

    })
   
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
              handler:
                data => {
                  var opt = "profile";
                  this.navCtrl.push(SignInPage, { option: opt })
                }
            },
            {
              text: 'Cancel',
              handler:
                data => {

                }
            }]
        });
        alert.present();
      } else {
        this.navCtrl.push(UserProfilePage)
      }
    })
  }




  // goToViewPage(name) {
  //   ;
  //   for (var x = 0; x < this.orgArray.length; x++) {
  //     if (name == this.orgArray[x].orgName) {
  //       this.navCtrl.push(ViewOrganizationInforPage, { orgObject: this.orgArray[x] });
  //     }
  //   }
  // }

  showButton() {
    var theCard = document.getElementsByClassName("options") as HTMLCollectionOf<HTMLElement>;
    let searcher = document.getElementsByClassName('searchBar') as HTMLCollectionOf<HTMLElement>;
    var theTitle = document.getElementsByClassName("theTitle") as HTMLCollectionOf<HTMLElement>
    var nav = document.getElementsByClassName("theHead") as HTMLCollectionOf<HTMLElement>;
    var theSplit = document.getElementsByClassName("split") as HTMLCollectionOf<HTMLElement>;
    var searchBtn = document.getElementsByClassName("more") as HTMLCollectionOf<HTMLElement>;
    var prof = document.getElementsByClassName("profile") as HTMLCollectionOf<HTMLElement>;
    var restOf = document.getElementsByClassName("restOfBody") as HTMLCollectionOf<HTMLElement>;

    if (this.searchDismissState == "close") {
      this.searchDismissState = "search";
      // console.log(this.state);
      searcher[0].style.width = "0";
      searcher[0].style.left = "-10%";
      searcher[0].style.top = "18px";
      theTitle[0].style.opacity = "1";

      theCard[0].style.height = "130px";
      theCard[0].style.top = "60px";
      theCard[0].style.opacity = "1";

      nav[0].style.height = "120px";
      theSplit[0].style.height = "190px";

      searchBtn[0].style.top = "20px";

      prof[0].style.top = "25px";
      // this.filtereditems = [];
      // this, this.searchTerm = "";
      // this.initializeItems();
      // this.setArrayBack(this.tempArray)
      restOf[0].style.paddingTop = "210px";
      

    }
    else if (this.searchDismissState == "search") {
      this.searchDismissState = "close";
      // console.log(this.state);
      searcher[0].style.width = "72vw";
      searcher[0].style.left = "15%";
      searcher[0].style.top = "5px"
      theTitle[0].style.opacity = "0";

      theCard[0].style.height = "50px";
      theCard[0].style.top = "-65px";
      theCard[0].style.opacity = "0.5";

      nav[0].style.height = "50px";
      theSplit[0].style.height = "40px";

      searchBtn[0].style.top = "0";
      prof[0].style.top = "8px";

      restOf[0].style.paddingTop = "60px";
      // this.filtereditems = [];



    }
    console.log(this.textField);
    // this.searchTerm = "";

  }
  n = 1
  toggleMap() {
    console.log("clicked");

    var theHeader = document.getElementsByClassName("theHead") as HTMLCollectionOf<HTMLElement>;
    var theMap = document.getElementById("mapView");
    var theList = document.getElementById("list");

    if (this.n == 1) {
      this.n = 0;
      this.toggleState = "list"
      theMap.style.display = "block"
      theList.style.display = "none";
      theHeader[0].style.display = "none";
    }
    else {

      this.n = 1;
      this.toggleState = "map"
      theMap.style.display = "none"
      theList.style.display = "block";
      theHeader[0].style.display = "block";
    }
  }

  storeOrgNames(names){
    this.orgNames = names;
    console.log(this.orgNames);
    
  }

  initializeItems() {
    this.items = this.orgNames
  }

 getItems(ev) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the ev target
    var val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        console.log(val);
        
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
    else if (val == "" ||val == null) {
      this.items = [];
    }
    console.log(this.items);
    
  }


  near(){
    console.log("clicked");
    console.log(this.nearby);
    
  }

  goToViewPage(name) {
    for (var x = 0; x < this.orgArray.length; x++) {
      if (name == this.orgArray[x].orgName) {
        this.navCtrl.push(ViewOrganizationInforPage, { orgObject: this.orgArray[x] });
      }
    
  }
    this.showNearbyList =true ;
    this. showAllOrganisation =false ;
  }


  all(){
    this.showNearbyList =false;
    this. showAllOrganisation =true;
  }

}
