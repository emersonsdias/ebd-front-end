import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPersonComponent } from './dialog-person.component';

describe('DialogPersonComponent', () => {
  let component: DialogPersonComponent;
  let fixture: ComponentFixture<DialogPersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogPersonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
