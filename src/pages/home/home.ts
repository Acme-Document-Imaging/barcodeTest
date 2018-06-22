import { Component,NgZone } from '@angular/core';
import { NavController,ActionSheetController, LoadingController } from 'ionic-angular';
import { Camera, PictureSourceType } from '@ionic-native/camera';
import * as Tesseract from 'tesseract.js'
import { NgProgress } from '@ngx-progressbar/core';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  selectedImage: string;
  imageText: string;
  //this._zone = new NgZone({ enableLongStackTrace: false });
  constructor(public navCtrl: NavController,private camera:Camera,public progress:NgProgress,private actionSheetCtrl: ActionSheetController,private loadingCtrl:LoadingController
  ,private _zone:NgZone) {

  }

  selectSource() {    
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Use Library',
          handler: () => {
            this.getPicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        }, {
          text: 'Capture Image',
          handler: () => {
            this.getPicture(this.camera.PictureSourceType.CAMERA);
          }
        }, {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }
 
  getPicture(sourceType: PictureSourceType) {
    this.camera.getPicture({
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: sourceType,
      allowEdit: true,
      saveToPhotoAlbum: false,
      correctOrientation: true
    }).then((imageData) => {
      this.selectedImage = `data:image/jpeg;base64,${imageData}`;
    });
  }
 
  recognizeImage() {
    let loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loader.present();

    Tesseract.recognize(this.selectedImage)
    .progress(progress => {
    
        this._zone.run(() => {
          loader.setContent(`${progress.status}: ${Math.floor(progress.progress * 100)}%`)
          console.log('progress:', progress);
        })
      
    //  this.progress.set(message.progress);
    })
    .catch(err => console.error(err))
    .then(result => {
      
      this.imageText = result.text;

   
    })
    .finally(resultOrError => {
      this._zone.run(() => {
        loader.dismissAll()        
        });
     // this.progress.complete();
    });
  }

}
