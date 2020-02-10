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
      this.recipeDataSvc.push(index);
      for (const recipe in snapshotVal) {
        if (snapshotVal.hasOwnProperty(recipe)) {
          this.recipeDataSvc.push(snapshotVal[recipe]);
        }
      }
    });
    console.log('recipeDataSvc: ', this.recipeDataSvc);
    return this.recipeDataSvc;
  }
}
