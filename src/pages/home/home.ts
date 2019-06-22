import { NavController, NavParams, Loading, AlertController, LoadingController } from 'ionic-angular';
import { IRhubProvider } from '../../providers/i-rhub/i-rhub';
import { SignInPage } from '../sign-in/sign-in';
import { UserProfilePage } from '../user-profile/user-profile';
import { ViewOrganizationInforPage } from '../view-organization-infor/view-organization-infor';
import { Component, ViewChild, ElementRef, style } from '@angular/core'
import { Geolocation } from '@ionic-native/geolocation';
import { StartPage } from '../start/start';
import { GetDirectionModalPage } from '../get-direction-modal/get-direction-modal';
import { ModalController } from 'ionic-angular';
import { Slides } from 'ionic-angular';

declare var google;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapRef: ElementRef;
  @ViewChild('mapBig') mapRef2: ElementRef;
  @ViewChild('destmap') mapRef3: ElementRef;
  @ViewChild('Slides') slides: Slides;
  orgArray = new Array();
  viewDetailsArray = new Array();
  tem = new Array();
  logInState;
  category;
  orgname;
  locationState;
  colorState = false;
  searchItem: string;
  currentLocState = false;
  currentUserlat;
  currentUserlng;
  destlat;
  address;
  destlong;
  //variables
  showtime;
  showDistance;
  destMaker;
  loading;
  nearby = new Array();
  //variables
  items = new Array()
  orgNames = new Array()
  map;
  mapBig;
  lat;
  lng;
  marker;
  showMultipleMarker;
  searchDismissState = "search";
  textField;
  loginState = this.navParams.get('loginState')
  img = "assets/imgs/defaultImage.png";
  toggleState = "map";
  showNearbyList: boolean = false;
  showAllOrganisation: boolean = true;

  icon = 'assets/imgs/loaction3.png'
  locIcon = 'assets/imgs/loc-user.svg'

  state = ["star-outline", "star-outline", "star-outline", "star-outline", "star-outline"]
  Star1 = "star-outline";
  Star2 = "star-outline";
  Star3 = "star-outline";
  Star4 = "star-outline";
  Star5 = "star-outline";



  //Google services
  directionsService;
  directionsDisplay;
  service;
  geocoder;
  custom1 = "btn";
  custom2 = "inactive";
  pic
  userLocation = "Searching for location...";
  name;


  CurrentName
  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public navParams: NavParams, public IRmethods: IRhubProvider, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {



    setTimeout(() => {
      this.IRmethods.getAllOrganizations().then((data: any) => {
        // console.log(data);
        this.orgArray = data
        

        // console.log(this.orgArray)
      })

    }, 8000)





    this.IRmethods.checkAuthState().then(data => {
      if (data == true) {
        this.logInState = true;
        this.IRmethods.getProfile().then((data: any) => {
          // console.log(data);

          // console.log(this.logInState);
          this.img = data.downloadurl;
          this.CurrentName = data.name;
        })
      }
      else if (data == false) {
        this.img = "assets/imgs/defaultImage.png";
      }
    });

  }


  ngOnInit() {

    setTimeout(() => {
      this.IRmethods.getAllOrganizations().then((data: any) => {
        // console.log(data)
      })

    }, 8000)




    this.initMapBig();
  }
  ionViewWillEnter() {
    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer;
    this.service = new google.maps.DistanceMatrixService();
    this.geocoder = new google.maps.Geocoder;

    this.IRmethods.getUserLocation().then((data: any) => {
      if (data != null) {
        this.currentLocState = true;
        // console.log(data);
        // console.log(data.coords.latitude);
        // console.log(data.coords.longitude);
        this.currentUserlat = data.coords.latitude;
        this.currentUserlng = data.coords.longitude;
      }
    })
  }

  checkVerification() {
    this.IRmethods.checkVerification().then((data: any) => {
      if (data == 0) {
        const alert = this.alertCtrl.create({
          cssClass: "myAlert",
          // title: "No Password",
          subTitle: "We have sent you a verification mail, Please activate your account with the link in the mail",
          buttons: ['OK'],
        });
        // loadingCtrl.dismiss()
        alert.present();
      }
      else if (data == 1) {
        // loadingCtrl.dismiss()
        this.navCtrl.setRoot(HomePage);
      }
    });
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

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      duration: 22400,
      content: 'please wait...',
    });
    loading.present();
    setTimeout(() => {
      document.getElementById("icon").style.color = "#f4f4f4";
      this.IRmethods.getCurrentLocations().then((data: any) => {
        // console.log(data);
        // console.log(data.coords.latitude);
        // console.log(data.coords.longitude);
        this.lat = data.coords.latitude;
        this.lng = data.coords.longitude
        // console.log(this.lat);
        this.locationState = true;
        this.IRmethods.getLocation(this.lat, this.lng).then((data: any) => {
          // console.log(data);
          this.userLocation = data
        })
        document.getElementById("icon").style.color = "#f4f4f4"
        document.getElementById("statement").style.color = "#f4f4f4"

      }, Error => {
        this.locationState = false;
        // console.log(Error.message);
        // console.log("show-map-error");
        this.lat = -25.7479;
        this.lng = 28.2293
        const options = {
          center: { lat: -25.7479, lng: 28.2293 },
          zoom: 8,
          disableDefaultUI: true,
          styles:this.mapStyles
        }
        this.userLocation = "Disabled"
        document.getElementById("icon").style.color = "#ff0000";
        document.getElementById("statement").style.color = "#ff0000"

        this.map = new google.maps.Map(this.mapRef.nativeElement, options);
      })

    }, 5000);



    setTimeout(() => {
      this.IRmethods.getCurrentLocation(this.lat, this.lng).then((radius: any) => {

        // console.log(this.lat);
        // console.log(this.lng);
        // console.log(radius);
        this.IRmethods.getAllOrganizations().then((data: any) => {
          // console.log(data);
          // console.log(radius);
          this.IRmethods.getNearByOrganizations(radius, data).then((nearbyOrgs: any) => {
            // console.log(nearbyOrgs);
            // this.nearby = nearbyOrgs;
            // loading.dismiss();
            // console.log(nearbyOrgs[0]);
         
            // console.log(this.nearby);
          })
        })
      })


    }, 3500);


    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer;
    this.service = new google.maps.DistanceMatrixService();
    this.geocoder = new google.maps.Geocoder;

    this.initMap().then(() => {
      // console.log("showMap");

    });
    this.initMapBig().then(() => {
      // console.log("showMap");

    });
    // loading.dismiss();
    // this.checkVerification()
  }

  ionViewDidEnter() {
    // this.all();



    this.IRmethods.getAllOrganizations().then((data: any) => {
      this.orgArray = data;



      this.setBackItems();
      // console.log(this.orgArray);
      var names = this.IRmethods.getOrgNames()
      // console.log(names);
      this.storeOrgNames(names)
      // this.loading.dismiss()
    })



    this.IRmethods.checkAuthState().then(data => {
      if (data == true) {
        this.logInState = true;
        this.IRmethods.getProfile().then((data: any) => {
          // console.log(data);

          // console.log(this.logInState);
          this.img = data;

          // this.name = data2.name;
        })
      }
      else if (data == false) {
        this.img = "assets/imgs/defaultImage.png";
      }
    });

    setTimeout(() => {
      this.IRmethods.getname().then((data:any) => {
        console.log(data.name)
        this.orgname =data.name
        console.log(this.orgname)
      })
    }, 8000)

  }


  initMap() {
    console.log(this.orgname)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.IRmethods.getUserLocation().then((data: any) => {
          if (data == undefined || data == null) {
            this.lat = -25.7479;
            this.lng = 28.2293
          }
          else {
            // console.log(data);
            // console.log(data.coords.latitude);
            // console.log(data.coords.longitude);

            this.lat = data.coords.latitude;
            this.lng = data.coords.longitude
            // console.log(this.lat);
            // console.log(this.lng);

          }
          const options = {
            center: { lat: parseFloat(this.lat), lng: parseFloat(this.lng) },
            zoom: 9,
            disableDefaultUI: true,
            styles: this.mapStyles,
            icon: this.icon,

          }
          this.map = new google.maps.Map(this.mapRef.nativeElement, options);
          // adding user marker to the map 
          this.marker = new google.maps.Marker({
            map: this.map,
            zoom: 10,
            icon: this.locIcon,
            position: this.map.getCenter()
            //animation: google.maps.Animation.DROP,
          });
          setTimeout(() => {
            this.markers().then(() => {
              // console.log("show Marker");
              // this.loading.dismiss()

            });
          }, 8000)

          let infowindow = new google.maps.InfoWindow({
            content:
              '<div style="width: 400px; transition: 300ms;"><b>' +
              this.orgname  +
              '</b><div style="display: flex; padding-top: 10px;">' +
              '<img style="height: 20px; width: 20px; object-fit: cober; border-radius: 50px;" src=' +
              this.img +
              ">" +
              '<div style="padding-left: 10px;padding-right: 10px">' +
              // this.orgArray[index].intro +
              "</div><br>" +

              "</div>"
          });
          this.marker.addListener('click', () => {
            this.map.setZoom(14);
            this.map.setCenter(this.marker.getPosition());
            infowindow.open(this.marker.get(this.map), this.marker);
          });
          resolve();

        })

      }, 5000);
    })

  }
  map2;
  destinationMap() {
    this.destlat = this.tem[0].lat
    this.destlong = this.tem[0].long
    // console.log(this.destlat, this.destlong)
    // console.log(this.tem)

    setTimeout(() => {
      // console.log(this.tem)
      const options = {
        center: { lat: parseFloat(this.destlat), lng: parseFloat(this.destlong) },
        zoom: 10,
        disableDefaultUI: true,
        styles: this.mapStyles,
        icon: this.icon
      }
      this.map2 = new google.maps.Map(this.mapRef3.nativeElement, options);
      this.marker = new google.maps.Marker({
        map: this.map2,
        zoom: 6,
        icon: this.icon,
        position: this.map2.getCenter()
      });
    }, 6000);

    // console.log("show-map");
  }
  initMapBig() {

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.IRmethods.getUserLocation().then((data: any) => {
          if (data == undefined || data == null) {
            this.lat = -25.7479;
            this.lng = 28.2293
          }
          else {
            // console.log(data);
            // console.log(data.coords.latitude);
            // console.log(data.coords.longitude);

            this.lat = data.coords.latitude;
            this.lng = data.coords.longitude
            // console.log(this.lat);
            // console.log(this.lng);

          }


          const options = {
            center: { lat: parseFloat(this.lat), lng: parseFloat(this.lng) },
            zoom: 8,
            disableDefaultUI: true,
            styles: this.mapStyles,
            icon: this.icon,

          }
          this.mapBig = new google.maps.Map(this.mapRef2.nativeElement, options);

          // adding user marker to the map 
          this.marker = new google.maps.Marker({
            map: this.mapBig,
            zoom: 10,
            icon: this.locIcon,
            title: 'Your Location',
            position: this.mapBig.getCenter()
            //animation: google.maps.Animation.DROP,
          });


          setTimeout(() => {
            this.markersBig().then(() => {
              // console.log("show Marker");
              // this.loading.dismiss()
            });
          }, 8000)


          var infowindow = new google.maps.InfoWindow();
          this.marker.addListener('click', function () {
            // console.log("clicked Marker");
            // console.log()

          });
          resolve();

        })

      }, 5000);


    })

  }


  viewDetails(name) {


    for (var i = 0; i < this.orgArray.length; i++) {
      if (this.orgArray[i].prograName == name) {
        this.navCtrl.push(ViewOrganizationInforPage, { orgObject: this.orgArray[i] })

        break;
      }
    }
  }

  // get all marker for all organisation

  markers() {
    let tracker;
    return new Promise((resolve, reject) => {

      setTimeout(() => {
        // console.log(this.orgArray);
        for (let index = 0; index < this.orgArray.length; index++) {
          // console.log(this.orgArray[index].orgName);
          let tracker = index;
          var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/'
          this.showMultipleMarker = new google.maps.Marker({
            map: this.mapBig,
            icon: this.icon,
            position: { lat: parseFloat(this.orgArray[index].lat), lng: parseFloat(this.orgArray[index].long) },
            label: name,
            zoom: 8,
          });

          console.log(this.orgArray[index].lat);
          this.showMultipleMarker.addListener('click', () => {

            console.log(this.orgArray[index].long);
            console.log(index);
            this.navCtrl.push(ViewOrganizationInforPage, { orgObject: this.orgArray[index] });
          });

          resolve();
        }
      }, 5000);
    })

  }

  markers2 = new Array();
  markersBig() {
    let tracker;
    return new Promise((resolve, reject) => {
      setTimeout(() => {

        // console.log(this.orgArray);
        for (let index = 0; index < this.orgArray.length; index++) {
          // console.log(this.orgArray[index].orgName);
          let tracker = index;
          var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/'
          var showMultipleMarker = new google.maps.Marker({
            map: this.map,
            icon: this.icon,
            styles: this.mapStyles,
            position: { lat: parseFloat(this.orgArray[index].lat), lng: parseFloat(this.orgArray[index].long) },
            label: name,
            zoom: 8,
          });
          this.markers2.push(showMultipleMarker);
          // console.log(this.orgArray[index].lat);
          showMultipleMarker.addListener('click', () => {
            console.log(this.orgArray[index]);
            console.log(index);
            for (var i = 0; i < this.markers2.length; i++) {
              this.markers2[i].setMap(null);
            }
            this.slides.slideTo(11)
            this.createSelectedMarker(this.orgArray[index])

            // this.navCtrl.push(ViewOrganizationInforPage, { orgObject: this.orgArray[index] });
          });
          resolve();
        }
      }, 2000);
    })
  }

  createSelectedMarker(obj) {
    var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/'
    var showMultipleMarker = new google.maps.Marker({
      map: this.map,
      icon: this.icon,
      styles: this.mapStyles,
      position: { lat: parseFloat(obj.lat), lng: parseFloat(obj.long) },
      label: name,
      zoom: 8,
    });
    this.markers2.push(showMultipleMarker);
    // console.log(this.orgArray[index].lat);
    showMultipleMarker.addListener('click', () => {

    })
    // this.navCtrl.push(ViewOrganizationInforPage, { orgObject: this.orgArray[index] })
  }

  showAllMarkers() {
    for (var i = 0; i < this.markers2.length; i++) {
      this.markers2[i].setMap(null);
    }
    this.showAllMarkersRemoved();
  }

  showAllMarkersRemoved() {
    for (let index = 0; index < this.orgArray.length; index++) {
      // console.log(this.orgArray[index].orgName);
      let tracker = index;
      var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/'
      var showMultipleMarker = new google.maps.Marker({
        map: this.map,
        icon: this.icon,
        position: { lat: parseFloat(this.orgArray[index].lat), lng: parseFloat(this.orgArray[index].long) },
        label: name,
        zoom: 8,
      });
      this.markers2.push(showMultipleMarker);
      // console.log(this.orgArray[index].lat);
      showMultipleMarker.addListener('click', () => {
        this.slides.slideTo(index)
        console.log(this.orgArray[index]);
        console.log(index);
        for (var i = 0; i < this.markers2.length; i++) {
          this.markers2[i].setMap(null);
        }
        this.createSelectedMarker(this.orgArray[index])
        // this.navCtrl.push(ViewOrganizationInforPage, { orgObject: this.orgArray[index] });
      });
    }
  }

  getDirection() {

    this.destlat = this.tem[0].lat
    this.destlong = this.tem[0].long
    this.address = this.tem[0].address
    // console.log(this.destlat, this.destlong)
    // console.log(this.tem)

    let obj = {
      lat: this.destlat,
      long: this.destlong,
      address: this.address
    }

    coordinateArray.push(obj)
    // console.log(coordinateArray)
    // 
    const modal = this.modalCtrl.create(GetDirectionModalPage);
    modal.present();

    // console.log("clicked");
  }


  Userprofile() {
    this.IRmethods.checkAuthState().then(data => {
      if (data == false) {
        let alert = this.alertCtrl.create({
          cssClass: "myAlert",
          subTitle: 'You have to sign in before you can view your profile, would you like to signin now?',
          // cssClass: 'myAlert',
          buttons: [
            {
              text: 'Sign in',
              handler:
                data => {
                  var opt = "profile";
                  this.navCtrl.push(StartPage, { option: opt })
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




  goToViewPage(name) {
    // console.log(this.orgArray)
    for (var x = 0; x < this.orgArray.length; x++) {
      if (name == this.orgArray[x].orgName) {
        this.navCtrl.push(ViewOrganizationInforPage, { orgObject: this.orgArray[x], loginState: this.logInState });
        break;
      }
    }
  }

  showButton() {
    // var theCard = document.getElementsByClassName("options") as HTMLCollectionOf<HTMLElement>;
    let searcher = document.getElementsByClassName('searchBar') as HTMLCollectionOf<HTMLElement>;
    // var theTitle = document.getElementsByClassName("theTitle") as HTMLCollectionOf<HTMLElement>
    // var nav = document.getElementsByClassName("theHead") as HTMLCollectionOf<HTMLElement>;
    // var theSplit = document.getElementsByClassName("split") as HTMLCollectionOf<HTMLElement>;
    var theSplit2 = document.getElementsByClassName("split2") as HTMLCollectionOf<HTMLElement>;
    var searchBtn = document.getElementsByClassName("more") as HTMLCollectionOf<HTMLElement>;
    var prof = document.getElementsByClassName("profile") as HTMLCollectionOf<HTMLElement>;
    var restOf = document.getElementsByClassName("restOfBody") as HTMLCollectionOf<HTMLElement>;

    if (this.searchDismissState == "close") {
      this.searchDismissState = "search";
      // console.log(this.state);
      searcher[0].style.width = "0";
      searcher[0].style.left = "-35%";
      searcher[0].style.top = "18px";
      // theTitle[0].style.opacity = "1";

      // theCard[0].style.height = "130px";
      // theCard[0].style.top = "60px";
      // theCard[0].style.opacity = "1";

      // nav[0].style.height = "120px";
      // theSplit[0].style.height = "190px";
      theSplit2[0].style.height = "185px";

      searchBtn[0].style.top = "20px";

      prof[0].style.top = "25px";
      // this.filtereditems = [];
      // this, this.searchTerm = "";
      // this.initializeItems();
      // this.setArrayBack(this.tempArray)
      this.items = [];
      this.searchItem = "";
      this.getItems(event);
      // this.filterItems('');
      this.setBackItems();
      //restOf[0].style.paddingTop = "210px";


    }
    else if (this.searchDismissState == "search") {
      this.searchDismissState = "close";
      // console.log(this.state);
      searcher[0].style.width = "72%";
      searcher[0].style.left = "15%";
      searcher[0].style.top = "5px"
      // theTitle[0].style.opacity = "0";

      // theCard[0].style.height = "50px";
      // theCard[0].style.top = "-65px";
      // theCard[0].style.opacity = "0.5";

      // nav[0].style.height = "50px";
      // theSplit[0].style.height = "40px";
      theSplit2[0].style.height = "40px";


      searchBtn[0].style.top = "0";
      prof[0].style.top = "8px";

      //restOf[0].style.paddingTop = "60px";




    }
    // console.log(this.textField);
    // this.searchTerm = "";

  }

  n = 1
  toggleMap() {
    // console.log("clicked");
    this.IRmethods.checkAuthState().then(data => {
      if (data == false) {
        let alert = this.alertCtrl.create({
          cssClass: "myAlert",
          subTitle: 'You have to sign in before you can view the map, would you like to signin now?',
          // cssClass: 'myAlert',
          buttons: [
            {
              text: 'Sign in',
              handler:
                data => {
                  var opt = "profile";
                  this.navCtrl.push(StartPage, { option: opt })
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
        var ionScrll = document.getElementsByClassName("scroll-content") as HTMLCollectionOf<HTMLElement>;
        // var theHeader = document.getElementsByClassName("theHead") as HTMLCollectionOf<HTMLElement>;
        var theMap = document.getElementById("mapView");
        // var theList = document.getElementById("list");

        if (this.n == 1) {
          this.n = 0;
          this.toggleState = "list"
          theMap.style.display = "block"
          ionScrll[0].style.overflowY = "hidden"
          // theList.style.display = "none";
          // theHeader[0].style.display = "none";
        }
        else {

          this.n = 1;
          ionScrll[0].style.overflowY = "scroll"
          this.toggleState = "map"
          theMap.style.display = "none"
          // theList.style.display = "block";
          // theHeader[0].style.display = "block";
        }
      }
    })



  }
  // growSlide(){
  //   var selectedSlide = document.getElementById("toGrow");

  //   selectedSlide.style.boxShadow = "0 0 10px black";
  //   selectedSlide.style.height = "80px"
  // }

  storeOrgNames(names) {
    // this.orgNames = names;
    // console.log(names);

    this.orgNames[0] = names[0]
    for (var x = 1; x < names.length; x++) {
      var state = 0;
      for (var i = 0; i < this.orgNames.length; i++) {
        if (this.orgNames[i] == names[x]) {
          state = 1;
          break;
        }
      }
      if (state == 0) {
        this.orgNames[x] = names[x]
      }
    }
    // console.log(this.orgNames);
  }

  tempArray = new Array();
  initializeItems() {
    this.items = this.orgNames

    // console.log(this.items);

  }

  filterItems(val) {
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        // console.log(val);

        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
    else if (val == "" || val == null) {
      this.items = [];
    }
  }


  setBackItems() {
    this.tempArray = this.orgArray
    this.tempArray.length =0;
  }

  getItems(ev) {
    var header = document.getElementById("theHead")
    // var listContent = document.getElementById("list")
    // var listBig = document.getElementById("listBig")
    // Reset items back to all of the items
    this.items = [];
    this.tempArray = [];
    this.initializeItems();
    this.setBackItems();

    // set val to the value of the ev target
    this.searchItem;

    // if the value is an empty string don't filter the items
    if (this.searchItem && this.searchItem.trim() != '') {

      // listBig.style.display = "none"
      this.items = this.items.filter((item) => {
        // console.log(this.searchItem);
        return (item.toLowerCase().indexOf(this.searchItem.toLowerCase()) > -1);
      })
    }
    else if (this.searchItem == "" || this.searchItem == null) {
      this.items = [];
      this.searchItem = ""
    }
    // console.log(this.items);
    // this.tempArray = [];
    //   for (var x = 0; x < this.items.length; x++){
    //     if (this.orgArray[x].orgName == this.items[x]){
    //       this.tempArray = this.orgArray[x]
    //     }
    //   }
    if (this.searchItem == "" || this.searchItem == " " || this.searchItem == null) {
      // listContent.style.display = "block"
    }
    else {
      // listContent.style.display = "none"
    }
    //header.style.display = "none"
  }
  near() {


    if (this.locationState == true) {
      if (this.nearby.length == 0) {
        const alert = this.alertCtrl.create({
          // title: "No Password",
          subTitle: "We currently don't have organisations near you",
          buttons: ['OK'],
          cssClass: 'myAlert',
        });
        // loadingCtrl.dismiss()
        alert.present();

      }
      else {
        // let loading = this.loadingCtrl.create({
        //   spinner: 'bubbles',
        //   content: 'please wait...',
        //   duration: 4000000
        // });
        // loading.present();



        // console.log("clicked");
        // console.log(this.nearby);

        this.showNearbyList = true;
        this.showAllOrganisation = false;
        this.custom1 = "inactive";
        this.custom2 = "primary";
        // loading.dismiss();
      }
    }
    else {
      const alert = this.alertCtrl.create({
        // title: "No Password",
        subTitle: "Please turn on your location to enjoy 4IR's full potential.",
        buttons: ['OK'],
        cssClass: 'myAlert',
      });
      // loadingCtrl.dismiss()
      alert.present();
    }
  }


  all() {
    setTimeout(() => {
      this.showNearbyList = false;
      this.showAllOrganisation = true;
      this.custom1 = "primary";
      this.custom2 = "inactive";

    }, 3000)

  }
  convertinCoordinate() {
    // console.log(this.lat);
    this.IRmethods.getLocation(this.lat, this.lng).then((data: any) => {
      // console.log(data);
      this.userLocation = "Soweto"
    })

  }

  selectcategory() {

    return new Promise((resolve, reject) => {

      const options = {
        center: { lat: parseFloat(this.lat), lng: parseFloat(this.lng) },
        zoom: 15,
        disableDefaultUI: true,
        styles: this.mapStyles,
        icon: this.icon
      }
      this.map = new google.maps.Map(this.mapRef.nativeElement, options);
      // adding user marker to the map 
      this.marker = new google.maps.Marker({
        map: this.map,
        styles: this.mapStyles,
        zoom: 15,
        icon: this.locIcon,
        position: this.map.getCenter()
        //animation: google.maps.Animation.DROP,
      });
      for (let index = 0; index < this.orgArray.length; index++) {
        if (this.category == this.orgArray[index].programCategory) {

          this.showMultipleMarker = new google.maps.Marker({
            map: this.map,
            styles: this.mapStyles,
            icon: this.icon,
            position: { lat: parseFloat(this.orgArray[index].lat), lng: parseFloat(this.orgArray[index].long) },
            label: name,
            zoom: 8,
          });
          this.showMultipleMarker.addListener('click', () => {
            this.navCtrl.push(ViewOrganizationInforPage, { orgObject: this.orgArray[index] });
          });

        }
      }

    })



  }
  scroll(event) {
    // console.log(event.scrollTop);

    var theCard = document.getElementsByClassName("options") as HTMLCollectionOf<HTMLElement>;
    var nav = document.getElementsByClassName("theHead") as HTMLCollectionOf<HTMLElement>;
    var searchBtn = document.getElementsByClassName("more") as HTMLCollectionOf<HTMLElement>;
    var prof = document.getElementsByClassName("profile") as HTMLCollectionOf<HTMLElement>;
    var barTitle = document.getElementsByClassName("theTitle") as HTMLCollectionOf<HTMLElement>;
    var searchTxt = document.getElementsByClassName("searchBar") as HTMLCollectionOf<HTMLElement>;
    var splitter = document.getElementsByClassName("split") as HTMLCollectionOf<HTMLElement>;
    // console.log(event.directionY);
    if (event.directionY == "down" && event.scrollTop > 90) {

      // if (event.scrollTop > 250) {
      // console.log("hide card");

      theCard[0].style.height = "50px";
      theCard[0].style.top = "-65px";
      theCard[0].style.opacity = "0";
      // splitter[0].style.height = "50px";
      nav[0].style.height = "80px";


      // searchBtn[0].style.top = "0";

      // prof[0].style.top = "8px";

      // barTitle[0].style.top = "12px";

      // searchTxt[0].style.top = "5px";


      // }
    }
    else {
      // console.log("show Card");
      theCard[0].style.height = "130px";
      theCard[0].style.top = "60px";
      theCard[0].style.opacity = "1";

      nav[0].style.height = "120px";

      // searchBtn[0].style.top = "20px";

      // prof[0].style.top = "25px";

      // barTitle[0].style.top = "25px";

      // searchTxt[0].style.top = "18px";

      // splitter[0].style.height = "190px";

    }
    // console.log(event.scrollTop);

  }


  styles: [
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

  nm = 0;
  goToViewPageBig(name) {
    this.tem.length = 0;
    var closeBtn = document.getElementById("close-view-button").style.display = "block";
    var flipCard = document.getElementById("flip-card-inner").style.transform = "rotateY(0deg)";

    for (var x = 0; x < this.orgArray.length; x++) {
      // console.log(this.orgArray[x].orgName)
      if (name == this.orgArray[x].orgName) {
        this.tem.push(this.orgArray[x])

        // console.log(this.tem)
        break;
      }
    }
    this.destinationMap();

  }
  backToMapView() {
    var closeBtn = document.getElementById("close-view-button").style.display = "none";
    var flipCard = document.getElementById("flip-card-inner").style.transform = "rotateY(180deg)";
  }

  navigate(orgObject) {
    if (this.directionsDisplay != null) {
      this.directionsDisplay.setMap(null);

      // console.log("directionDisplay has something");
      this.getDistance(orgObject.lat, orgObject.long, orgObject)

    } else {
      // console.log("directionDisplay has nothing");
    }
    setTimeout(() => {
      let userCurrentLocation = new google.maps.LatLng(this.currentUserlat, this.currentUserlng);
      let destination = new google.maps.LatLng(orgObject.lat, orgObject.long);
      this.directionsDisplay.setMap(this.map);
      // console.log(this.directionsDisplay);

      this.IRmethods.calculateAndDisplayRoute(userCurrentLocation, destination, this.directionsDisplay, this.directionsService);
      // this.destinationMarker()
    }, 1000);
  }
  Destaddress;
  touchstart(orgObjetc) {
    this.navigate(orgObjetc)
    this.Destaddress = orgObjetc.address;
  }

  getDistance(lat, long, obj) {
    let userCurrentLocation = new google.maps.LatLng(this.currentUserlat, this.currentUserlng);
    let destination = new google.maps.LatLng(lat, long);
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
              // console.log(element);

              this.showtime = element.duration.text;
              this.showDistance = element.distance.text;

              // console.log(this.showtime);
              // console.log(this.showDistance);
            }
          }

          this.destinationMarker(lat, long, obj);
        }
      });

  }
  infowindow;

  destinationMarker(lat, long, obj) {
    if (this.infowindow) {
      this.infowindow.close();
    }
    let destMaker = new google.maps.Marker({
      map: this.map,
      icon: this.icon,
      position: { lat: parseFloat(lat), lng: parseFloat(long) },
      label: name,
      zoom: 8,
    });
    this.markers2.push(destMaker)
    var stars = null;
    var key = obj.rating
    var start = 0;
    var end = 0;
    if (key == 0) {
      stars = '<span style="font-size:15px; color: #dcc050;margin-left: 8px;">&#9734;</span>'
      start = 0;
      end = 4
    }
    for (var x = 1; x <= key; x++) {
      if (stars == null)
        stars = '<span style="font-size:15px; color: #dcc050;margin-left: 8px;">&#9733;</span>'
      else
        stars = stars + '<span style="font-size:15px; color: #dcc050;margin-left: 8px;">&#9733;</span>'
      start = x;
      end = 5
    }
    start++;
    for (var i = start; i <= end; i++) {
      if (stars == null)
        stars = '<span style="font-size:15px; color: #dcc050;margin-left: 8px;">&#9734;</span>'
      else
        stars = stars + '<span style="font-size:15px; color: #dcc050;margin-left: 8px;">&#9734;</span>'
    }
    // }
    console.log(obj);
    this.infowindow = new google.maps.InfoWindow({
      content:
        "<div id='tests'>" +
        "<div id='mapIMG'>" +
        "<img id='theImg-inMap' src='" + obj.img + "'></div>" +
        "<div id='textAreas'><p id='catMap'><b>" + obj.programCategory +
        "<br>" + "</b></p></div></div>" +
        "<br><div id='moreInforMap'><p>" +
        obj.city + "</p>" + "<p>" + obj.email + "</p>" +
        "<p><b>Opening date:</b> " + obj.openApplicationDate + "</p>" +
        "<p><b>closing date:</b> " + obj.closeApplicationDate + "</p>" +
        "</div>"
    });
    this.infowindow.open(this.map, destMaker);
 
    
  }


  slideChanged() {
    console.log('category');
    for (var i = 0; i < this.markers2.length; i++) {
      this.markers2[i].setMap(null);
    }
    let currentIndex = this.slides.getActiveIndex();
    // console.log(this.orgArray[currentIndex]);
    this.touchstart(this.orgArray[currentIndex])
  }





}

var coordinateArray = new Array();

export default coordinateArray;
