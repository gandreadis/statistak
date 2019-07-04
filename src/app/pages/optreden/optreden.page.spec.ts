import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {OptredenPage} from './optreden.page';

describe('OptredenPage', () => {
  let component: OptredenPage;
  let fixture: ComponentFixture<OptredenPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OptredenPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptredenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
