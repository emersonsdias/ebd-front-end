import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadquartersManagementComponent } from './headquarters-management.component';

describe('HeadquartersManagementComponent', () => {
  let component: HeadquartersManagementComponent;
  let fixture: ComponentFixture<HeadquartersManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeadquartersManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadquartersManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
