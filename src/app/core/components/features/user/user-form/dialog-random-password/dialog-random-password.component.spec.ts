import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRandomPasswordComponent } from './dialog-random-password.component';

describe('DialogRandomPasswordComponent', () => {
  let component: DialogRandomPasswordComponent;
  let fixture: ComponentFixture<DialogRandomPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogRandomPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogRandomPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
