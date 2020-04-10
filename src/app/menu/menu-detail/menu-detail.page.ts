import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { DataStorage, StorageService } from '../../services/storage.service';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-menu-detail',
  templateUrl: './menu-detail.page.html',
  styleUrls: ['./menu-detail.page.scss'],
})
export class MenuDetailPage implements OnInit {
  menuType: string;
  menuIndex: string;
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
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(
      paramMap => {
        if (paramMap.has('menuType')) {
          this.menuType = paramMap.get('menuType');
          this.menuIndex = paramMap.get('menuIndex');
          this.recipes = this.recipeService.getRecipeSvc(this.menuType, this.menuIndex);
        } else {
          return;
        }
      }
    );
    console.log('this.recipeData: ', this.recipes);
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
    this.isBookmark = await this.storageService.updateBookmark(recipeId, recipeTitle, this.menuType, recipeImageUrl);
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
}
