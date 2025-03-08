import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogItemManagementComponent } from './dialog-item-management.component';

describe('DialogItemManagementComponent', () => {
  let component: DialogItemManagementComponent;
  let fixture: ComponentFixture<DialogItemManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogItemManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogItemManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
