import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { Storage } from '@ionic/storage';
import { AlertController, LoadingController } from '@ionic/angular';
import { StorageService } from '../../services/storage.service';
import { Router } from '@angular/router';

export interface Distance {
  title: string;
  value: number;
}

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

@Component({
  selector: 'app-beranda',
  templateUrl: './beranda.page.html',
  styleUrls: ['./beranda.page.scss'],
})

export class BerandaPage implements OnInit {
  recipeSearchingData: Recipe[] = [];
  mostSimilarRecipes: Recipe[] = [];
  isSearchFocus = true;
  querySearch = '';

  constructor(
    public recipeService: RecipeService,
    public storage: Storage,
    public loadingController: LoadingController,
    public storageService: StorageService,
    private router: Router,
    public alertController: AlertController
  ) {
  }

  async ngOnInit() {
    this.presentLoading();
    if (this.recipeSearchingData.length === 0) {
      await this.getTitle();
    }
    document.getElementById('list-menu').style.display = 'none';
    const searchbar = document.querySelector('ion-searchbar');
    // searchbar.addEventListener('ionInput', this.handleInput);
    searchbar.addEventListener('ionFocus', this.handleFocus);
    searchbar.addEventListener('ionCancel', this.handleCancel);
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 1000
    });
    await loading.present();
  }

  async getTitle() {
    this.recipeSearchingData = await this.recipeService.getRecipe();
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

  calculateJaroDistance(searchQuery) {
    const listJaroWinklerDistance: Distance[] = [];
    let counter = 0;
    const string1 = searchQuery.toLowerCase();
    const string1Len = string1.length;
    for (const data of this.recipeSearchingData) {
      counter++;
      const string2 = data.title.toLowerCase();
      let jaroDistance = 0;
      let jaroWinklerDistance = 0;
      let totalPrefix = 0;
      let matches = 0;
      const string2Len = string2.length;
      let transpositions = 0;

      const string1Matches = [];
      const string2Matches = [];

      const maxMatchDistance = Math.floor(string2Len / 2) - 1;

      for (let i = 0; i < string1Len; i++) {
        const start = Math.max(0, i - maxMatchDistance);
        const end = Math.min(i + maxMatchDistance + 1, string2Len);

        for (let j = start; j < end; j++) {
          if (string1Matches[j]) {
            continue;
          }
          if (string1[i] !== string2[j]) {
            continue;
          }
          string1Matches[i] = true;
          string2Matches[j] = true;
          matches++;
          break;
        }
      }

      let k = 0;
      for (let a = 0; a < string1Len; a++) {
        // // if there are no matches in str1 continue
        if (!string1Matches[a]) {
          continue;
        }
        // // while there is no match in str2 increment k
        for (const string2match of string2Matches) {
          if (string2match === true) {
            break;
          }
        }
        // // increment transpositions
        if (string1[a] !== string2[k]) {
          transpositions++;
        }
        k++;
      }

      transpositions /= 2;

      jaroDistance = ((matches / string1Len) + (matches / string2Len) + ((matches - transpositions) / matches)) / 3.0;

      for (let i = 0; i < 4; i++) {
        if (string1[i] === string2[i]) {
          totalPrefix++;
        }
      }

      jaroWinklerDistance = jaroDistance + (totalPrefix * 0.1 * (1 - jaroDistance));


      if (jaroWinklerDistance >= 0.7) {
        listJaroWinklerDistance.push({
          title: string2,
          value: jaroWinklerDistance
        });
      }
    }
    this.recipeService.getSearchedRecipe(listJaroWinklerDistance);
    this.mostSimilarRecipes = this.recipeService.mostSimilarRecipesSvc.sort((a, b) =>
      (a.jaroWinklerDistance < b.jaroWinklerDistance) ? 1 : -1);
  }

  handleInput(event) {
    this.querySearch = event.target.value.toLowerCase();
    const itemList = Array.from(document.getElementById('searchRecipeList').children);
    let countFalse = 0;
    requestAnimationFrame(async () => {
      for (const item of itemList) {
        const shouldShow = item.textContent.toLowerCase().indexOf(this.querySearch) > -1;
        // @ts-ignore
        item.style.display = shouldShow ? 'block' : 'none';
        if (shouldShow === false) {
          countFalse++;
        }
        if (countFalse === itemList.length) {
          document.getElementById('list-none').style.display = 'block';
          this.calculateJaroDistance(this.querySearch);
        } else {
          document.getElementById('list-none').style.display = 'none';
        }
      }
    });

    if (this.querySearch.length > 0) {
      document.getElementById('list-menu').style.display = 'block';
    } else {
      document.getElementById('list-menu').style.display = 'none';
    }
  }

  handleFocus() {
    this.isSearchFocus = true;
    document.getElementById('grid-menu').style.display = 'none';
  }

  handleCancel() {
    this.isSearchFocus = false;
    document.getElementById('grid-menu').style.display = 'block';
  }

  handleHistoryChange(id, title, type, imageUrl) {
    this.storageService.updateHistory(id, title, type, imageUrl);
  }
}
