import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { StorageRecipe, StorageService } from '../../services/storage.service';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';

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
  selector: 'app-menus',
  templateUrl: './menus.page.html',
  styleUrls: ['./menus.page.scss'],
})

export class MenusPage implements OnInit {
  recipeType: string;
  recipeTypeDisplay: string;
  recipes: Recipe[];
  bookmarks: StorageRecipe[] = [];
  isBookmark: boolean;
  messageToast: string;

  ionViewWillEnter() {
    this.getBookmarks();
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    public recipeService: RecipeService,
    public storageService: StorageService,
    public storage: Storage,
    public toastController: ToastController,
  ) {
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(
      async paramMap => {
        if (paramMap.has('recipeType')) {
          this.recipeType = paramMap.get('recipeType');
          this.recipes = this.recipeService.getRecipesByType(this.recipeType);
          this.getRecipeTypeDisplay();
        } else {
          return;
        }
      }
    );
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

  async getBookmarks(): Promise<any> {
    await this.storage.get('bookmarks').then((bookmarks: StorageRecipe[]) => {
      if (bookmarks) {
        this.bookmarks = [];
        for (const bookmark in bookmarks) {
          if (bookmark) {
            this.bookmarks.push(bookmarks[bookmark]);
          }
        }
      }
    });
  }

  async handleBookmarkChange(recipeId, recipeTitle, recipeImageUrl) {
    this.isBookmark = await this.storageService.updateBookmark(recipeId, recipeTitle, this.recipeTypeDisplay, recipeImageUrl);
    this.getBookmarks();
    this.presentToast(recipeTitle);
  }

  async presentToast(recipeTitle) {
    if (this.isBookmark) {
      this.messageToast = 'ditambahkan ke';
    } else {
      this.messageToast = 'dihapus dari';
    }
    const toast = await this.toastController.create({
      message: recipeTitle + ' berhasil ' + this.messageToast + ' Bookmark.',
      duration: 500
    });
    toast.present();
  }

  handleHistoryChange(recipeId, recipeTitle, recipeType, recipeImageUrl) {
    this.recipeType = recipeType;
    this.getRecipeTypeDisplay();
    this.storageService.updateHistory(recipeId, recipeTitle, this.recipeTypeDisplay, recipeImageUrl);
  }
}
