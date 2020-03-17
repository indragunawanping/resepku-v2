import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

export interface DataStorage {
  id: number;
  title: string;
  type: string;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  toKeepBookmark: DataStorage[] = [];
  toKeepHistory: DataStorage[] = [];
  sameDataStorage = false;
  isBookmark: boolean;

  constructor(
    public storage: Storage
  ) {
  }

  async updateBookmark(recipeId, recipeTitle, menuType, recipeImageUrl) {
    await this.storage.get('bookmark').then((bookmarks: DataStorage[]) => {
      if (bookmarks) {
        this.toKeepBookmark = [];
        for (const bookmark in bookmarks) {
          if (bookmarks[bookmark].title !== recipeTitle) {
            this.toKeepBookmark.push(bookmarks[bookmark]);
          } else {
            this.sameDataStorage = true;
            this.isBookmark = false;
          }
        }
        if (!this.sameDataStorage) {
          this.toKeepBookmark.push({ id: recipeId, title: recipeTitle, type: menuType, imageUrl: recipeImageUrl });
          this.isBookmark = true;
        }
        this.storage.set('bookmark', this.toKeepBookmark);
        this.sameDataStorage = false;
      } else {
        this.toKeepBookmark.push({ id: recipeId, title: recipeTitle, type: menuType, imageUrl: recipeImageUrl });
        this.storage.set('bookmark', this.toKeepBookmark);
        this.toKeepBookmark = [];
        this.isBookmark = true;
      }
    });
    return this.isBookmark;
  }

  async deleteAllBookmark() {
    await this.storage.get('bookmark').then((bookmarks: DataStorage[]) => {
      if (bookmarks) {
        this.toKeepBookmark = [];
        this.storage.set('bookmark', this.toKeepBookmark);
      }
    });
  }

  async deleteBookmark(recipeTitle) {
    await this.storage.get('bookmark').then((bookmarks: DataStorage[]) => {
      if (bookmarks) {
        this.toKeepBookmark = [];
        for (const bookmark in bookmarks) {
          if (bookmarks[bookmark].title !== recipeTitle) {
            this.toKeepBookmark.push(bookmarks[bookmark]);
          }
        }
        this.storage.set('bookmark', this.toKeepBookmark);
      }
    });
  }

  async updateHistory(recipeId, recipeTitle, menuType, recipeImageUrl) {
    console.log('2', recipeId, recipeTitle, menuType, recipeImageUrl);
    await this.storage.get('history').then((histories: DataStorage[]) => {
      if (histories) {
        this.toKeepHistory = [];
        for (const history in histories) {
          if (histories[history].title !== recipeTitle) {
            this.toKeepHistory.push(histories[history]);
            this.sameDataStorage = false;
          }
        }
        if (!this.sameDataStorage) {
          this.toKeepHistory.push({ id: recipeId, title: recipeTitle, type: menuType, imageUrl: recipeImageUrl });
        }
        this.storage.set('history', this.toKeepHistory);
        this.sameDataStorage = false;
      } else {
        this.toKeepHistory.push({ id: recipeId, title: recipeTitle, type: menuType, imageUrl: recipeImageUrl });
        this.storage.set('history', this.toKeepHistory);
        this.toKeepHistory = [];
      }
    });
  }

  async deleteAllHistory() {
    await this.storage.get('history').then((histories: DataStorage[]) => {
      if (histories) {
        this.toKeepHistory = [];
        this.storage.set('history', this.toKeepHistory);
      }
    });
  }

  async deleteHistory(recipeTitle) {
    await this.storage.get('history').then((histories: DataStorage[]) => {
      if (histories) {
        this.toKeepHistory = [];
        for (const history in histories) {
          if (histories[history].title !== recipeTitle) {
            this.toKeepHistory.push(histories[history]);
          }
        }
        this.storage.set('history', this.toKeepHistory);
      }
    });
  }
}
