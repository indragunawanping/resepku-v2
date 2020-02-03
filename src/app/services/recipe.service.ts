import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  recipesDataSvc: string[] = [];
  recipeDataSvc: string[] = [];
  bookmarkRef = firebase.database().ref('bookmark').push();
  // key = this.bookmarkRef.key;

  constructor() {
  }

  getAllRecipesSvc(path) {
    const recipeRef = firebase.database().ref('resep/' + path);
    this.recipesDataSvc = [];
    recipeRef.on('value', (snapshot) => {
      const snapshotVal = snapshot.val();
      for (const index in snapshotVal) {
        if (snapshotVal.hasOwnProperty(index)) {
          this.recipesDataSvc.push(snapshotVal[index]);
        }
      }
    });
    return this.recipesDataSvc;
  }

  getRecipeSvc(path, index) {
    const recipeRef = firebase.database().ref('resep/' + path + '/' + index);
    this.recipeDataSvc = [];
    recipeRef.on('value', (snapshot) => {
      const snapshotVal = snapshot.val();
      for (const recipe in snapshotVal) {
        if (snapshotVal.hasOwnProperty(recipe)) {
          this.recipeDataSvc.push(snapshotVal[recipe]);
        }
      }
    });
    return this.recipeDataSvc;
  }

  setBookmarkTrue() {
    this.bookmarkRef.push().update({
      condition: 'true'
    });
  }

  setBookmarkFalse() {
    this.bookmarkRef.push().update({
      condition: 'false'
    });
  }
}
