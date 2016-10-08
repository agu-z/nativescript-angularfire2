import { Injectable, NgZone } from '@angular/core';
import * as firebase from 'nativescript-plugin-firebase';

import { FirebaseListObservable } from './list-observable';
import { FirebaseObjectObservable } from './object-observable';

const QueryEvents = {
  ChildAdded:   'ChildAdded',
  ChildChanged: 'ChildChanged',
  ChildRemoved: 'ChildRemoved',
}

@Injectable()
export class AngularFireDatabase {

  constructor(private zone: NgZone) { }

  list(ref: string, query: any = {}) {
    return new FirebaseListObservable<any>(ref, observer => {
      let queryListeners;

      if (!query.orderBy) {
        query.orderBy = {
          type: firebase.QueryOrderByType.KEY
        };
      }

      let items = [];
      let index = {};

      firebase.query(({ type, key, value }) => {
        // TODO: Handle errors
        //if (error) {
          //return observer.error(error);
        //}

        if (type === QueryEvents.ChildAdded) {
          const valueObject = AngularFireDatabase.createValueObject(key, value);

          items.push(valueObject);
          index[key] = valueObject;
        } else if (type === QueryEvents.ChildChanged) {
          const valueObject = AngularFireDatabase.createValueObject(key, value);

          items[items.indexOf(index[key])] = valueObject;
          index[key] = valueObject;
        } else if (type === QueryEvents.ChildRemoved) {
          items.splice(items.indexOf(index[key]), 1);
          delete index[key];
        }

        this.zone.run(() => {
          observer.next(items.slice(0, items.length));
        });
      }, ref, query).then(({ listeners }) => {
        queryListeners = listeners;
      }).catch(observer.error);

      return () => {
        firebase.removeEventListeners(queryListeners, ref);
      };
    });
  }

  object(ref: string) {
    return new FirebaseObjectObservable<any>(ref, observer => {
      let queryListeners;

      firebase.addValueEventListener(({ type, key, value }) => {
        // TODO: Handle error
        //if (error) {
          //return observer.error(error);
        //}

        this.zone.run(() => {
          observer.next(AngularFireDatabase.createValueObject(key, value))
        });
      }, ref).then(({ listeners }) => {
        queryListeners = listeners;
      }).catch(observer.error);

      return () => {
        firebase.removeEventListeners(queryListeners, ref);
      };
    });
  }

  private static createValueObject(key: string, value: any) {
    let valueObject = { $key: key, $value: value };

    if (value instanceof Object) {
      Object.assign(valueObject, value);
    }

    return valueObject;
  }
}
