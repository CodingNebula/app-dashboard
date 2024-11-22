import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor() {

   }

  // async presentLoading(message:string) {
  //   const loading = await this.loadingController.create({
  //     message: message,
  //     spinner: 'crescent',
  //     mode:'ios',
  //     translucent: true,
  //     backdropDismiss: false,
  //   });
  //   await loading.present();
  // }
  // async dismissLoading() {
  //   await this.loadingController.dismiss();
  // }
}
