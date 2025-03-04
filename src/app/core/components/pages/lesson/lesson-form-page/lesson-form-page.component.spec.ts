import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonFormPageComponent } from './lesson-form-page.component';

describe('LessonFormPageComponent', () => {
  let component: LessonFormPageComponent;
  let fixture: ComponentFixture<LessonFormPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonFormPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
