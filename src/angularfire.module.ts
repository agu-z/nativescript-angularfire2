import { NgModule, ModuleWithProviders } from '@angular/core';
import * as firebase from 'nativescript-plugin-firebase';

import { AngularFire } from './angularfire.service';
import { AngularFireDatabase } from './database';

@NgModule({
  providers: [AngularFireDatabase, AngularFire]
})
export class AngularFireModule {

  static initializeApp(config: firebase.InitOptions): ModuleWithProviders {
    firebase.init(config).then((instance) => {
      console.log('firebase.init done');
    }, (error) => {
      console.log(`firebase.init error: ${error}`);
    });

    return {
      ngModule: AngularFireModule
    }
  }

}
