import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InactiveRecordsComponent } from './inactive-records.component';

describe('InactiveRecordsComponent', () => {
  let component: InactiveRecordsComponent;
  let fixture: ComponentFixture<InactiveRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InactiveRecordsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InactiveRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
