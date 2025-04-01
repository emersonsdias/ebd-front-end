import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgeRangesManagementComponent } from './age-ranges-management.component';

describe('AgeRangesManagementComponent', () => {
  let component: AgeRangesManagementComponent;
  let fixture: ComponentFixture<AgeRangesManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgeRangesManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgeRangesManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
