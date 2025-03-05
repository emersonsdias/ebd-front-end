import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonFormPageComponent } from './person-form-page.component';

describe('PersonFormPageComponent', () => {
  let component: PersonFormPageComponent;
  let fixture: ComponentFixture<PersonFormPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonFormPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
