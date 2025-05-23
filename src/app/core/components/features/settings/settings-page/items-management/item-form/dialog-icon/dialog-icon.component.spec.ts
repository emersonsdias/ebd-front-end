import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogIconComponent } from './dialog-icon.component';

describe('DialogIconComponent', () => {
  let component: DialogIconComponent;
  let fixture: ComponentFixture<DialogIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
