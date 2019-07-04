import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {OptredensPage} from './optredens.page';

describe('OptredensPage', () => {
  let component: OptredensPage;
  let fixture: ComponentFixture<OptredensPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OptredensPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptredensPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
