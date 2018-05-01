import { Component, ViewChild } from '@angular/core';
import { NavController, List, Refresher, ItemSliding, AlertController, FabContainer, Events, NavParams } from 'ionic-angular';
import { UrlEntry } from '../../interfaces/url-entry';
import { AppData } from '../../providers/app-data';
import { Utils } from '../../providers/utils';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  // the list is a child of the Inspections page
  // @ViewChild('inspectionsList') gets a reference to the list
  // with the variable #onlineList, `read: List` tells it to return
  // the List and not a reference to the element
  @ViewChild('urlList', { read: List }) onlineList: List;
    
  shownUrls: UrlEntry[] = [];
  page: any;

  constructor(
    private alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private appData: AppData,
    private utils: Utils,
    private events: Events,
    public iab: InAppBrowser,
    public sanitizer: DomSanitizer
  ) { }

  ionViewDidLoad() {
    this.fetchLocalList(null);
  }

  /**
   * This method will retrive list from the memory.
   */
  fetchLocalList(refresher: Refresher): void {
    this.appData.getUrlList().then((list) => {
      if (refresher !== null ) {
        refresher.complete();
      }

      if (list === null) {
        return;
      }

      this.shownUrls = list;
    });
  }

  /**
   * Performs the list update and refresh according to the current
   * view.
   * 
   * @param refresher 
   */
  goRefresh(refresher: Refresher) {
    this.fetchLocalList(refresher);
  }

  goCreateLocalUrl(fab: FabContainer): void {
    // Ask user to create a new inspections data
    // Go to the inspection view
    let alert = this.alertCtrl.create({
      title: 'New URL',
      subTitle: 'Please enter a URL path',
      inputs: [
        {
          name: 'urlpath',
          placeholder: 'URL Path'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: _ => {
            console.log('Cancel new URL entry');
          }
        },
        {
          text: 'Add',
          handler: (data) => {
            if (this.utils.isStringValid(data.urlpath)) {
              this.appData.addUrl(data.urlpath).then((newlist) => {
                // Update back the list
                this.shownUrls = newlist;
                fab.close();
              });
            } else {
              this.events.publish('msg:error', 'Invalid url string');
              fab.close();
            }
          }
        }
      ]
    });

    alert.present();
  }
  
  /**
   * Edit local inspection record.
   * 
   * @param slidingItem 
   * @param insp 
   */
  goEditLocal(slidingItem: ItemSliding, urlentry: UrlEntry): void {
    let alert = this.alertCtrl.create({
      title: 'Edit URL',
      inputs: [{
        name: 'urlpath',
        value: urlentry.path,
        placeholder: 'URL Path'
      }],
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            // they clicked the cancel button, do not remove the session
            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        },
        {
          text: 'Save',
          handler: (data) => {
            // they want to update this url entry
            urlentry.path = data.urlpath;
            
            this.appData.updateUrl(urlentry).then((newlist) => {
              // Update back the list
              this.shownUrls = newlist;

              // close the sliding item and hide the option buttons
              slidingItem.close();
            });
          }
        }        
      ]
    });

    // now present the alert on top of all other content
    alert.present();
  }

  /**
   * Remove the local inspection record for the list and storage.
   * 
   * @param slidingItem 
   * @param insp 
   */
  goDeleteLocal(slidingItem: ItemSliding, urlentry: UrlEntry): void {
    let alert = this.alertCtrl.create({
      title: 'Delete ' + urlentry.path,
      message: 'Would you like to delete this URL?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            // they clicked the cancel button, do not remove the session
            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        },
        {
          text: 'Delete',
          handler: () => {
            // they want to remove this inspections from the list
            this.appData.removeUrl(urlentry).then((newlist) => {
              // Update back the list
              this.shownUrls = newlist;

              // close the sliding item and hide the option buttons
              slidingItem.close();
            });
          }
        }
      ]
    });

    // now present the alert on top of all other content
    alert.present();
  }  

  goOpenLocalList(slidingItem: ItemSliding, urlentry: UrlEntry): void {
    // // window.open(urlentry.path, '_system', 'location=yes');
    // window.open(urlentry.path, '_blank', 'location=yes');

    // // let browser = new InAppBrowser('url', '_system'); 
    // //For system browser, you'll be prompt to choose your browser if you have more than one 
    // // let browser = new InAppBrowser('url', '_blank'); //For webview,   
    
    // const browser = this.iab.create(urlentry.path, '_blank');
    // browser.show();

    // let url = this.navParams.get(urlentry.path);
    // alert(url);
    this.page = this.sanitizer.bypassSecurityTrustResourceUrl(urlentry.path);
  }
}
