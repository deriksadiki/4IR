import { Injectable, NgZone } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
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
  nearByOrg = new Array() ;


  constructor(public ngzone: NgZone , public geo :Geolocation) {
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

  //user Location Method 

  getUserLocation(){
    return new Promise((resolve, reject)=>{
      this.geo.getCurrentPosition().then((resp) => {
        resolve(resp)
       }).catch((error) => {
         console.log('Error getting location', error);
       });
    })
  }

  //show direction on the map 

  calculateAndDisplayRoute(location, destination, directionsDisplay, directionsService) {

    console.log(  location);

    console.log( destination);

    directionsService.route({
      origin: location,
      destination: destination,
      travelMode: 'DRIVING'
    }, function (response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
        console.log("routing OK");

        directionsDisplay.setOptions({ suppressMarkers: true });

      } else {
        console.log(status);
        console.log("not working");
        

      }
    });
  }

  //creating a  radius

  createPositionRadius(latitude, longitude){
    var leftposition, rightposition, downposition, uposititon;
    return new Promise ((accpt, rej) =>{
      
        var downlat = new String(latitude); 
        var latIndex = downlat.indexOf( "." ); 
        var down = parseInt(downlat.substr(latIndex + 1,2)) + 6;
        var down = parseInt(downlat.substr(latIndex + 1,2)) + 12;
        if (down >= 100){
          if (downlat.substr(0,1) == "-"){
            var firstDigits = parseInt(downlat.substr(0,3)) + 1;
          }
          else{
            var firstDigits = parseInt(downlat.substr(0,2)) - 1;
          }
          var remainder = down - 100;
          if (remainder >= 10){
            downposition = firstDigits + "." + remainder;
          }
          else{
            downposition = firstDigits +  ".0" + remainder;
          }
          
        }else{
          if (downlat.substr(0,1) == "-"){
            downposition =  downlat.substr(0,3) + "." + down ;
          }
          else{
            downposition = downlat.substr(0,2) + "." + down;
          }
        
        }
        
        //up  position
        var uplat = new String(latitude); 
        var latIndex = uplat .indexOf( "." ); 
        var up= parseInt(uplat .substr(latIndex + 1,2)) - 6;
        var up= parseInt(uplat .substr(latIndex + 1,2)) - 12;
        if (up <= 0){
          if (uplat.substr(0,1) == "-"){
            var firstDigits = parseInt(uplat.substr(0,3)) + 1;
          }
          else{
            var firstDigits = parseInt(uplat.substr(0,2)) - 1;
          }
          var remainder = down - 100;
          if (remainder >= 10){
            uposititon = firstDigits + "." + remainder;
          }
          else{
            uposititon = firstDigits +  ".0" + remainder;
          }
        }else{
          if (uplat.substr(0,1) == "-"){
            uposititon = uplat.substr(0,3) + "." + up ;
          }
          else{
            uposititon = uplat.substr(0,2) + "." + up ;
          }
          
        }
          //left position
         var leftlat = new String(longitude);
         var longIndex =  leftlat.indexOf(".");
         var left =  parseInt(leftlat.substr(longIndex + 1,2)) - 6;
         var left =  parseInt(leftlat.substr(longIndex + 1,2)) - 12;
         if (left >= 100){
           if (leftlat.substr(0,1) == "-"){
              var firstDigits =  parseInt(leftlat.substr(0,3)) - 1;
           }else{
            var firstDigits =  parseInt(leftlat.substr(0,2)) + 1;
           }
           var remainder = left - 100;
           leftposition= firstDigits +  ".0" + remainder;
         }else{
           if (leftlat.substr(0,1) == "-"){
            var firstDigits= parseInt(leftlat.substr(0,3)) + 1;
           }
           else{
            var firstDigits= parseInt(leftlat.substr(0,2)) - 1;
           }
          
           if (left == 0){
            var remainder = 0;
           }
           else{
            var remainder = left - 12;
           }
           
           leftposition = firstDigits +  ".0" + remainder;
        
         }
            //right position
            var rightlat = new String(longitude);
            var longIndex =  rightlat.indexOf(".");
            var right =  parseInt(rightlat.substr(longIndex + 1,2)) + 6;
            var right =  parseInt(rightlat.substr(longIndex + 1,2)) + 12;
            if (right >= 100){
              if (rightlat.substr(0,1) == "-"){
                 var firstDigits =  parseInt(rightlat.substr(0,3)) - 1;
              }else{
               var firstDigits =  parseInt(rightlat.substr(0,2)) + 1;
              }
              var remainder =  right - 100;
              rightposition = firstDigits +  ".0" + remainder;
            }else{
              rightposition = rightlat.substr(0,2) + "." + right;
              if (left == 0){
                var remainder = 0;
               }
               else{
                var remainder = left - 12;
               }
               
               rightposition  = firstDigits +  ".0" + remainder;
            }
        
        
            let radius ={
              left: leftposition,
              right : rightposition,
              up : uposititon,
              down : downposition
            }

            accpt(radius);
      
// down  position

   
    })
  
  }

//get current location

  getCurrentLocation(lat, lng){
    
     return new Promise ((accpt, rej) =>{
      
        console.log("provider outside getCurPos");
        this.createPositionRadius(lat, lng).then((data:any) =>{
         accpt(data);
       })
      })
      
}

getCurrentLocations(){
  //get current location
   return new Promise ((accpt, rej) =>{
   
      this.geo.getCurrentPosition().then((resp) => {
        console.log(resp);
        
     
          accpt(resp);
   
         }).catch((error) => {
           console.log('Error getting location', error.message);
           
         });
    })
  
    
 }

getNearByOrganizations(radius,org){
  return new Promise((accpt,rej) =>{
    
      this.nearByOrg = []
      this.getCurrentLocations().then((resp:any) =>{
      console.log(resp);
      
      var lat =  new String(resp.coords.latitude).substr(0,6);
      console.log(lat);
      console.log(resp.coords.latitude)
     var long = new String(resp.coords.longitude).substr(0,5);
      console.log(long);
      console.log(resp.coords.longitude);
      for (var x = 0; x < org.length; x++){
        var orglat = new String(org[x].lat).substr(0,6);
        var orgLong =  new String(org[x].lng).substr(0,5);
        // console.log('out');
        // console.log(orglat);
        // console.log(orgLong);
        // console.log( radius.left);
        // console.log(radius.right);
        // console.log(radius.down);
        // console.log(radius.up);
        
        
        if ((orgLong  <= long  && orgLong  >= radius.left || orgLong  >= long  && orgLong  <= radius.right) && (orglat >= lat && orglat <= radius.down || orglat <= lat && orglat >= radius.up)){

       this.nearByOrg.push(org[x]);
        console.log(this.nearByOrg);

        }
      }
      accpt(this.nearByOrg)
    })
    
    
  })
}

}
