import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogOfferComponent } from './dialog-offer.component';

describe('DialogOfferComponent', () => {
  let component: DialogOfferComponent;
  let fixture: ComponentFixture<DialogOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogOfferComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
