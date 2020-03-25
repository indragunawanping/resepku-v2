import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { DataStorage, StorageService } from '../../services/storage.service';
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
  bookmark: DataStorage[] = [];
  isBookmark: boolean;
  messageToast: string;

  ionViewWillEnter() {
    this.getBookmark();
  }

  constructor(
    public recipeService: RecipeService,
    public storageService: StorageService,
    public storage: Storage,
    public toastController: ToastController,
  ) {
    this.getBookmark();
  }

  ngOnInit() {
    this.mostSimilarRecipeData = this.recipeService.mostSimilarRecipe.sort((a, b) =>
      (a.jaroWinklerDistance < b.jaroWinklerDistance) ? 1 : -1);
  }

  async handleBookmarkChange(recipeId, recipeTitle, recipeType, recipeImageUrl) {
    this.isBookmark = await this.storageService.updateBookmark(recipeId, recipeTitle, recipeType, recipeImageUrl);
    this.getBookmark();
    this.presentToast(recipeTitle);
  }

  async getBookmark(): Promise<any> {
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
      duration: 500
    });
    toast.present();
  }

  handleHistoryChange(id, title, type, imageUrl) {
    this.storageService.updateHistory(id, title, type, imageUrl);
  }

  ionViewWillLeave() {
    this.recipeService.setSearchedRecipeEmpty();
  }

}
