import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementsPageComponent } from './managements-page.component';

describe('ManagementsPageComponent', () => {
  let component: ManagementsPageComponent;
  let fixture: ComponentFixture<ManagementsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagementsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagementsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
