import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  recipeDataSvc: string[] = [];

  constructor() {
  }

  getRecipesSvc(path) {
    const recipeRef = firebase.database().ref('resep/' + path);
    this.recipeDataSvc = [];
    recipeRef.on('value', (snapshot) => {
      const snapshotVal = snapshot.val();
      for (const index in snapshotVal) {
        if (snapshotVal.hasOwnProperty(index)) {
          this.recipeDataSvc.push(snapshotVal[index]);
        }
      }
    });
    return this.recipeDataSvc;
  }
}
