import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Storage } from '@ionic/storage';

export interface Recipe {
  id: string;
  imageUrl: string;
  type?: string;
  title: string;
  portions?: string;
  duration?: string;
  steps?: string;
  ingredients?: string;
  jaroWinklerDistance?: number;
}

@Injectable({
  providedIn: 'root'
})

export class RecipeService {
  recipesDataSvc: string[] = [];
  recipeDataSvc: string[] = [];
  searchRecipe: Recipe[] = [];
  mostSimilarRecipesSvc: Recipe[] = [];
  foodType = ['daging', 'nasi', 'vegetarian',
    'ikanSeafood', 'mi', 'kue',
    'masakanJepang', 'masakanTiongkok', 'masakanItalia'];

  constructor(public storage: Storage) {
  }

  getRecipe() {
    for (const type of this.foodType) {
      const recipeRef = firebase.database().ref('resep/' + type);
      recipeRef.on('value', (snapshot) => {
        const snapshotVal = snapshot.val();
        for (const index in snapshotVal) {
          if (snapshotVal.hasOwnProperty(index)) {
            this.searchRecipe.push({
              id: index,
              title: snapshotVal[index].judul,
              type,
              imageUrl: snapshotVal[index].gambar
            });
          }
        }
      });
    }
    return this.searchRecipe;
  }

  getSearchedRecipe(listJaroWinklerDistance) {
    this.mostSimilarRecipesSvc = [];
    for (const type of this.foodType) {
      const recipeRef = firebase.database().ref('resep/' + type);
      recipeRef.on('value', (snapshot) => {
        const snapshotVal = snapshot.val();
        for (const index in snapshotVal) {
          if (snapshotVal.hasOwnProperty(index)) {
            for (const listJaroWinkler in listJaroWinklerDistance) {
              if (listJaroWinklerDistance.hasOwnProperty(listJaroWinkler)) {
                if ((snapshotVal[index].judul).toLowerCase() === listJaroWinklerDistance[listJaroWinkler].title) {
                  this.mostSimilarRecipesSvc.push({
                    id: index,
                    ingredients: snapshotVal[index].bahan,
                    imageUrl: snapshotVal[index].gambar,
                    title: snapshotVal[index].judul,
                    duration: snapshotVal[index].lama,
                    steps: snapshotVal[index].langkah,
                    portions: snapshotVal[index].porsi,
                    type,
                    jaroWinklerDistance: listJaroWinklerDistance[listJaroWinkler].value
                  });
                }
              }
            }
          }
        }
      });
    }
    console.log('mostSimilarRecipe: ', this.mostSimilarRecipesSvc);
    return this.mostSimilarRecipesSvc;
  }

  setSearchedRecipeEmpty() {
    this.mostSimilarRecipesSvc = [];
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
    return this.recipeDataSvc;
  }

  getTest() {
    console.log('test');
    return 0;
  }
}
