import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController, ToastController } from '@ionic/angular';
import { DataStorage, StorageService } from '../../services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  history: DataStorage[] = [];

  ionViewWillEnter() {
    this.getHistory();
  }

  constructor(
    public storage: Storage,
    public alertController: AlertController,
    public storageService: StorageService,
    private router: Router,
    public toastController: ToastController
  ) {
  }
  ngOnInit() {
    // this.getHistory();
  }

  async getHistory() {
    await this.storage.get('history').then((histories: DataStorage[]) => {
      if (histories) {
        this.history = [];
        for (const history in histories) {
          if (history) {
            switch (histories[history].type) {
              case 'masakanJepang':
                histories[history].type = 'Masakan Jepang';
                break;
              case 'masakanTiongkok':
                histories[history].type = 'Masakan Tiongkok';
                break;
              case 'masakanItalia':
                histories[history].type = 'Masakan Italia';
                break;
            }
            this.history.push(histories[history]);
          }
        }
      }
    });
  }

  async handleButtonDeleteAllHistoryClick() {
    const alert = await this.alertController.create({
      message: '<strong>Hapus</strong> semua history?',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ya, Saya yakin',
          handler: async () => {
            await this.storageService.deleteAllHistory();
            this.getHistory();
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
      duration: 1500
    });
    toast.present();
  }

  handleItemClick(recipeType, recipeId) {

  }

  async handleButtonDeleteClick(recipeTitle) {
    const alert = await this.alertController.create({
      message: '<strong>Hapus</strong> dari history?',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ya, Saya yakin',
          handler: async () => {
            await this.storageService.deleteHistory(recipeTitle);
            this.getHistory();
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
      duration: 1500
    });
    toast.present();
  }
}
