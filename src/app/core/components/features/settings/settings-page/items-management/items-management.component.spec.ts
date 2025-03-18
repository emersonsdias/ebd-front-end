import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsManagementComponent } from './items-management.component';

describe('ItemsManagementComponent', () => {
  let component: ItemsManagementComponent;
  let fixture: ComponentFixture<ItemsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemsManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
