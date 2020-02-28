import { Component, OnInit } from '@angular/core';
import { Bookmark, StorageService } from '../../services/storage.service';
import { Storage } from '@ionic/storage';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SearchingData } from '../beranda/beranda.page';

@Component({
  selector: 'app-bookmark',
  templateUrl: './bookmark.page.html',
  styleUrls: ['./bookmark.page.scss'],
})
export class BookmarkPage implements OnInit {
  bookmark: Bookmark[] = [];
  searchingData1: SearchingData[] = [];
  searchingData2 = [];
  searchingData3 = [];
  constructor(
    public storage: Storage,
    public alertController: AlertController,
    public storageService: StorageService,
    private router: Router,
    public toastController: ToastController
  ) { }

  ngOnInit() {
    this.getBookmark();
  }

  async getBookmark(): Promise <any> {
    await this.storage.get('bookmark').then((bookmarks: Bookmark[]) => {
      if (bookmarks) {
        this.bookmark = [];
        for (const bookmark in bookmarks) {
          if (bookmark) {
            switch (bookmarks[bookmark].type) {
              case 'masakanJepang':
                bookmarks[bookmark].type = 'Masakan Jepang';
                break;
              case 'masakanTiongkok':
                bookmarks[bookmark].type = 'Masakan Tiongkok';
                break;
              case 'masakanItalia':
                bookmarks[bookmark].type = 'Masakan Italia';
                break;
            }
            this.bookmark.push(bookmarks[bookmark]);
          }
        }
      }
    });
  }

  async handleButtonDeleteAllClick() {
    const alert = await this.alertController.create({
        message: '<strong>Hapus</strong> semua bookmark?',
        buttons: [
          {
            text: 'Tidak',
            role: 'cancel',
            cssClass: 'secondary'
          }, {
            text: 'Ya, Saya yakin',
            handler: async () => {
              await this.storageService.deleteAllBookmark();
              this.getBookmark();
              this.deleteAllBookmarkToast();
            }
          }
        ]
      });
    await alert.present();
  }

  async handleButtonDeleteClick(recipeTitle) {
    const alert = await this.alertController.create({
      message: '<strong>Hapus</strong> dari bookmark?',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ya, Saya yakin',
          handler: async () => {
            await this.storageService.deleteBookmark(recipeTitle);
            this.getBookmark();
            this.deleteBookmarkToast(recipeTitle);
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteAllBookmarkToast() {
    const toast = await this.toastController.create({
      message: 'Semua Bookmark berhasil dihapus.',
      duration: 1500
    });
    toast.present();
  }

  async deleteBookmarkToast(recipeTitle) {
    const toast = await this.toastController.create({
      message: recipeTitle + ' berhasil dihapus dari Bookmark.',
      duration: 1500
    });
    toast.present();
  }

  handleItemClick(recipeType, recipeId) {
    console.log('recipeTypeBookmark: ', recipeType);
    switch (recipeType) {
      case 'Vegetarian':
        recipeType = 'sayuran';
        break;
      case 'Ikan/Seafood':
        recipeType = 'ikan';
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
}
