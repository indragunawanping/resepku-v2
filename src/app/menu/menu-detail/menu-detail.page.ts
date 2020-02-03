import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-menu-detail',
  templateUrl: './menu-detail.page.html',
  styleUrls: ['./menu-detail.page.scss'],
})
export class MenuDetailPage implements OnInit {
  menuType: string;
  menuIndex: string;
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
          this.menuIndex = paramMap.get('menuIndex');
          this.recipeData = this.recipeService.getRecipeSvc(this.menuType, this.menuIndex);
          // console.log('recipeData2: ', this.recipeData);
          // console.log('recipeData2: ', this.recipeData['0']);
        } else {
          return;
        }
      }
    );
  }

}
