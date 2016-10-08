import { Injectable } from '@angular/core';
import { AngularFireDatabase } from './database';

@Injectable()
export class AngularFire {
  constructor(public database: AngularFireDatabase) { }
}
