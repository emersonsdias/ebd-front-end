import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogVisitorComponent } from './dialog-visitor.component';

describe('DialogVisitorComponent', () => {
  let component: DialogVisitorComponent;
  let fixture: ComponentFixture<DialogVisitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogVisitorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogVisitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
