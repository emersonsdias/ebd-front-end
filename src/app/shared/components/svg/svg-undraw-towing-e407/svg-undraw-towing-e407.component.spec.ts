import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgUndrawTowingE407Component } from './svg-undraw-towing-e407.component';

describe('SvgUndrawTowingE407Component', () => {
  let component: SvgUndrawTowingE407Component;
  let fixture: ComponentFixture<SvgUndrawTowingE407Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgUndrawTowingE407Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvgUndrawTowingE407Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
