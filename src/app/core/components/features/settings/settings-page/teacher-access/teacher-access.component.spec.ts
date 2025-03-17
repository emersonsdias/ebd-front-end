import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherAccessComponent } from './teacher-access.component';

describe('TeacherAccessComponent', () => {
  let component: TeacherAccessComponent;
  let fixture: ComponentFixture<TeacherAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherAccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
