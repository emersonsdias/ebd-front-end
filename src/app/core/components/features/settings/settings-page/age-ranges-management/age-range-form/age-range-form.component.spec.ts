import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgeRangeFormComponent } from './age-range-form.component';

describe('AgeRangeFormComponent', () => {
  let component: AgeRangeFormComponent;
  let fixture: ComponentFixture<AgeRangeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgeRangeFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgeRangeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
