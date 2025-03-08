import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogOfferManagementComponent } from './dialog-offer-management.component';

describe('DialogOfferManagementComponent', () => {
  let component: DialogOfferManagementComponent;
  let fixture: ComponentFixture<DialogOfferManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogOfferManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogOfferManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
