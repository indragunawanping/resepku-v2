import { Component, OnInit } from '@angular/core';
import { StorageRecipe, StorageService } from '../../services/storage.service';
import { Storage } from '@ionic/storage';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bookmark',
  templateUrl: './bookmark.page.html',
  styleUrls: ['./bookmark.page.scss'],
})
export class BookmarkPage implements OnInit {
  bookmarks: StorageRecipe[] = [];

  ionViewWillEnter() {
    this.getBookmarks();
  }

  constructor(
    public storage: Storage,
    public alertController: AlertController,
    public storageService: StorageService,
    public router: Router,
    public toastController: ToastController
  ) {
  }

  ngOnInit() {
  }

  async getBookmarks(): Promise<any> {
    await this.storage.get('bookmarks').then((bookmarks: StorageRecipe[]) => {
      if (bookmarks) {
        this.bookmarks = [];
        for (const bookmarkKey in bookmarks) {
          if (bookmarkKey) {
            switch (bookmarks[bookmarkKey].type) {
              case 'masakanJepang':
                bookmarks[bookmarkKey].type = 'Masakan Jepang';
                break;
              case 'masakanTiongkok':
                bookmarks[bookmarkKey].type = 'Masakan Tiongkok';
                break;
              case 'masakanItalia':
                bookmarks[bookmarkKey].type = 'Masakan Italia';
                break;
            }
            this.bookmarks.push(bookmarks[bookmarkKey]);
          }
        }
      }
    });
  }

  handleItemClick(recipeType, recipeId) {
    switch (recipeType) {
      case 'Ikan/Seafood':
        recipeType = 'ikanSeafood';
        break;
      case 'Masakan Jepang':
        recipeType = 'masakanJepang';
        break;
      case 'Masakan Tiongkok':
        recipeType = 'masakanTiongkok';
        break;
      case 'Masakan Italia':
        recipeType = 'masakanItalia';
        break;
      default:
        recipeType = recipeType.toLowerCase();
    }
    this.router.navigate(['/tabs/beranda/' + recipeType + '/' + recipeId]);
  }

  async handleButtonDeleteAllBookmarkClick() {
    const alert = await this.alertController.create({
      message: '<strong>Hapus</strong> semua dari Bookmark?',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ya, Saya yakin',
          handler: async () => {
            await this.storageService.deleteAllBookmark();
            this.getBookmarks();
            this.deleteAllBookmarkToast();
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteAllBookmarkToast() {
    const toast = await this.toastController.create({
      message: 'Semua resep berhasil dihapus dari Bookmark.',
      duration: 500
    });
    toast.present();
  }

  async handleButtonDeleteClick(recipeTitle) {
    const alert = await this.alertController.create({
      message: '<strong>Hapus</strong> dari Bookmark?',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ya, Saya yakin',
          handler: async () => {
            await this.storageService.deleteBookmark(recipeTitle);
            this.getBookmarks();
            this.deleteBookmarkToast(recipeTitle);
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteBookmarkToast(recipeTitle) {
    const toast = await this.toastController.create({
      message: recipeTitle + ' berhasil dihapus dari Bookmark.',
      duration: 500
    });
    toast.present();
  }
}
