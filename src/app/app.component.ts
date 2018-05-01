import { Component } from '@angular/core';
import { Platform, Events, LoadingController, ToastController, Loading } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { Utils } from '../providers/utils';
import { SystemEvents } from '../providers/system-events';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;
  _loading: Loading;
  
  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    private events: Events,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private utils: Utils,
    private systemEvents: SystemEvents
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

    });

    this.listenToEvents();
  }

  /**
   * Listener that hears the event triggered by other view.
   */
  listenToEvents() {
    // Event handler for error messages
    this.events.subscribe(this.systemEvents.ERROR, (msg) => {
      // Prompt the messagebox
      let toast = this.toastCtrl.create({
        message: msg,
        duration: 3000,
        cssClass: 'error'
      });

      this._loading.dismiss();
      toast.present();
    });

    // Event handler for success messages
    this.events.subscribe(this.systemEvents.SUCCESS, (msg) => {
      // Prompt the messagebox
      let toast = this.toastCtrl.create({
        message: msg,
        duration: 3000,
        cssClass: 'success'
      });

      this._loading.dismiss();
      toast.present();
    });  
    
    // Event handler for showing loader
    this.events.subscribe(this.systemEvents.LOADER_SHOW, (msg) => {
      if (!this.utils.isStringValid(msg)) {
        msg = 'Please wait...';
      }

      this._loading = this.loadingCtrl.create({
        content: msg,
        duration: 10000, // a default 10 seconds timeout incase of any issues
        dismissOnPageChange: true
      });

      this._loading.present();
    });   
  }  
}

