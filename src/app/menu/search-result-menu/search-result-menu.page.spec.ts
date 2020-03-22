import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SearchResultMenuPage } from './search-result-menu.page';

describe('SearchResultMenuPage', () => {
  let component: SearchResultMenuPage;
  let fixture: ComponentFixture<SearchResultMenuPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchResultMenuPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchResultMenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
