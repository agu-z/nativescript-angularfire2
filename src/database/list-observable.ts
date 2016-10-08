import { FirebaseObjectObservable } from './object-observable';
import * as firebase from 'nativescript-plugin-firebase';

export class FirebaseListObservable<T> extends FirebaseObjectObservable<T[]> {

  push<T>(value: T): Promise<any> {
    return firebase.push(this.ref, value);
  }

}
