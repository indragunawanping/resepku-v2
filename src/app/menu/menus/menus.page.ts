import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { DataStorage, StorageService } from '../../services/storage.service';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';

export interface Bookmark {
  id: number;
  title: string;
  type: string;
}

@Component({
  selector: 'app-menus',
  templateUrl: './menus.page.html',
  styleUrls: ['./menus.page.scss'],
})
export class MenusPage implements OnInit {
  menuType: string;
  recipeTitle: string;
  recipes: any;
  bookmarks: DataStorage[] = [];
  isBookmark: boolean;
  messageToast: string;

  ionViewWillEnter() {
    this.getBookmark();
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    public recipeService: RecipeService,
    public storageService: StorageService,
    public storage: Storage,
    public toastController: ToastController,
  ) {
    this.getBookmark();
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(
      async paramMap => {
        if (paramMap.has('menuType')) {
          this.menuType = paramMap.get('menuType');
          this.getMenuTitle();
          this.recipes = this.recipeService.getAllRecipesSvc(this.menuType);
        } else {
          return;
        }
      }
    );
    this.getBookmark();
    console.log('recipesData: ', this.recipes);
  }

  getMenuTitle() {
    switch (this.menuType) {
      case 'daging':
        this.recipeTitle = 'Daging';
        break;
      case 'nasi':
        this.recipeTitle = 'Nasi';
        break;
      case 'vegetarian':
        this.recipeTitle = 'Vegetarian';
        break;
      case 'ikanSeafood':
        this.recipeTitle = 'Ikan/Seafood';
        break;
      case 'mi':
        this.recipeTitle = 'Mi';
        break;
      case 'kue':
        this.recipeTitle = 'Kue';
        break;
      case 'masakanJepang':
        this.recipeTitle = 'Masakan Jepang';
        break;
      case 'masakanTiongkok':
        this.recipeTitle = 'Masakan Tiongkok';
        break;
      case 'masakanItalia':
        this.recipeTitle = 'Masakan Italia';
        break;
      default:
        this.recipeTitle = 'kosong';
    }
  }

  async getBookmark(): Promise<any> {
    await this.storage.get('bookmark').then((bookmarks: DataStorage[]) => {
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
    this.isBookmark = await this.storageService.updateBookmark(recipeId, recipeTitle, this.recipeTitle, recipeImageUrl);
    this.getBookmark();
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

  handleHistoryChange(id, title, type, imageUrl) {
    this.storageService.updateHistory(id, title, type, imageUrl);
  }
}
