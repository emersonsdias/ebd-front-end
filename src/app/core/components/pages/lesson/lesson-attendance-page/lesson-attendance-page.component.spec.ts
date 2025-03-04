import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonAttendancePageComponent } from './lesson-attendance-page.component';

describe('LessonAttendancePageComponent', () => {
  let component: LessonAttendancePageComponent;
  let fixture: ComponentFixture<LessonAttendancePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonAttendancePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonAttendancePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
