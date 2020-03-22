import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Storage } from '@ionic/storage';

export interface SearchRecipe {
  id: string;
  bahan?: string;
  gambar: string;
  judul: string;
  lama?: string;
  langkah?: string;
  porsi?: string;
  type?: string;
  jaroWinklerDistance?: number;
}

@Injectable({
  providedIn: 'root'
})

export class RecipeService {
  recipesDataSvc: string[] = [];
  recipeDataSvc: string[] = [];
  searchRecipe: SearchRecipe[] = [];
  mostSimilarRecipe: SearchRecipe[] = [];
  foodType = ['daging', 'nasi', 'sayuran',
    'ikan', 'mi', 'kue',
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
              judul: snapshotVal[index].judul,
              type,
              gambar: snapshotVal[index].gambar
            });
          }
        }
      });
    }
    return this.searchRecipe;
  }

  getSearchedRecipe(listJaroWinklerDistance) {
    console.log('listJaroWinklerDistance service: ', listJaroWinklerDistance);
    for (const type of this.foodType) {
      const recipeRef = firebase.database().ref('resep/' + type);
      recipeRef.on('value', (snapshot) => {
        const snapshotVal = snapshot.val();
        for (const index in snapshotVal) {
          if (snapshotVal.hasOwnProperty(index)) {
            for (const listJaroWinkler in listJaroWinklerDistance) {
              if (listJaroWinklerDistance.hasOwnProperty(listJaroWinkler)) {
                if ((snapshotVal[index].judul).toLowerCase() === listJaroWinklerDistance[listJaroWinkler].title) {
                  console.log('sama');
                  this.mostSimilarRecipe.push({
                    id: index,
                    bahan: snapshotVal[index].bahan,
                    gambar: snapshotVal[index].gambar,
                    judul: snapshotVal[index].judul,
                    lama: snapshotVal[index].lama,
                    langkah: snapshotVal[index].langkah,
                    porsi: snapshotVal[index].porsi,
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
  }

  setSearchedRecipeEmpty() {
    this.mostSimilarRecipe = [];
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
