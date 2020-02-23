import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { Bookmark, StorageService } from '../../services/storage.service';
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
  menuTitle: string;
  recipesData: any;
  bookmark: Bookmark[] = [];
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
          this.recipesData = this.recipeService.getAllRecipesSvc(this.menuType);
        } else {
          return;
        }
      }
    );
    this.getBookmark();
  }

  getMenuTitle() {
    switch (this.menuType) {
      case 'daging':
        this.menuTitle = 'Daging';
        break;
      case 'nasi':
        this.menuTitle = 'Nasi';
        break;
      case 'sayuran':
        this.menuTitle = 'Vegetarian';
        break;
      case 'ikan':
        this.menuTitle = 'Ikan/Seafood';
        break;
      case 'mi':
        this.menuTitle = 'Mi';
        break;
      case 'kue':
        this.menuTitle = 'Kue';
        break;
      case 'masakanJepang':
        this.menuTitle = 'Masakan Jepang';
        break;
      case 'masakanTiongkok':
        this.menuTitle = 'Masakan Tiongkok';
        break;
      case 'masakanItalia':
        this.menuTitle = 'Masakan Italia';
        break;
      default:
        this.menuTitle = 'kosong';
    }
  }

  async getBookmark(): Promise <any> {
    await this.storage.get('bookmark').then((bookmarks: Bookmark[]) => {
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

  async handleBookmarkChange(recipeId, recipeTitle, recipeImageUrl) {
    this.isBookmark = await this.storageService.updateBookmark(recipeId, recipeTitle, this.menuTitle, recipeImageUrl);
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
      duration: 1500
    });
    toast.present();
  }
}
