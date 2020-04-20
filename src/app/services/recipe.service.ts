import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Storage } from '@ionic/storage';

export interface Recipe {
  id?: string;
  imageUrl?: string;
  type?: string;
  title: string;
  portions?: string;
  duration?: string;
  ingredients?: Ingredient[];
  steps?: Step[];
  jaroWinklerDistance?: number;
}

export interface Ingredient {
  ingredientType: string;
  ingredientDetail: string[];
}

export interface Step {
  stepType: string;
  stepDetail: string[];
}

@Injectable({
  providedIn: 'root'
})

export class RecipeService {
  recipesByType: Recipe[] = [];
  recipeDetail: Recipe[] = [];
  forSearchRecipes: Recipe[] = [];
  mostSimilarRecipes: Recipe[] = [];
  recipeTypes = ['daging', 'nasi', 'vegetarian',
    'ikanSeafood', 'mi', 'kue',
    'masakanJepang', 'masakanTiongkok', 'masakanItalia'];

  constructor(public storage: Storage) {
  }

  extractStep(steps) {
    const formattedSteps: Step[] = [];
    for (const step of steps) {
      formattedSteps.push({
        stepType: step.jenisLangkah,
        stepDetail: step.langkahLangkah
      });
    }

    return formattedSteps;
  }

  extractIngredient(ingredients) {
    const formattedIngredients: Ingredient[] = [];
    for (const ingredient of ingredients) {
      formattedIngredients.push({
        ingredientType: ingredient.jenisBahan,
        ingredientDetail: ingredient.bahanBahan
      });
    }

    return formattedIngredients;
  }

  getRecipeDetail(recipeType, index) {
    const recipeRef = firebase.database().ref('resep/' + recipeType + '/' + index);
    this.recipeDetail = [];

    recipeRef.on('value', (snapshot) => {
      const snapshotVal = snapshot.val();
      let recipeDetailFromBackEnd;
      recipeDetailFromBackEnd = Object.values(snapshotVal);

      this.recipeDetail.push({
        id: index,
        imageUrl: recipeDetailFromBackEnd[5],
        type: recipeType,
        title: recipeDetailFromBackEnd[1],
        portions: recipeDetailFromBackEnd[4],
        duration: recipeDetailFromBackEnd[2],
        ingredients: this.extractIngredient(recipeDetailFromBackEnd[0]),
        steps: this.extractStep(recipeDetailFromBackEnd[3])
      });
    });

    return this.recipeDetail;
  }

  getRecipesByType(recipeType) {
    const recipeRef = firebase.database().ref('resep/' + recipeType);
    this.recipesByType = [];
    recipeRef.on('value', (snapshot) => {
      const snapshotVal = snapshot.val();
      for (const recipe of snapshotVal) {
        this.recipesByType.push({
          title: recipe.judul,
          imageUrl: recipe.urlGambar,
          portions: recipe.porsi,
          duration: recipe.lama
        });
      }
    });

    return this.recipesByType;
  }

  getForSearchRecipes() {
    for (const type of this.recipeTypes) {
      const recipeRef = firebase.database().ref('resep/' + type);
      recipeRef.on('value', (snapshot) => {
        const snapshotVal = snapshot.val();
        for (const index in snapshotVal) {
          if (snapshotVal.hasOwnProperty(index)) {
            // console.log('\'' + snapshotVal[index].judul + '\',');
            this.forSearchRecipes.push({
              id: index,
              title: snapshotVal[index].judul,
              type,
              imageUrl: snapshotVal[index].urlGambar
            });
          }
        }
      });
    }

    return this.forSearchRecipes;
  }

  getMostSimilarRecipes(listJaroWinklerDistance) {
    this.mostSimilarRecipes = [];
    for (const recipeType of this.recipeTypes) {
      const recipeRef = firebase.database().ref('resep/' + recipeType);
      recipeRef.on('value', (snapshot) => {
        const snapshotVal = snapshot.val();
        for (const index in snapshotVal) {
          if (snapshotVal.hasOwnProperty(index)) {
            for (const listJaroWinkler in listJaroWinklerDistance) {
              if (listJaroWinklerDistance.hasOwnProperty(listJaroWinkler)) {
                if ((snapshotVal[index].judul).toLowerCase() === listJaroWinklerDistance[listJaroWinkler].title) {
                  this.mostSimilarRecipes.push({
                    id: index,
                    title: snapshotVal[index].judul,
                    type: recipeType,
                    imageUrl: snapshotVal[index].urlGambar,
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
}
