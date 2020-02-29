import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { Storage } from '@ionic/storage';
import { LoadingController } from '@ionic/angular';

export interface Distance {
  title: string;
  value: number;
}

export interface SearchingData {
  id: string;
  title: string;
  type: string;
}

const listTitle = [];
let listJaroDistance: Distance[] = [];
let querySearch = '';

async function getSugesstion() {
  console.log('jalan: ', querySearch);
  listJaroDistance = [];
  const string1 = querySearch.toLowerCase();
  const string1Len = string1.length;

  for (const string2 of listTitle) {
    console.log('test');
    let jaroDistance = 0;
    let matches = 0;
    const string2Len = string2.length;
    let transpositions = 0;

    const string1Matches = [];
    const string2Matches = [];

    const maxMatchDistance = Math.floor(string2Len / 2) - 1;

    for (let i = 0; i < string1Len; i++) {
      console.log('test');
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
    for (let i = 0; i < string1Len; i++) {
      console.log('test');
      // if there are no matches in str1 continue
      if (!string1Matches[i]) {
        continue;
      }
      // while there is no match in str2 increment k
      while (!string2Matches[k]) {
        k++;
      }
      // increment transpositions
      if (string1[i] !== string2[k]) {
        transpositions++;
      }
      k++;
    }

    console.log('test');
    transpositions /= 2;

    jaroDistance = ((matches / string1Len) + (matches / string2Len) + ((matches - transpositions) / matches)) / 3.0;
    if (!isNaN(jaroDistance)) {
      listJaroDistance.push({ title: string2, value: jaroDistance });
    }
    // console.log('string2: ', string2);
    // console.log('jaroDistance: ', jaroDistance);
  }
}

@Component({
  selector: 'app-beranda',
  templateUrl: './beranda.page.html',
  styleUrls: ['./beranda.page.scss'],
})

export class BerandaPage implements OnInit {
  searchingData: SearchingData[] = [];
  isSearchFocus = true;

  constructor(
    public recipeService: RecipeService,
    public storage: Storage,
    public loadingController: LoadingController
  ) {
  }

  async ngOnInit() {
    this.presentLoading();
    await this.getTitle();
    document.getElementById('list-menu').style.display = 'none';
    const searchbar = document.querySelector('ion-searchbar');
    searchbar.addEventListener('ionInput', this.handleInput);
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
    this.searchingData = await this.recipeService.getRecipe();
  }

  handleInput(event) {
    querySearch = event.target.value.toLowerCase();
    const itemList = Array.from(document.getElementById('searchRecipeList').children);
    let countFalse = 0;
    requestAnimationFrame(async () => {
      for (const item of itemList) {
        const shouldShow = item.textContent.toLowerCase().indexOf(querySearch) > -1;
        // @ts-ignore
        item.style.display = shouldShow ? 'block' : 'none';
        if (shouldShow === false) {
          countFalse++;
        }
        if (countFalse === itemList.length) {
          document.getElementById('list-none').style.display = 'block';
          try {
            // setTimeout(getSugesstion, 1000);
            // tslint:disable-next-line:only-arrow-functions
            // listJaroDistance.sort(function(a, b) {return b.value - a.value; } );
            // for (const jaro in listJaroDistance) {
            //   if (jaro) {
            //     console.log(jaro , listJaroDistance[jaro]);
            //   }
            // }
          } catch (e) {
            console.log('Error: ', e);
          }
        } else {
          document.getElementById('list-none').style.display = 'none';
        }
      }
    });

    if (querySearch.length > 0) {
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
}
