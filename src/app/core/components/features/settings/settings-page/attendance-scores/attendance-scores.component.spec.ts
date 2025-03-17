import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceScoresComponent } from './attendance-scores.component';

describe('AttendanceScoresComponent', () => {
  let component: AttendanceScoresComponent;
  let fixture: ComponentFixture<AttendanceScoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendanceScoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceScoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
