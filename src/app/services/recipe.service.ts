import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Storage } from '@ionic/storage';

export interface SearchRecipe {
  id: string;
  title: string;
  type: string;
  imageUrl;
}

@Injectable({
  providedIn: 'root'
})

export class RecipeService {
  recipesDataSvc: string[] = [];
  recipeDataSvc: string[] = [];
  searchRecipe: SearchRecipe[] = [];

  constructor(public storage: Storage) {}

  getRecipe() {
    const foodType = [ 'daging', 'nasi', 'sayuran',
                        'ikan', 'mi', 'kue',
                        'masakanJepang', 'masakanTiongkok', 'masakanItalia' ];
    for (const type of foodType) {
      const recipeRef = firebase.database().ref('resep/' + type);
      recipeRef.on('value', (snapshot) => {
        const snapshotVal = snapshot.val();
        for (const index in snapshotVal) {
          if (snapshotVal.hasOwnProperty(index)) {
            this.searchRecipe.push({
              id: index,
              title: snapshotVal[index].judul,
              type,
              imageUrl: snapshotVal[index].gambar});
          }
        }
      });
    }
    return this.searchRecipe;
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
    console.log('this.recipesDataSvc: ', this.recipesDataSvc);
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
    return this.recipeDataSvc;
  }
}
