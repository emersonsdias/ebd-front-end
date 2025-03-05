import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassroomFormPageComponent } from './classroom-form-page.component';

describe('ClassroomFormPageComponent', () => {
  let component: ClassroomFormPageComponent;
  let fixture: ComponentFixture<ClassroomFormPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassroomFormPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassroomFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
