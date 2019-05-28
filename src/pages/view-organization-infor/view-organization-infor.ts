import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController} from 'ionic-angular';
import { EmailComposer } from '@ionic-native/email-composer'
import { CallNumber } from '@ionic-native/call-number';
import { IRhubProvider } from '../../providers/i-rhub/i-rhub'
import { SignInPage } from '../sign-in/sign-in';
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
export class ViewOrganizationInforPage implements OnInit{
  orgArray = new Array();
  commentArr = new Array();
  comments;
  imageKey;

  state = ["star-outline", "star-outline", "star-outline", "star-outline", "star-outline"]
  Star1 = "star-outline";
  Star2 = "star-outline";
  Star3 = "star-outline";
  Star4 = "star-outline";
  Star5 = "star-outline";
  rateState: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams,private emailComposer: EmailComposer,private callNumber: CallNumber,public irhubProvider: IRhubProvider,public alertCtrl:AlertController) {
    this.orgArray.push(this.navParams.get('orgObject'));
    console.log(this.navParams.get('orgObject'))
    this.imageKey = this.orgArray[0].id;
    console.log(this.imageKey);
    console.log(this.orgArray);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewOrganizationInforPage');
  }

  ngOnInit() {
    this.retrieveComments();
  }

  retrieveComments() {
    this.commentArr = [];
    this.irhubProvider.viewComments(this.comments, this.imageKey).then((data: any) => {
      this.commentArr = data;
      this.commentArr.reverse(); 

      let rating = this.irhubProvider.getRating();
      if (rating > 0) {
        this.rate(rating);
        this.rateState = true;
      }
      else if (rating == undefined || rating == 0) {
        this.rateState = false
      }

    })
  }

  comment(num) {
    this.irhubProvider.checkAuthState().then(data => {
      if (data == true) {
        console.log(data);
        if (this.rateState == false || this.rateState == undefined) {
          const prompt = this.alertCtrl.create({
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
                  this.irhubProvider.comments(data.comments, this.imageKey, num).then((data) => {
                    this.irhubProvider.viewComments(this.comments, this.imageKey).then((data: any) => {
                      var y = this.orgArray[0].avg + 1;
                      var x = ((num - this.orgArray[0].rating) / y);
                      x = x + this.orgArray[0].rating
                      this.orgArray[0].rating = Math.round(x);
                      this.commentArr = data;
                      this.commentArr.reverse();
                      this.commentArr.length = 0;
                      this.retrieveComments();
                      this.rate(num);
                      this.rateState = true;
                    })
                  })
                }
              }
            ],
            cssClass: 'myAlert',
          });
          prompt.present();
        }
        else if (this.rateState == true) {
          let alert = this.alertCtrl.create({
            title: 'Oops!',
            subTitle: 'You cannot rate more than once',
            buttons: ['Ok']
          });
          alert.present();
        }
      }
      else {
        let alert = this.alertCtrl.create({
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
          cssClass: 'myAlert',
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




}
