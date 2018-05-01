import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { UrlEntry } from '../interfaces/url-entry';
import { Utils } from './utils';

@Injectable()
export class AppData {
  // Key values identifier
  ID_URLS_LIST = 'url-list';

  constructor(
    private storage: Storage,
    private utils: Utils
  ) { }

  /**
   * Add a url path to the local list.
   * 
   * @param urlPath Url path to add.
   */
  public addUrl(urlPath: string): Promise<UrlEntry[]> {
    return new Promise<UrlEntry[]> ((resolve) => {
        this.getUrlList().then((list) => {
            if (list === null) {
                let newlist: UrlEntry[] = [];
                list = newlist;
            }
    
            // Create a new entry
            let newurl: UrlEntry = {
                id: this.utils.newGuid(false),
                path: urlPath
            }
    
            // Push to our entry list
            list.push(newurl);
    
            // Save it local
            this.storage.set(this.ID_URLS_LIST, JSON.stringify(list));

            resolve(list);
        });
    });
  };

  /**
   * Update a url path to the local list.
   * 
   * @param urlPath Url path to add.
   */
  public updateUrl(urlItem: UrlEntry): Promise<UrlEntry[]> {
    return new Promise<UrlEntry[]> ((resolve) => {
        this.getUrlList().then((list) => {
            if (list === null) {
                let newlist: UrlEntry[] = [];
                list = newlist;
            }
            else {
                // Using filter to remove the item from the array first.
                list = list.filter(item => item.id !== urlItem.id);
            }

            // Push to our new updated entry list
            list.push(urlItem);
    
            // Save it local
            this.storage.set(this.ID_URLS_LIST, JSON.stringify(list));

            resolve(list);
        });
    });
  };
    
  /**
   * Remove a url entry from the local list.
   * 
   * @param urlItem Url entry item to remove.
   */
  public removeUrl(urlItem: UrlEntry): Promise<UrlEntry[]> {
    return new Promise<UrlEntry[]> ((resolve) => {
        this.getUrlList().then((list) => {
            if (list === null) {
                return; // Nothing to do here since its empty
            }
    
            // Using filter to remove the item from the array.
            list = list.filter(item => item.id !== urlItem.id);
    
            this.storage.set(this.ID_URLS_LIST, JSON.stringify(list));

            resolve(list);
        });
    });
  };

  /**
   * Get the url list.
   */
  public getUrlList(): Promise<UrlEntry[]> {
    return this.storage.ready().then(() => {
      return this.storage.get(this.ID_URLS_LIST).then((value) => {
        return JSON.parse(value) as UrlEntry[];
      });
    });
  };
}
