import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { StorageService } from '../../services/storage.service';

export interface HighestScoreRecipe {
  title: string;
  value: number;
}

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

@Component({
  selector: 'app-beranda',
  templateUrl: './beranda.page.html',
  styleUrls: ['./beranda.page.scss'],
})

export class BerandaPage implements OnInit {
  forSearchRecipes: Recipe[] = [];
  searchQuery = '';
  mostSimilarRecipes: Recipe[] = [];
  isSearchFocus = false;
  recipeType: string;
  recipeTypeDisplay: string;

  constructor(
    public recipeService: RecipeService,
    public loadingController: LoadingController,
    public storageService: StorageService,
    public alertController: AlertController
  ) {
  }

  async ngOnInit() {
    this.presentLoading();
    if (this.forSearchRecipes.length === 0) {
      this.getForSearchRecipes();
    }
    document.getElementById('list-recipe-type').style.display = 'none';
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 1000
    });
    await loading.present();
  }

  getForSearchRecipes() {
    this.forSearchRecipes = this.recipeService.getForSearchRecipes();
  }

  async handleExitApp() {
    const alert = await this.alertController.create({
      message: 'Anda yakin ingin <strong>keluar</strong>?',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ya, Saya yakin',
          handler: async () => {
            // @ts-ignore
            navigator.app.exitApp();
          }
        }
      ]
    });
    await alert.present();
  }

  handleInput(event) {
    this.searchQuery = event.target.value.toLowerCase();
    const recipeList = Array.from(document.getElementById('searchRecipeList').children);
    let falseCount = 0;
    requestAnimationFrame(async () => {
      for (const recipe of recipeList) {
        const shouldShow = recipe.textContent.toLowerCase().indexOf(this.searchQuery) > -1;
        // @ts-ignore
        recipe.style.display = shouldShow ? 'block' : 'none';
        if (shouldShow === false) {
          falseCount++;
        }
        if (falseCount === recipeList.length) {
          document.getElementById('list-none').style.display = 'block';
          this.calculateJaroDistance(this.searchQuery);
          // this.testCalculateJaroDistance(this.searchQuery);
        } else {
          document.getElementById('list-none').style.display = 'none';
        }
      }
    });

    if (this.searchQuery.length > 0) {
      document.getElementById('list-recipe-type').style.display = 'block';
    } else {
      document.getElementById('list-recipe-type').style.display = 'none';
    }
  }

  calculateJaroDistance(searchQuery) {
    const highestScoreRecipes: HighestScoreRecipe[] = [];
    const firstString = searchQuery.toLowerCase();
    const firstStringLen = firstString.length;
    for (const recipe of this.forSearchRecipes) {
      let jaroWinklerDistance = 0;
      const secondString = recipe.title.toLowerCase();
      const secondStringLen = secondString.length;

      const firstStringMatches = [];
      const secondStringMatches = [];

      const maxMatchDistance = Math.floor(secondStringLen / 2) - 1;
      let matches = 0;

      for (let i = 0; i < firstStringLen; i++) {
        const start = Math.max(0, i - maxMatchDistance);
        const end = Math.min(i + maxMatchDistance + 1, secondStringLen);

        for (let j = start; j < end; j++) {
          if (secondStringMatches[j]) {
            continue;
          }
          if (firstString[i] !== secondString[j]) {
            continue;
          }
          firstStringMatches[i] = true;
          secondStringMatches[j] = true;
          matches++;
          break;
        }
      }

      let k = 0;
      let transpositions = 0;
      for (let a = 0; a < firstStringLen; a++) {
        // // if there are no matches in str1 continue
        if (!firstStringMatches[a]) {
          continue;
        }
        // // while there is no match in str2 increment k
        while (!secondStringMatches[k]) {
          k++;
        }
        // // increment transpositions
        if (firstString[a] !== secondString[k]) {
          transpositions++;
        }
        k++;
      }

      transpositions = Math.ceil(transpositions / 2);

      let jaroDistance = 0;

      jaroDistance = ((matches / firstStringLen) + (matches / secondStringLen) + ((matches - transpositions) / matches)) / 3.0;

      let totalPrefix = 0;
      for (let i = 0; i < 4; i++) {
        if (firstString[i] === secondString[i]) {
          totalPrefix++;
        }
      }

      jaroWinklerDistance = jaroDistance + (totalPrefix * 0.1 * (1 - jaroDistance));


      if (jaroWinklerDistance >= 0.7) {
        highestScoreRecipes.push({
          title: secondString,
          value: jaroWinklerDistance
        });
      }
    }
    this.recipeService.getMostSimilarRecipes(highestScoreRecipes);
    this.mostSimilarRecipes = this.recipeService.mostSimilarRecipes.sort((a, b) =>
      (a.jaroWinklerDistance < b.jaroWinklerDistance) ? 1 : -1);
  }

  handleFocus() {
    this.isSearchFocus = true;
    document.getElementById('grid-menu').style.display = 'none';
  }

  handleCancel() {
    this.isSearchFocus = false;
    document.getElementById('grid-menu').style.display = 'block';
  }

  getRecipeTypeDisplay() {
    switch (this.recipeType) {
      case 'daging':
        this.recipeTypeDisplay = 'Daging';
        break;
      case 'nasi':
        this.recipeTypeDisplay = 'Nasi';
        break;
      case 'vegetarian':
        this.recipeTypeDisplay = 'Vegetarian';
        break;
      case 'ikanSeafood':
        this.recipeTypeDisplay = 'Ikan/Seafood';
        break;
      case 'mi':
        this.recipeTypeDisplay = 'Mi';
        break;
      case 'kue':
        this.recipeTypeDisplay = 'Kue';
        break;
      case 'masakanJepang':
        this.recipeTypeDisplay = 'Masakan Jepang';
        break;
      case 'masakanTiongkok':
        this.recipeTypeDisplay = 'Masakan Tiongkok';
        break;
      case 'masakanItalia':
        this.recipeTypeDisplay = 'Masakan Italia';
        break;
      default:
        this.recipeTypeDisplay = 'kosong';
    }
  }

  handleHistoryChange(id, recipeTitle, recipeType, recipeImageUrl) {
    this.recipeType = recipeType;
    this.getRecipeTypeDisplay();
    this.storageService.updateHistory(id, recipeTitle, this.recipeTypeDisplay, recipeImageUrl);
  }
}
