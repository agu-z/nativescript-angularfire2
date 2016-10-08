import { Observable } from 'rxjs/Observable';
import * as firebase from 'nativescript-plugin-firebase';

export class FirebaseObjectObservable<T> extends Observable<T> {

  constructor(public ref: string, observer) {
    super(observer);
  }

  set(value: T): Promise<any> {
    return firebase.setValue(this.ref, value);
  }

  update(changes: any): Promise<any> {
    return firebase.update(this.ref, changes);
  }

  remove(): Promise<any> {
    return firebase.remove(this.ref);
  }

}
