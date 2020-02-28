import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Storage } from '@ionic/storage';

export interface RecipeLocal {
  id: string;
  title: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})

export class RecipeService {
  recipesDataSvc: string[] = [];
  recipeDataSvc: string[] = [];
  recipeLocal1: RecipeLocal[] = [];
  recipeLocal2: RecipeLocal[] = [];
  recipeLocal3: RecipeLocal[] = [];

  constructor(public storage: Storage) {}

  async setRecipeLocal1() {
    const foodType1 = ['daging', 'nasi', 'sayuran'];
    for (const type of foodType1) {
      const recipeRef = firebase.database().ref('resep/' + type);
      recipeRef.on('value', (snapshot) => {
        const snapshotVal = snapshot.val();
        for (const index in snapshotVal) {
          if (snapshotVal.hasOwnProperty(index)) {
            this.recipeLocal1.push({
              id: index,
              title: snapshotVal[index].judul,
              type});
          }
        }
        this.storage.set('recipeLocal1', this.recipeLocal1);
      });
    }
    return this.recipeLocal1;
  }

  async setRecipeLocal2() {
    const foodType2 = ['ikan', 'mi', 'kue'];
    for (const type of foodType2) {
      const recipeRef = firebase.database().ref('resep/' + type);
      recipeRef.on('value', async (snapshot) => {
        const snapshotVal = snapshot.val();
        for (const index in snapshotVal) {
          if (snapshotVal.hasOwnProperty(index)) {
            this.recipeLocal2.push({
              id: index,
              title: snapshotVal[index].judul,
              type});
          }
        }
        await this.storage.set('recipeLocal2', this.recipeLocal2);
      });
    }
    await console.log('recipeLocal2', this.recipeLocal2);
  }

  async setRecipeLocal3() {
    const foodType3 = ['masakanJepang', 'masakanTiongkok', 'masakanItalia'];
    for (const type of foodType3) {
      const recipeRef = firebase.database().ref('resep/' + type);
      recipeRef.on('value', async (snapshot) => {
        const snapshotVal = snapshot.val();
        for (const index in snapshotVal) {
          if (snapshotVal.hasOwnProperty(index)) {
            this.recipeLocal3.push({
              id: index,
              title: snapshotVal[index].judul,
              type});
          }
        }
        await this.storage.set('recipeLocal3', this.recipeLocal3);
      });
    }
    await console.log('recipeLocal3', this.recipeLocal3);
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
