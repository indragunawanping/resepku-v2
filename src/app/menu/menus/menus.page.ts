import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-menus',
  templateUrl: './menus.page.html',
  styleUrls: ['./menus.page.scss'],
})
export class MenusPage implements OnInit {
  menuType: string;
  menuTitle: string;

  recipeData: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    public recipeService: RecipeService
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(
      paramMap => {
        if (paramMap.has('menuType')) {
          this.menuType = paramMap.get('menuType');
          this.getMenuTitle();
          this.recipeData = this.recipeService.getRecipesSvc(this.menuType);
        } else {
          return;
        }
      }
    );
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
        this.menuTitle = 'Sayuran';
        break;
      case 'ikan':
        this.menuTitle = 'Ikan';
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

}
