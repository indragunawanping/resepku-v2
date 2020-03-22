import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { DataStorage, StorageService } from '../../services/storage.service';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';

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

@Component({
  selector: 'app-search-result-menu',
  templateUrl: './search-result-menu.page.html',
  styleUrls: ['./search-result-menu.page.scss'],
})
export class SearchResultMenuPage implements OnInit {
  mostSimilarRecipeData: SearchRecipe[] = [];
  menuType: string;
  menuTitle: string;
  bookmark: DataStorage[] = [];
  isBookmark: boolean;
  messageToast: string;

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
    this.mostSimilarRecipeData = this.recipeService.mostSimilarRecipe;
    console.log('mostSimilarRecipeData: ', this.mostSimilarRecipeData);
  }

  async handleBookmarkChange(recipeId, recipeTitle, recipeImageUrl) {
    this.isBookmark = await this.storageService.updateBookmark(recipeId, recipeTitle, this.menuTitle, recipeImageUrl);
    this.getBookmark();
    this.presentToast(recipeTitle);
  }

  async getBookmark(): Promise <any> {
    await this.storage.get('bookmark').then((bookmarks: DataStorage[]) => {
      if (bookmarks) {
        this.bookmark = [];
        for (const bookmark in bookmarks) {
          if (bookmark) {
            this.bookmark.push(bookmarks[bookmark]);
          }
        }
      }
    });
  }

  async presentToast(recipeTitle) {
    if (this.isBookmark) {
      this.messageToast = 'ditambahkan ke';
    } else {
      this.messageToast = 'dihapus dari';
    }
    const toast = await this.toastController.create({
      message: recipeTitle + ' berhasil ' + this.messageToast + ' Bookmark.',
      duration: 1000
    });
    toast.present();
  }

  handleHistoryChange(id, title, type, imageUrl) {
    this.storageService.updateHistory(id, title, type, imageUrl);
    console.log('id, title, type, imageUrl: ', id, title, type, imageUrl);
  }

  ionViewWillLeave() {
    this.recipeService.setSearchedRecipeEmpty();
  }

}
