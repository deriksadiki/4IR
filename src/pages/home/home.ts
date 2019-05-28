import { Component } from '@angular/core'
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
 
  //arrays
  orgArray =  new Array();
  viewDetailsArray = new Array();
  img = "../../assets/imgs/Defaults/default.png";
  logInState;
//variables


textField = "";
searchDismissState = "search"

//Google services


  constructor(public navCtrl: NavController, public IRmethods: IRhubProvider, public loadingCtrl:LoadingController,public alertCtrl:AlertController) {
    this.IRmethods.getAllOrganizations().then((data:any) =>{
      this.orgArray = data;
      console.log(this.orgArray);
      // setTimeout(() => {
      //   this.loading.dismiss()
      // }, 2500);
    })

    




  

 
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


 





  ionViewWillEnter(){
  
    // this.loading = this.loadingCtrl.create({
    //   spinner: "bubbles",
    //   content: "Please wait....",
    // });
    // this.loading.present();
    
   

    
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

  showButton() {
    var theCard = document.getElementsByClassName("options") as HTMLCollectionOf<HTMLElement>;
    let searcher = document.getElementsByClassName('searchBar') as HTMLCollectionOf<HTMLElement>;
    var theTitle = document.getElementsByClassName("theTitle") as HTMLCollectionOf<HTMLElement>
    var nav = document.getElementsByClassName("theHead") as HTMLCollectionOf<HTMLElement>;
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

      searchBtn[0].style.top = "0";
      prof[0].style.top = "8px";

      restOf[0].style.paddingTop = "60px";
      // this.filtereditems = [];



    }
    console.log(this.textField);
    // this.searchTerm = "";

  }
  
}
