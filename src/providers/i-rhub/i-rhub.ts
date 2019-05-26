import { Injectable, NgZone } from '@angular/core';
declare var firebase;
/*
  Generated class for the IRhubProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class IRhubProvider {

  //arrays
  orgArray =  new Array();


  constructor(public ngzone: NgZone) {
    console.log('Hello IRhubProvider Provider');
  }

  getAllOrganizations(){
    return new Promise((resolve, reject) => {
      this.ngzone.run(() => {
        var user = firebase.auth().currentUser;
          firebase.database().ref("Organizations").on("value", (data: any) => {
            if (data.val() != null){
              this.orgArray.length = 0;
              let details = data.val();   
              let keys = Object.keys(details);
              for (var x = 0; x < keys.length; x++){
                let orgObject = {
                  orgName: details[keys[x]].name,
                  email : details[keys[x]].email,
                  region: details[keys[x]].region,
                  cell: details[keys[x]].contact,
                  long: details[keys[x]].long,
                  lat : details[keys[x]].lat,
                  img : details[keys[x]].downloadurl,
                  category : details[keys[x]].category,
                  id : keys[x]
                }
                this.orgArray.push(orgObject)
              }
              resolve(this.orgArray)
            }        
         });
      })
    })
  }

}
