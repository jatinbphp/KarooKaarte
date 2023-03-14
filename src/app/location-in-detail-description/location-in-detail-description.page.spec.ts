import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LocationInDetailDescriptionPage } from './location-in-detail-description.page';

describe('LocationInDetailDescriptionPage', () => {
  let component: LocationInDetailDescriptionPage;
  let fixture: ComponentFixture<LocationInDetailDescriptionPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationInDetailDescriptionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LocationInDetailDescriptionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
