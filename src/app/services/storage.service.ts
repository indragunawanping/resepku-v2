import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

export interface Bookmark {
  id: number;
  title: string;
  type: string;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  toKeepBookmark: Bookmark[] = [];
  sameBookmark = false;
  isBookmark: boolean;

  constructor(
    public storage: Storage
  ) {
  }

  async updateBookmark(recipeId, recipeTitle, menuType, recipeImageUrl) {
    await this.storage.get('bookmark').then((bookmarks: Bookmark[]) => {
      if (bookmarks) {
        this.toKeepBookmark = [];
        for (const bookmark in bookmarks) {
          if (bookmarks[bookmark].title !== recipeTitle) {
            this.toKeepBookmark.push(bookmarks[bookmark]);
          } else {
            this.sameBookmark = true;
            this.isBookmark = false;
          }
        }
        if (!this.sameBookmark) {
          this.toKeepBookmark.push({ id: recipeId, title: recipeTitle, type: menuType, imageUrl: recipeImageUrl });
          this.isBookmark = true;
        }
        this.storage.set('bookmark', this.toKeepBookmark);
        this.sameBookmark = false;
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
    await this.storage.get('bookmark').then((bookmarks: Bookmark[]) => {
      if (bookmarks) {
        this.toKeepBookmark = [];
        this.storage.set('bookmark', this.toKeepBookmark);
      }
    });
  }

  async deleteBookmark(recipeTitle) {
    await this.storage.get('bookmark').then((bookmarks: Bookmark[]) => {
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
}
