import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController, ToastController } from '@ionic/angular';
import { StorageRecipe, StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  histories: StorageRecipe[] = [];

  ionViewWillEnter() {
    this.getHistories();
  }

  constructor(
    public storage: Storage,
    public alertController: AlertController,
    public storageService: StorageService,
    public toastController: ToastController
  ) {
  }

  ngOnInit() {
  }

  async getHistories() {
    await this.storage.get('histories').then((histories: StorageRecipe[]) => {
      if (histories) {
        this.histories = [];
        for (const historyKey in histories) {
          if (historyKey) {
            switch (histories[historyKey].type) {
              case 'ikanSeafood':
                histories[historyKey].type = 'Ikan/Seafood';
                break;
              case 'masakanJepang':
                histories[historyKey].type = 'Masakan Jepang';
                break;
              case 'masakanTiongkok':
                histories[historyKey].type = 'Masakan Tiongkok';
                break;
              case 'masakanItalia':
                histories[historyKey].type = 'Masakan Italia';
                break;
            }
            this.histories.push(histories[historyKey]);
          }
        }
      }
    });
  }

  async handleButtonDeleteAllHistoryClick() {
    const alert = await this.alertController.create({
      message: '<strong>Hapus</strong> semua dari History?',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ya, Saya yakin',
          handler: async () => {
            await this.storageService.deleteAllHistory();
            this.getHistories();
            this.deleteAllHistoryToast();
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteAllHistoryToast() {
    const toast = await this.toastController.create({
      message: 'Semua history berhasil dihapus.',
      duration: 500
    });
    toast.present();
  }

  async handleButtonDeleteClick(recipeTitle) {
    const alert = await this.alertController.create({
      message: '<strong>Hapus</strong> dari History?',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ya, Saya yakin',
          handler: async () => {
            await this.storageService.deleteHistory(recipeTitle);
            this.getHistories();
            this.deleteHistoryToast(recipeTitle);
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteHistoryToast(recipeTitle) {
    const toast = await this.toastController.create({
      message: recipeTitle + ' berhasil dihapus dari History.',
      duration: 500
    });
    toast.present();
  }
}
