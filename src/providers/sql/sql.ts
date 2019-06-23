
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ToastController } from 'ionic-angular';
/*
  Generated class for the SqlProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SqlProvider {

  private db: SQLiteObject;
  private isOpen: boolean;

  constructor(
    public storage: SQLite,
    public toastCtrl: ToastController
  ) {
    if (!this.isOpen) {
      this.storage = new SQLite();
      this.storage.create({ name: "data22.db", location: "default" }).then((db: SQLiteObject) => {
        this.db = db;
        db.executeSql("CREATE TABLE IF NOT EXISTS favourites (id INTEGER PRIMARY KEY AUTOINCREMENT, state TEXT) ", []);
        this.isOpen = true;
      }).catch((error) => {
        console.log(error);
      })
    }
  }


  storefavourite( title:string){
    return new Promise ((resolve, reject) => {
      let sql = "INSERT INTO favourites (state) VALUES (?)";
      this.db.executeSql(sql, [title ]).then((data) =>{
        resolve(data);
        const toast = this.toastCtrl.create({
          message: 'adding state',
          duration: 5000
        });
        toast.present();
      }, (error) => {
        reject(error);
      });
    });
  }

  GetAllFavourite(){
    return new Promise ((resolve, reject) => {
      this.db.executeSql("SELECT * FROM favourites", []).then((data) => {
        let arrayUsers = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            arrayUsers.push({
              id: data.rows.item(i).id,
              state: data.rows.item(i).state,
            });       
          }          
        }    
        resolve(arrayUsers);
      }, (error) => {
        reject(0);
      })
    })
  }

}
