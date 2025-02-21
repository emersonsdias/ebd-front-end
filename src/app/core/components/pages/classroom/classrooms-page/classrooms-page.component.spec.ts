import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassroomsPageComponent } from './classrooms-page.component';

describe('ClassroomsPageComponent', () => {
  let component: ClassroomsPageComponent;
  let fixture: ComponentFixture<ClassroomsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassroomsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassroomsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
