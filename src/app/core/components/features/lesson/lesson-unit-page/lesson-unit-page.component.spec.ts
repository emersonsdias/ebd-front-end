import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonUnitPageComponent } from './lesson-unit-page.component';

describe('LessonUnitPageComponent', () => {
  let component: LessonUnitPageComponent;
  let fixture: ComponentFixture<LessonUnitPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonUnitPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonUnitPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
